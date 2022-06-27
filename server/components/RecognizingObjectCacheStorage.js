const NodeCache = require("node-cache");
const {ObjectDto, FeatureDto, RecognizingImageDto} = require("../dto.js");
const {ImageStatus} = require("../enums.js");
const {RecognizingObjectStorageInterface} = require("../interfaces/components.js");
const {QueryTypes} = require('sequelize');
const sequelize = require('sequelize');
const {LocationService} = require('../services/LocationService');

class RecognizingObjectsCacheStorage extends RecognizingObjectStorageInterface {
    constructor() {
        super();
        this.cache = new NodeCache({stdTTL: 600, checkperiod: 650});
    }

    static getInstance() {
        if (!this.cache) {
            return new this;
        }
        return this;
    }

    addImage(imageId, imageBase64, mapId) {
        let recognizingImage = new RecognizingImageDto(imageId, imageBase64, mapId);
        recognizingImage.status = ImageStatus.PROCESSING;
        this.cache.set(imageId, JSON.stringify(recognizingImage))
    }

    addObject(imageId, objectType, objectImageBase64) {
        let recognizingImage = JSON.parse(this.cache.get(imageId));
        let objectId = recognizingImage.objects.length;
        recognizingImage.objects[objectId] = new ObjectDto(objectType, objectImageBase64)
        this.cache.set(imageId, JSON.stringify(recognizingImage))
        return objectId;
    }

    addFeatureValue(imageId, objectId, feature, value) {
        /**
         * @type RecognizingImageDto
         */
        let recognizingImage = JSON.parse(this.cache.get(imageId));
        recognizingImage.objects[objectId].features.push(new FeatureDto(feature, value));

        let featureNamesQuery = "select feature.name from feature \n" +
            "join object_type_feature otf on feature.id = otf.feature_id\n" +
            "join object_type ot on ot.id = otf.object_type_id\n" +
            "where ot.name = '" + recognizingImage.objects[objectId].type + "'";
        let featureNames = sequelize.query(featureNamesQuery, {type: QueryTypes.SELECT}).then();
        if (featureNames.length === recognizingImage.objects[objectId].features.length) {
            let location = LocationService.getLocationByImageInfo(recognizingImage);
            if (location !== null) {
                recognizingImage.location = 'latitude: ' + location['latitude'] + ', longitude: ' + location['longitude'];
                this.setImageStatus(imageId, ImageStatus.READY);
            } else {
                this.setImageStatus(imageId, ImageStatus.ERROR);
            }
        }
        this.cache.set(imageId, JSON.stringify(recognizingImage));
    }

    hasImage(imageId) {
        return this.cache.has(imageId);
    }

    /**
     * @param string imageId
     *
     * @return RecognizingImageDto
     */
    getImageInfo(imageId) {
        return JSON.parse(this.cache.get(imageId));
    }

    getImageStatus(imageId) {
        let recognizingImage = JSON.parse(this.cache.get(imageId));
        return recognizingImage.status;
    }

    setImageStatus(imageId, status) {
        let recognizingImage = JSON.parse(this.cache.get(imageId));
        recognizingImage.status = status;
        this.cache.set(imageId, JSON.stringify(recognizingImage))
    }

    setMapImage(imageId, imageBase64) {
        let recognizingImage = JSON.parse(this.cache.get(imageId));
        recognizingImage.location_image = imageBase64;
        this.cache.set(imageId, JSON.stringify(recognizingImage))
    }
}

module.exports = {RecognizingObjectsCacheStorage};