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
const AMQP_TEXT_QUEUE_OUT = 'text_out'

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

function handleError(err) {
    console.log('handling error');
    console.log(err);
}

function setImageStatus(imageId, status) {
    let recognizingImage = JSON.parse(cache.get(imageId));
    recognizingImage.status = status;
    cache.set(imageId, JSON.stringify(recognizingImage))
}

function getLocationByImageInfo(imageInfo) {
    let locations = {};
    let max = 0;
    let maxLocationInfo = null;
    for (let object in imageInfo.objects) {
        for (let feature in object.features) {
            let locationsInfo = sequelize.query(
                "select\n" +
                "       object.id as id,\n" +
                "       fv.value as value,\n" +
                "       latitude as latitude,\n" +
                "       longitude as longitude\n" +
                "from object\n" +
                "join object_type ot on object.object_type_id = ot.id\n" +
                "join feature_value fv on object.id = fv.object_id\n" +
                "join feature f on fv.feature_id = f.id\n" +
                "where\n" +
                "    (fv.feature_id = 1 and fv.value ilike :text)\n" +
                "    or\n" +
                "    (fv.feature_id = 2 and fv.value in :colors)\n" +
                "group by object.id, fv.value, latitude, longitude",
                {
                    replacements: {
                        text: JSON.parse(feature.value),
                        colors: JSON.parse(feature.value),
                    },
                    type: QueryTypes.SELECT,
                }
            ).then();
            if (locationsInfo.length > 0) {
                for (let locationInfo in locationsInfo) {
                    let coordinates = locationInfo['latitude'] + ',' + locationInfo['longitude'];
                    if (locations[coordinates] !== null && locations[coordinates] !== undefined) {
                        locations[coordinates] += 1;
                    } else {
                        locations[coordinates] = 1;
                    }
                    if (locations[coordinates] > max) {
                        max = locations[coordinates];
                        maxLocationInfo = locationInfo;
                    }
                }
            }
        }
    }
    return maxLocationInfo;
}

function addFeatureValue(imageId, objectId, feature, value) {
    /**
     * @type RecognizingImageDto
     */
    let recognizingImage = JSON.parse(cache.get(imageId));
    recognizingImage.objects[objectId].features.push(new FeatureDto(feature, value));

    let featureNamesQuery = "select feature.name from feature \n" +
        "join object_type_feature otf on feature.id = otf.feature_id\n" +
        "join object_type ot on ot.id = otf.object_type_id\n" +
        "where ot.name = '" + recognizingImage.objects[objectId].type + "'";
    let featureNames = sequelize.query(featureNamesQuery, {type: QueryTypes.SELECT}).then();
    if (featureNames.length === recognizingImage.objects[objectId].features.length) {
        let location = getLocationByImageInfo(recognizingImage);
        if (location !== null) {
            recognizingImage.location = 'latitude: ' + location['latitude'] + ', longitude: ' + location['longitude'];
            setImageStatus(imageId, 'ready');
        } else {
            setImageStatus(imageId, 'error');
        }
    }
    cache.set(imageId, JSON.stringify(recognizingImage));
}

function processResult(result) {
        addFeatureValue(result.imageId, result.objectId, 'text', JSON.stringify(result.texts))
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
        channel.assertQueue(AMQP_TEXT_QUEUE_OUT, {
            durable: false
        });
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", AMQP_TEXT_QUEUE_OUT);
        channel.consume(AMQP_TEXT_QUEUE_OUT, function (msg) {
            console.log(" [x] Received %s", msg.content.toString());
            let result = JSON.parse(msg.content.toString());
            processResult(result);
        }, {
            noAck: true
        });
    })
})