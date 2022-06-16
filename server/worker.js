require('dotenv').config();
const amqp = require('amqplib/callback_api');
const util = require('util');
const NodeCache = require("node-cache");

const {MrcnnResponseDto} = require('./dto.js')
const {Object} = require('./models.js')
const {ObjectType} = require('./enums.js')

const AMQP_HOST = process.env.AMQP_HOST
const AMQP_VHOST = process.env.AMQP_VHOST
const AMQP_PORT = process.env.AMQP_PORT
const AMQP_USERNAME = process.env.AMQP_USERNAME
const AMQP_PASSWORD = process.env.AMQP_PASSWORD
const AMQP_MRCNN_QUEUE_OUT = process.env.AMQP_MRCNN_QUEUE_OUT

const cache = new NodeCache();
let amqpUrl = util.format("amqp://%s:%s@%s:%s/%s", AMQP_USERNAME, AMQP_PASSWORD, AMQP_HOST, AMQP_PORT, AMQP_VHOST);
amqp.connect(amqpUrl, function (err, connection) {
    if (err) {
        console.log(err);
        return;
    }
    connection.createChannel(function (err, channel) {
        if (err) {
            console.log(err);
            return;
        }
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", AMQP_MRCNN_QUEUE_OUT);
        channel.consume(AMQP_MRCNN_QUEUE_OUT, function (msg) {
            console.log(" [x] Received %s", msg.content.toString());
            /**
             * @type {MrcnnResponseDto}
             */
            let result = JSON.parse(msg.content.toString())
            cache.set(result.id, result, 84600);
            /**
             * @type Object
             */
            for (let object in result.objects) {
                // get features of this object_type
                // for each feature send to queue
            }
        }, {
            noAck: true
        });
    })
})
