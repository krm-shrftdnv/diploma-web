const amqplib = require('amqplib/callback_api');
const util = require("util");
const {ObjectsRequestDto, FeatureRequestDto} = require("../dto.js");

const {RecognitionServiceInterface} = require("../interfaces/services.js");
const {amqp} = require("../components/amqp.js")
const {handleError} = require("../components/error.js")

class RecognitionService extends RecognitionServiceInterface {

    static recognize(imageId, imageBase64) {
        let imageDto = new ObjectsRequestDto(imageId, imageBase64);
        let amqpUrl = util.format("amqp://%s:%s@%s:%s/%s", amqp.AMQP_USERNAME, amqp.AMQP_PASSWORD, amqp.AMQP_HOST, amqp.AMQP_PORT, amqp.AMQP_VHOST);
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
        let amqpUrl = util.format("amqp://%s:%s@%s:%s/%s", amqp.AMQP_USERNAME, amqp.AMQP_PASSWORD, amqp.AMQP_HOST, amqp.AMQP_PORT, amqp.AMQP_VHOST);
        let featureDto = new FeatureRequestDto(imageId, objectId, imageBase64)
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