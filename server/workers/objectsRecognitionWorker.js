const {AbstractRecognizedQueueWorker} = require("../interfaces/workers");
const {ObjectsResponseDto} = require('../dto')
const {RecognizingObjectsCacheStorage} = require('../components/RecognizingObjectCacheStorage');
const {RecognitionService: recognitionService} = require('../services/RecognitionService');
const {QueryTypes} = require('sequelize');
const sequelize = require('sequelize');

const storage = RecognizingObjectsCacheStorage.getInstance();
const AMQP_OBJECTS_QUEUE_OUT = 'objects_out'

class RecognizedObjectsQueueWorker extends AbstractRecognizedQueueWorker {
    /**
     *
     * @param result : ObjectsResponseDto
     */
    process(result) {
        for (let object in result.objects) {
            let objectId = storage.addObject(result.id, object.type, object.imageBase64);
            let featureNamesQuery = "select feature.name from feature \n" +
                "join object_type_feature otf on feature.id = otf.feature_id\n" +
                "join object_type ot on ot.id = otf.object_type_id\n" +
                "where ot.name = '" + object.type + "'";
            let featureNames = sequelize.query(featureNamesQuery, {type: QueryTypes.SELECT}).then();
            for (let featureName in featureNames) {
                recognitionService.recognizeFeature(result.id, objectId, featureName, object.imageBase64);
            }
        }
    }
}

let worker = new RecognizedObjectsQueueWorker();
worker.startConsuming(AMQP_OBJECTS_QUEUE_OUT);