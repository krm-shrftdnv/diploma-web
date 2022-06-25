const AbstractClass = require("./abstract.js");
const {RecognizingImageDto} = require("../dto.js");

class RecognizingObjectStorageInterface extends AbstractClass {
    constructor() {
        super(RecognizingObjectStorageInterface, ['addObject', 'addFeatureValue', 'getObjectInfo', 'getObjectStatus', 'setObjectReady', 'hasImage', 'getImageStatus', 'setImageStatus'])
    }

    /**
     * @param string imageId
     * @param string imageBase64
     * @param int mapId
     */
    addImage(imageId, imageBase64, mapId) {
    }

    /**
     * @param string imageId
     * @param string objectType
     * @param string objectImageBase64
     *
     * @return int objectId
     */
    addObject(imageId, objectType, objectImageBase64) {

    }

    /**
     * @param string imageId
     * @param int objectId
     * @param string feature
     * @param string value
     */
    addFeatureValue(imageId, objectId, feature, value) {
    }

    /**
     * @param string imageId
     *
     * @return RecognizingImageDto
     */
    getImageInfo(imageId) {
    }

    /**
     * @param string imageId
     * @return boolean
     */
    hasImage(imageId) {
    }

    /**
     * @param string imageId
     *
     * @return string status
     */
    getImageStatus(imageId) {
    }

    /**
     * @param imageId
     * @param status
     */
    setImageStatus(imageId, status) {
    }
}

module.exports = {RecognizingObjectStorageInterface};