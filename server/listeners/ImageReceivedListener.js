const EventEmitter = require('node:events');

const {RecognitionService: recognitionService} = require('../services/RecognitionService');
const {ImageReceivedListenerInterface} = require('../interfaces/listeners')

class ImageReceivedEmitter extends EventEmitter {
}

class ImageReceivedListener extends ImageReceivedListenerInterface {

    emitter;

    constructor() {
        super();
        this.emitter = new ImageReceivedEmitter();
        this.emitter.on('recognizeObjects', (imageId, imageBase64) => {
            this.recognizeObjects(imageId, imageBase64);
        })
    }

    recognizeObjects(imageId, imageBase64) {
        recognitionService.recognize(imageId, imageBase64);
    }

    emit(imageId, imageBase64) {
        this.emitter.emit('recognizeObjects', imageId, imageBase64);
    }
}

module.exports = {ImageReceivedListener};