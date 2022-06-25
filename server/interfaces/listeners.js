const AbstractClass = require("./abstract.js");

class ImageReceivedListenerInterface extends AbstractClass {
    constructor() {
        super(ImageReceivedListenerInterface, ['recognizeObjects', 'emit']);
    }

    recognizeObjects(imageId, imageBase64) {

    }

    emit(imageId, imageBase64) {
    }
}

class ObjectsRecognizedListenerInterface extends AbstractClass {
    constructor() {
        super(ObjectsRecognizedListenerInterface, ['recognizeFeatures', 'recognizeFeaturesOfObject', 'emit']);
    }

    recognizeFeatures(imageId, objects) {
    }

    recognizeFeaturesOfObject(imageId, objectType, objectBase64) {
    }

    emit(eventName, ...args) {
    }
}

class FeatureValueGotListenerInterface extends AbstractClass {
    constructor() {
        super(FeatureValueGotListenerInterface, ['addFeatureValueToImageInfo', 'emit']);
    }

    addFeatureValueToImageInfo(imageId, objectId, featureValue) {
    }

    emit(imageId, objectId, featureValue) {
    }
}

class ObjectFoundListenerInterface extends AbstractClass {
    constructor() {
        super(ObjectFoundListenerInterface, ['locationFound', 'emit']);
    }

    locationFound(imageId) {
    }

    emit(imageId) {
    }
}

module.exports = {
    ImageReceivedListenerInterface,
    ObjectsRecognizedListenerInterface,
    FeatureValueGotListenerInterface,
    ObjectFoundListenerInterface,
};