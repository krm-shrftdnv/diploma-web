const {Sequelize} = require('sequelize');

const PG_HOST = process.env.PG_HOST
const PG_PORT = process.env.PG_PORT
const PG_USERNAME = process.env.PG_USERNAME
const PG_PASSWORD = process.env.PG_PASSWORD
const PG_DB_NAME = process.env.PG_DB_NAME

class DB {
    constructor() {
        this.sequelize = new Sequelize({
            database: PG_DB_NAME,
            username: PG_USERNAME,
            password: PG_PASSWORD,
            host: PG_HOST,
            port: PG_PORT,
            dialect: "postgres",
            dialectOptions: {
                ssl: {
                    require: true, // This will help you. But you will see nwe error
                    rejectUnauthorized: false // This line will fix new error
                }
            },
        });
    }

    static getInstance() {
        if (!this.sequelize) {
            return new this;
        }
        return this;
    }
}

module.exports = {DB};