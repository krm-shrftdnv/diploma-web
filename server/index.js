// imports
require('dotenv').config();
const path = require('path');
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const {v4: uuidv4} = require('uuid');
const sharp = require('sharp');
const amqp = require('amqplib/callback_api');
const util = require('util');

const {ImageDto} = require('./dto.js')

// configuration
const AMQP_HOST = process.env.AMQP_HOST
const AMQP_VHOST = process.env.AMQP_VHOST
const AMQP_PORT = process.env.AMQP_PORT
const AMQP_USERNAME = process.env.AMQP_USERNAME
const AMQP_PASSWORD = process.env.AMQP_PASSWORD
const AMQP_MRCNN_QUEUE_IN = process.env.AMQP_MRCNN_QUEUE_IN
const PORT = process.env.PORT || 3001;
const app = express();
app.use(express.static(path.resolve(__dirname, '../client/build')));
app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});

// functions
const handleError = (err, res) => {
    console.log(err)
    res
        .status(500)
        .contentType('text/plain')
        .end('Oops! Something went wrong!');
};
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, './storage/tmp/'));
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
})
const upload = multer({
    storage: storage
    // you might also want to set some limits: https://github.com/expressjs/multer#limits
});

async function getMetadata(path) {
    const metadata = await sharp(path).metadata();
    console.log(metadata);
    return metadata;
}

async function sendImageToRecognition(path) {
    try {
        await sharp(path)
            .toBuffer({resolveWithObject: true})
            .then(({data, info}) => {
                let imageId = uuidv4();
                let imageBase64 = data.toString('base64');
                let imageDto = new ImageDto(imageId, imageBase64);

                let amqpUrl = util.format("amqp://%s:%s@%s:%s/%s", AMQP_USERNAME, AMQP_PASSWORD, AMQP_HOST, AMQP_PORT, AMQP_VHOST);
                amqp.connect(amqpUrl, function (err, connection) {
                    if (err) {
                        handleError(err);
                    }
                    connection.createChannel(function (err, channel) {
                        if (err) {
                            handleError(err);
                        }
                        let jsonImage = JSON.stringify(imageDto);
                        channel.sendToQueue(AMQP_MRCNN_QUEUE_IN, Buffer.from(jsonImage));
                    })
                })
            })
            .catch(err => {
                handleError(err);
            });
    } catch (err) {
        handleError(err);
    }
}

// Routes
app.post(
    '/api/upload_image',
    upload.single('image'),
    (req, res) => {
        const tempPath = req.file.path;
        const targetPath = path.join(__dirname, "./storage/uploads", req.file.originalname);

        if (path.extname(req.file.originalname).toLowerCase() === ".jpg") {
            fs.rename(tempPath, targetPath, err => {
                if (err) return handleError(err, res);

                sendImageToRecognition(targetPath).then(r => {
                    res
                        .status(200)
                        .json({message: "File uploaded!"});
                })
            });
        } else {
            fs.unlink(tempPath, err => {
                if (err) return handleError(err, res);

                res
                    .status(403)
                    .json({message: "Only .jpg files are allowed!"});
            });
        }
    }
);

app.get('/api/*', (req, res) => {
    res.json({message: 'Hello from offigator!'});
});

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});
