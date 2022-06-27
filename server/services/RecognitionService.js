const amqplib = require('amqplib/callback_api');
const util = require("util");
require('dotenv').config();

const AMQP_HOST = process.env.AMQP_HOST;
const AMQP_VHOST = process.env.AMQP_VHOST;
const AMQP_PORT = process.env.AMQP_PORT;
const AMQP_USERNAME = process.env.AMQP_USERNAME;
const AMQP_PASSWORD = process.env.AMQP_PASSWORD;

function handleError(err) {
    console.log('handling error');
    console.log(err);
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


class RecognitionService {

    static recognize(imageId, imageBase64) {
        let imageDto = new ObjectsRequestDto(imageId, imageBase64);
        const amqpUrl = util.format("amqp://%s:%s@%s:%s/%s", AMQP_USERNAME, AMQP_PASSWORD, AMQP_HOST, AMQP_PORT, AMQP_VHOST);
        amqplib.connect(amqpUrl, function (err, connection) {
            if (err) {
                handleError(err);
            }
            connection.createChannel(function (err, channel) {
                if (err) {
                    handleError(err);
                }
                let jsonImage = JSON.stringify(imageDto);
                channel.sendToQueue('mrcnn_in', Buffer.from(jsonImage));
            })
        })
    }

    static recognizeFeature(imageId, objectId, featureName, imageBase64) {
        let featureDto = new FeatureRequestDto(imageId, objectId, imageBase64)
        const amqpUrl = util.format("amqp://%s:%s@%s:%s/%s", AMQP_USERNAME, AMQP_PASSWORD, AMQP_HOST, AMQP_PORT, AMQP_VHOST);
        amqplib.connect(amqpUrl, function (err, connection) {
            if (err) {
                handleError(err);
            }
            connection.createChannel(function (err, channel) {
                if (err) {
                    handleError(err);
                }
                let jsonFeature = JSON.stringify(featureDto);
                channel.sendToQueue(featureName + '_in', Buffer.from(jsonFeature));
            })
        })
    }

    getObjects(imageId) {
        throw new Error('not implemented');
    }
}

module.exports = {RecognitionService};