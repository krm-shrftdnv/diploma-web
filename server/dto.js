const {Object} = require('./models.js')

class ImageDto {
    /**
     * @type string
     */
    id;

    /**
     * @type string
     */
    image_base64;

    constructor(id, image_base64) {
        this.id = id;
        this.image_base64 = image_base64;
    }
}

class MrcnnResponseDto {
    /**
     * @type string
     */
    id;

    /**
     * @type {Object[]}
     */
    objects;

    constructor(id, objects) {
        this.id = id;
        this.objects = objects;
    }
}

module.exports = {ImageDto, MrcnnResponseDto}