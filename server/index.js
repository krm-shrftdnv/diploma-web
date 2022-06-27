// imports
const amqplib = require("amqplib/callback_api");
const NodeCache = require("node-cache");

require('dotenv').config();
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const {v4: uuidv4} = require('uuid');
const cors = require('cors');
const util = require("util");
// const {ObjectsRequestDto} = require("./dto");
// const {ImageStatus} = require("./enums");

// const {handleError} = require("./components/error");
// const {RecognizingObjectsCacheStorage} = require('./components/RecognizingObjectCacheStorage');
// const {DB} = require('./components/db');
const {Map} = require('./models');
// const {ImageReceivedListener} = require('./listeners/ImageReceivedListener');
const { QueryTypes } = require('sequelize');
const {Sequelize} = require('sequelize');

const PG_HOST = process.env.PG_HOST
const PG_PORT = process.env.PG_PORT
const PG_USERNAME = process.env.PG_USERNAME
const PG_PASSWORD = process.env.PG_PASSWORD
const PG_DB_NAME = process.env.PG_DB_NAME

const AMQP_HOST = process.env.AMQP_HOST;
const AMQP_VHOST = process.env.AMQP_VHOST;
const AMQP_PORT = process.env.AMQP_PORT;
const AMQP_USERNAME = process.env.AMQP_USERNAME;
const AMQP_PASSWORD = process.env.AMQP_PASSWORD;

// configuration
const PORT = process.env.PORT || 3001;
const app = express();
// const imageReceivedListener = new ImageReceivedListener();
// const storage = RecognizingObjectsCacheStorage.getInstance();
// const db = DB.getInstance();
const sequelize = new Sequelize({
    database: PG_DB_NAME,
    username: PG_USERNAME,
    password: PG_PASSWORD,
    host: PG_HOST,
    port: PG_PORT,
    dialect: "postgres",
    dialectOptions: {
        ssl: {
            require: true, // This will help you. But you will see nwe error
            rejectUnauthorized: false // This line will fix new error
        }
    },
});
const cache = new NodeCache({stdTTL: 600, checkperiod: 650});
app.use(express.static(path.resolve(__dirname, '../client/build')));
app.use(bodyParser.json({limit: '50mb'}));
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
}))
app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
sequelize.sync({alter: true}).then(r => console.log('[*] database validated'));
// db.sequelize.sync({alter: true}).then(r => console.log('[*] database validated'));


class RecognizingImageDto {
    /**
     * @type string
     */
    imageId;
    /**
     * @type string
     */
    imageBase64;
    /**
     * @type int
     */
    mapId;

    /**
     * @type {string|null}
     */
    location_image = null;

    /**
     *
     * @type {string|null}
     */
    location = null;

    /**
     * @type ObjectDto[]
     */
    objects;

    /**
     * @type string
     */
    status;

    constructor(imageId, imageBase64, mapId, objects = [], status = 'processing') {
        this.imageId = imageId;
        this.imageBase64 = imageBase64;
        this.mapId = mapId;
        this.objects = objects;
        this.status = status;
    }

    getTexts() {
        let texts = [];

        for (let object in this.objects) {
            for (let feature in object.features) {
                if (feature.name === 'text') {
                    texts.push(feature.value);
                }
            }
        }
        return texts;
    }

    /**
     * Transforms the machine instance to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON() {
        return {
            image_id: this.imageId,
            status: this.status,
            location_image: this.location_image,
            location: this.location,
            recognized_image: this.imageBase64,
            texts: this.getTexts(),
        };
    }
}

class ObjectsRequestDto {
    /**
     * @type string
     */
    id;

    /**
     * @type string
     */
    imageBase64;

    constructor(id, imageBase64) {
        this.id = id;
        this.imageBase64 = imageBase64;
    }
}


const handleError = (err, res) => {
    console.log(err)
    res
        .status(500)
        .contentType('text/plain')
        .end('Oops! Something went wrong!');
};

// routes
app.get('/api/maps', (req, res) => {
    sequelize.query("SELECT * FROM map", { type: QueryTypes.SELECT }).then((maps) => {
        res.json(maps);
    }).catch(err => {
        handleError(err, res);
    });
    //
    // Map.findAll().then((maps) => {
    //     res.json(maps);
    // }).catch(err => {
    //     handleError(err, res);
    // });
});

app.get('/api/map/:mapId', (req, res) => {
    sequelize.query("SELECT * FROM map where id = :mapId", {
        replacements: { mapId: req.params.mapId},
        type: QueryTypes.SELECT
    }).then((maps) => {
        res.json(maps);
    }).catch(err => {
        handleError(err, res);
    });
    // Map.findByPk(req.params.mapId).then((map) => {
    //     res.json(map);
    // }).catch(err => {
    //     handleError(err, res);
    // })
});

app.post('/api/recognize', (req, res) => {
    let data = req.body;
    console.log(data.map_id);
    let imageBase64 = data.image;
    let mapId = data.map_id;
    let imageId = uuidv4();
    let recognizingImage = new RecognizingImageDto(imageId, imageBase64, mapId);
    recognizingImage.status = 'processing';
    cache.set(imageId, JSON.stringify(recognizingImage))
    // storage.addImage(imageId, imageBase64, mapId);
    // setInterval(() => {
    //     storage.setImageStatus(imageId, ImageStatus.READY);
    //     storage.setMapImage(imageId, imageBase64);
    // }, 15000);
    // imageReceivedListener.emit(imageId, imageBase64);
    let imageDto = new ObjectsRequestDto(imageId, imageBase64);
    const amqpUrl = util.format("amqp://%s:%s@%s:%s/%s", AMQP_USERNAME, AMQP_PASSWORD, AMQP_HOST, AMQP_PORT, AMQP_VHOST);
    amqplib.connect(amqpUrl, function (err, connection) {
        if (err) {
            handleError(err);
        }
        connection.createChannel(function (err, channel) {
            if (err) {
                handleError(err);
            }
            let jsonImage = JSON.stringify(imageDto);
            channel.sendToQueue('objects_in', Buffer.from(jsonImage));
        })
    })
    res.json({'image_id': imageId});
});

app.get('/api/get_info', (req, res) => {
    let imageId = req.query.image_id;
    if (cache.has(imageId)) {
        /**
         *
         * @type {RecognizingImageDto}
         */
        let imageInfo = JSON.parse(cache.get(imageId));
        res.json(imageInfo);
    }
    res.status(404);
});

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});
