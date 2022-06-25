// imports
require('dotenv').config();
const path = require('path');
const express = require('express');
const {v4: uuidv4} = require('uuid');

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
    let imageBase64 = req.body.image;
    let mapId = req.body.map_id;
    let imageId = uuidv4();
    storage.addImage(imageId, imageBase64, mapId);
    imageReceivedListener.emit(imageId, imageBase64);
    res.status(200);
});

app.get('/api/get_info', (req, res) => {
    let imageId = req.query.image_id;
    if (storage.hasImage(imageId)) {
        let imageInfo = storage.getImageInfo(imageId);
        res.json(imageInfo.toJSON());
    }
    res.status(404);
});

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});
