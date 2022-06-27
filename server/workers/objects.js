const amqplib = require('amqplib/callback_api');
const util = require("util");
const sequelize = require("sequelize");
const NodeCache = require("node-cache");
const {QueryTypes} = require("sequelize");
require('dotenv').config();

const AMQP_HOST = process.env.AMQP_HOST;
const AMQP_VHOST = process.env.AMQP_VHOST;
const AMQP_PORT = process.env.AMQP_PORT;
const AMQP_USERNAME = process.env.AMQP_USERNAME;
const AMQP_PASSWORD = process.env.AMQP_PASSWORD;
const AMQP_OBJECTS_QUEUE_OUT = 'objects_out'

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

function handleError(err) {
    console.log('handling error');
    console.log(err);
}

function addObject(imageId, objectType, objectImageBase64) {
    let recognizingImage = JSON.parse(cache.get(imageId));
    let objectId = recognizingImage.objects.length;
    recognizingImage.objects[objectId] = new ObjectDto(objectType, objectImageBase64)
    cache.set(imageId, JSON.stringify(recognizingImage))
    return objectId;
}

function recognizeFeature(imageId, objectId, featureName, imageBase64) {
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

function processResult(result) {
    for (let object in result.objects) {
        let objectId = addObject(result.id, object.type, object.imageBase64);
        let featureNamesQuery = "select feature.name from feature \n" +
            "join object_type_feature otf on feature.id = otf.feature_id\n" +
            "join object_type ot on ot.id = otf.object_type_id\n" +
            "where ot.name = '" + object.type + "'";
        let featureNames = sequelize.query(featureNamesQuery, {type: QueryTypes.SELECT}).then();
        for (let featureName in featureNames) {
            recognizeFeature(result.id, objectId, featureName, object.imageBase64);
        }
    }
}

const cache = new NodeCache({stdTTL: 600, checkperiod: 650});
const amqpUrl = util.format("amqp://%s:%s@%s:%s/%s", AMQP_USERNAME, AMQP_PASSWORD, AMQP_HOST, AMQP_PORT, AMQP_VHOST);
amqplib.connect(amqpUrl, function (err, connection) {
    if (err) {
        handleError(err);
    }
    connection.createChannel(function (err, channel) {
        if (err) {
            handleError(err);
        }
        channel.assertQueue(AMQP_OBJECTS_QUEUE_OUT, {
            durable: false
        });
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", AMQP_OBJECTS_QUEUE_OUT);
        channel.consume(AMQP_OBJECTS_QUEUE_OUT, function (msg) {
            console.log(" [x] Received %s", msg.content.toString());
            let result = JSON.parse(msg.content.toString());
            processResult(result);
        }, {
            noAck: true
        });
    })
})