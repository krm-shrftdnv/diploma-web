const {Sequelize, DataTypes, Model} = require('sequelize');

const PG_HOST = process.env.PG_HOST;
const PG_PORT = process.env.PG_PORT;
const PG_USERNAME = process.env.PG_USERNAME;
const PG_PASSWORD = process.env.PG_PASSWORD;
const PG_DB_NAME = process.env.PG_DB_NAME;

// const sequelize = new Sequelize('postgres://' + PG_USERNAME + ':' + PG_PASSWORD + '@' + PG_HOST + ':' + PG_PORT + '/' + PG_DB_NAME);
const sequelize = new Sequelize({
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

class Feature extends Model {
}

Feature.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'Feature',
    tableName: 'feature',
    timestamps: false,
});

class ObjectType extends Model {
}

ObjectType.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'ObjectType',
    tableName: 'object_type',
    timestamps: false,
});

class Object extends Model {
}

Object.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    object_type_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    longitude: {
        type: DataTypes.FLOAT,
    },
    latitude: {
        type: DataTypes.FLOAT,
    },
    map_id: {
        type: DataTypes.INTEGER,
    },
    map_path: {
        type: DataTypes.STRING,
    }
}, {
    sequelize,
    modelName: 'Object',
    tableName: 'object',
    timestamps: false,
});

class FeatureValue extends Model {
}

FeatureValue.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    object_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    feature_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    value: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    sequelize,
    modelName: 'FeatureValue',
    tableName: 'feature_value',
    timestamps: false,
});

class Map extends Model {
    toJSON() {
        return {
            map_id: this.id,
            map_name: this.name,
            image: this.image,
        };
    }
}

Map.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    longitude: {
        type: DataTypes.FLOAT,
    },
    latitude: {
        type: DataTypes.FLOAT,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    sequelize,
    modelName: 'Map',
    tableName: 'map',
    timestamps: false,
});

Feature.hasMany(FeatureValue);
Feature.belongsToMany(ObjectType, {through: 'object_type_feature'});
ObjectType.belongsToMany(Feature, {through: 'object_type_feature'});
ObjectType.hasMany(Object);
Object.belongsTo(ObjectType);
Object.hasMany(FeatureValue);
Object.belongsTo(Map);
FeatureValue.belongsTo(Object);
FeatureValue.belongsTo(Feature);

module.exports = {
    ObjectType,
    Feature,
    Object,
    FeatureValue,
    Map,
}