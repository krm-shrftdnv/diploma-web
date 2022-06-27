const EventEmitter = require('events');

const {ObjectsRecognizedListenerInterface} = require('../interfaces/listeners')
const {ObjectDto} = require('../dto');

class ObjectsRecognizedEmitter extends EventEmitter {}

class ObjectsRecognizedListener extends ObjectsRecognizedListenerInterface {

    emitter;

    constructor() {
        super();
        this.emitter = new ObjectsRecognizedEmitter();
        this.emitter.on('recognizeFeatures', (imageId, objects) => {
            this.recognizeFeatures(imageId, objects);
        });
        this.emitter.on('recognizeFeaturesOfObject', (imageId, objectType, objectBase64) => {
            this.recognizeFeaturesOfObject(imageId, objectType, objectBase64);
        });
    }

    /**
     * @param imageId : string
     * @param objects : ObjectDto[]
     */
    recognizeFeatures(imageId, objects) {
        for (let object in objects) {
            this.recognizeFeaturesOfObject(imageId, object.type, object.imageBase64)
        }
    }

    /**
     * @param imageId : string
     * @param objectType : string
     * @param objectBase64 : string
     */
    recognizeFeaturesOfObject(imageId, objectType, objectBase64) {

    }

    emit(eventName, imageId, objectBase64 = null, objectType = null, objects = []) {
        switch (eventName) {
            case 'recognizeFeatures': {
                this.emitter.emit('recognizeFeatures', imageId, objects);
                break;
            }
            case 'recognizeFeaturesOfObject': {
                this.emitter.emit('recognizeFeaturesOfObject', imageId, objectType, objectBase64);
                break;
            }
        }
    }
}

module.exports = {ObjectsRecognizedListener};