const {Sequelize} = require('sequelize');

const PG_HOST = process.env.PG_HOST
const PG_PORT = process.env.PG_PORT
const PG_USERNAME = process.env.PG_USERNAME
const PG_PASSWORD = process.env.PG_PASSWORD
const PG_DB_NAME = process.env.PG_DB_NAME

class DB {
    constructor() {
        this.sequelize = new Sequelize('postgres://' + PG_USERNAME + ':' + PG_PASSWORD + '@' + PG_HOST + ':' + PG_PORT + '/' + PG_DB_NAME);
    }

    static getInstance() {
        if (!this.sequelize) {
            return new this;
        }
        return this;
    }
}

module.exports = {DB};