const AbstractClass = require("./abstract.js");

class RecognitionServiceInterface extends AbstractClass {
    constructor() {
        super(RecognitionServiceInterface, ['recognize', 'getObjects']);
    }

    static recognize(imageId, imageBase64) {
    }

    static recognizeFeature(imageId, objectId, featureName, imageBase64) {
    }

    getObjects(imageId) {
    }
}

class FileServiceInterface extends AbstractClass {
    constructor() {
        super(FileServiceInterface, ['saveImage', 'saveImagePart', 'readImageToBytes']);
    }

    saveImage(imageId, imageBytes) {
    }

    saveImagePart(imageId, subdirectoryName, partId) {
    }

    readImageToBytes(imagePath) {
    }
}

module.exports = {RecognitionServiceInterface, FileServiceInterface};