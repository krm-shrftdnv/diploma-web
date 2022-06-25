const {FeatureName} = require("./enums");
const {ImageStatus} = require("./enums.js");

class FeatureDto {
    /**
     * @type string
     */
    name;
    /**
     * @type string
     */
    value;

    constructor(name, value) {
        this.name = name;
        this.value = value;
    }
}

class ObjectDto {
    /**
     * @type string
     */
    type;

    /**
     * @type string
     */
    imageBase64;

    /**
     * @type FeatureDto[]
     */
    features;

    constructor(type, imageBase64, features = []) {
        this.type = type;
        this.imageBase64 = imageBase64;
        this.features = features;
    }
}

class RecognizingImageDto {
    /**
     * @type string
     */
    imageId;
    /**
     * @type string
     */
    imageBase64;
    /**
     * @type int
     */
    mapId;

    /**
     * @type {string|null}
     */
    mapImageBase64 = null;

    /**
     *
     * @type {string|null}
     */
    location = null;

    /**
     * @type ObjectDto[]
     */
    objects;

    /**
     * @type string
     */
    status;

    constructor(imageId, imageBase64, mapId, objects = [], status = ImageStatus.PROCESSING) {
        this.imageId = imageId;
        this.imageBase64 = imageBase64;
        this.mapId = mapId;
        this.objects = objects;
        this.status = status;
    }

    getTexts() {
        let texts = [];

        for (let object in this.objects) {
            for (let feature in object.features) {
                if (feature.name === FeatureName.TEXT) {
                    texts.push(feature.value);
                }
            }
        }
        return texts;
    }

    toJSON() {
        return {
            image_id: this.imageId,
            status: this.status,
            location_image: this.mapImageBase64,
            location: this.location,
            recognized_image: this.imageBase64,
            texts: this.getTexts(),
        };
    }
}

class ObjectsRequestDto {
    /**
     * @type string
     */
    id;

    /**
     * @type string
     */
    imageBase64;

    constructor(id, imageBase64) {
        this.id = id;
        this.imageBase64 = imageBase64;
    }
}

class ObjectsResponseDto {
    /**
     * @type string
     */
    id;

    /**
     * @type {ObjectDto[]}
     */
    objects;

    constructor(id, objects = []) {
        this.id = id;
        this.objects = objects;
    }
}

class FeatureRequestDto {
    imageId;
    objectId;
    objectBase64;

    constructor(imageId, objectId, objectBase64) {
        this.imageId = imageId;
        this.objectId = objectId;
        this.objectBase64 = objectBase64;
    }
}

class TextsResponseDto {
    imageId;
    objectId;
    texts;

    constructor(imageId, objectId, texts = []) {
        this.imageId = imageId;
        this.objectId = objectId;
        this.texts = texts;
    }
}

class ColorResponseDto {
    imageId;
    objectId;
    colors;

    constructor(imageId, objectId, colors = []) {
        this.imageId = imageId;
        this.objectId = objectId;
        this.colors = colors;
    }
}

module.exports = {
    ObjectsRequestDto,
    RecognizingImageDto,
    ObjectsResponseDto,
    ObjectDto,
    FeatureDto,
    FeatureRequestDto,
    TextsResponseDto,
    ColorResponseDto,
}