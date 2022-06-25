const amqplib = require('amqplib/callback_api');
const util = require("util");
const {amqp} = require("../components/amqp")

const AbstractClass = require("./abstract.js");

class RecognizedQueueWorkerInterface extends AbstractClass {
    constructor() {
        super(RecognizedQueueWorkerInterface, ['startConsuming', 'process']);
    }

    startConsuming(queueName) {
    }

    process(result) {
    }
}

class AbstractRecognizedQueueWorker extends RecognizedQueueWorkerInterface {

    amqpUrl;

    constructor() {
        super();
        this.amqpUrl = util.format("amqp://%s:%s@%s:%s/%s", amqp.AMQP_USERNAME, amqp.AMQP_PASSWORD, amqp.AMQP_HOST, amqp.AMQP_PORT, amqp.AMQP_VHOST);
    }

    startConsuming(queueName) {
        let self = this;
        amqplib.connect(this.amqpUrl, function (err, connection) {
            if (err) {
                self.handleError(err);
            }
            connection.createChannel(function (err, channel) {
                if (err) {
                    self.handleError(err);
                }
                console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queueName);
                channel.consume(queueName, function (msg) {
                    console.log(" [x] Received %s", msg.content.toString());
                    let result = JSON.parse(msg.content.toString());
                    self.process(result);
                }, {
                    noAck: true
                });
            })
        })
    }

    handleError(err) {
        console.log(err);
    }

    process(result) {
    }
}

module.exports = {RecognizedQueueWorkerInterface, AbstractRecognizedQueueWorker};