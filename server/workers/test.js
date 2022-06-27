require('dotenv').config();
const AMQP_HOST = process.env.AMQP_HOST;
const AMQP_VHOST = process.env.AMQP_VHOST;
const AMQP_PORT = process.env.AMQP_PORT;
const AMQP_PORT_TLS = process.env.AMQP_PORT_TLS;
const AMQP_USERNAME = process.env.AMQP_USERNAME;
const AMQP_PASSWORD = process.env.AMQP_PASSWORD;
const AMQP_OBJECTS_QUEUE_OUT = 'objects_out'

const amqplib = require('amqplib/callback_api');
const util = require('util');
// let amqpUrl = util.format("amqp://%s:%s@%s:%s/%s", 'nuqacasd', '3PCR_jxIh3WatPxHqPnW8UYu8_jLCKpv', 'hawk.rmq.cloudamqp.com', 5672, 'nuqacasd');
let amqpUrl = util.format("amqp://%s:%s@%s:%s/%s", AMQP_USERNAME, AMQP_PASSWORD, AMQP_HOST, AMQP_PORT, AMQP_VHOST);

console.log(amqpUrl);

let queueName = 'mrcnn_out';
amqplib.connect(amqpUrl, function(err, connection) {
    if (err) {
        console.log(err);
    }
    connection.createChannel(function(err, channel) {
        if (err) {
            console.log(err);
        }
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", AMQP_OBJECTS_QUEUE_OUT);
        channel.consume(AMQP_OBJECTS_QUEUE_OUT, function(msg) {
            console.log(" [x] Received %s", msg.content.toString());

        }, {
            noAck: true
        });
    })
});