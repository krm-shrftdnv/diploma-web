// imports
require('dotenv').config();
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const {v4: uuidv4} = require('uuid');
const cors = require('cors');
const {ImageStatus} = require("./enums");

const {handleError} = require("./components/error");
const {RecognizingObjectsCacheStorage} = require('./components/RecognizingObjectCacheStorage');
const {DB} = require('./components/db');
const {Map} = require('./models');
const {ImageReceivedListener} = require('./listeners/ImageReceivedListener');

// configuration
const PORT = process.env.PORT || 3001;
const app = express();
const imageReceivedListener = new ImageReceivedListener();
const storage = RecognizingObjectsCacheStorage.getInstance();
const db = DB.getInstance();
app.use(express.static(path.resolve(__dirname, '../client/build')));
app.use(bodyParser.json({limit: '50mb'}));
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
}))
app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
db.sequelize.sync({alter: true}).then(r => console.log('[*] database validated'));

// routes
app.get('/api/maps', (req, res) => {
    Map.findAll().then((maps) => {
        res.json(maps);
    }).catch(err => {
        handleError(err, res);
    });
});

app.get('/api/map/:mapId', (req, res) => {
    Map.findByPk(req.params.mapId).then((map) => {
        res.json(map);
    }).catch(err => {
        handleError(err, res);
    })
});

app.post('/api/recognize', (req, res) => {
    let data = req.body;
    console.log(data.map_id);
    let imageBase64 = data.image;
    let mapId = data.map_id;
    let imageId = uuidv4();
    storage.addImage(imageId, imageBase64, mapId);
    // setInterval(() => {
    //     storage.setImageStatus(imageId, ImageStatus.READY);
    //     storage.setMapImage(imageId, imageBase64);
    // }, 15000);
    imageReceivedListener.emit(imageId, imageBase64);
    res.json({'image_id': imageId});
});

app.get('/api/get_info', (req, res) => {
    let imageId = req.query.image_id;
    if (storage.hasImage(imageId)) {
        /**
         *
         * @type {RecognizingImageDto}
         */
        let imageInfo = storage.getImageInfo(imageId);
        res.json(imageInfo);
    }
    res.status(404);
});

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});
