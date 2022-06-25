const EventEmitter = require('node:events');

const {FeatureValueGotListenerInterface} = require('../interfaces/listeners')

class FeatureValueGotEmitter extends EventEmitter{}

class FeatureValueGotListener extends FeatureValueGotListenerInterface {
    emitter;

    constructor() {
        super();
        this.emitter = new FeatureValueGotEmitter();
        this.emitter.on('addFeatureValueToImageInfo', (imageId, objectId, featureValue) => {
            this.addFeatureValueToImageInfo(imageId, objectId, featureValue);
        })
    }

    addFeatureValueToImageInfo(imageId, objectId, featureValue) {

    }

    emit(imageId, objectId, featureValue) {
        this.emitter.emit('addFeatureValueToImageInfo', imageId, objectId, featureValue);
    }
}