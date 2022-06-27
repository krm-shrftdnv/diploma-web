require('dotenv').config();

const AMQP_HOST = process.env.AMQP_HOST;
const AMQP_VHOST = process.env.AMQP_VHOST;
const AMQP_PORT = process.env.AMQP_PORT;
const AMQP_PORT_TLS = process.env.AMQP_PORT_TLS;
const AMQP_USERNAME = process.env.AMQP_USERNAME;
const AMQP_PASSWORD = process.env.AMQP_PASSWORD;

module.exports = {
    AMQP_HOST,
    AMQP_VHOST,
    AMQP_PORT,
    AMQP_USERNAME,
    AMQP_PASSWORD,
    AMQP_PORT_TLS,
};