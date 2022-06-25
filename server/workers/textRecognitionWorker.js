const {FeatureName} = require("../enums");
const {AbstractRecognizedQueueWorker} = require("../interfaces/workers");
const {TextsResponseDto} = require('../dto')
const {RecognizingObjectsCacheStorage} = require('../components/RecognizingObjectCacheStorage');

const storage = RecognizingObjectsCacheStorage.getInstance();
const AMQP_TEXT_QUEUE_OUT = 'text_out'

class RecognizedTextFeatureQueueWorker extends AbstractRecognizedQueueWorker {
    /**
     *
     * @param result : TextsResponseDto
     */
    process(result) {
        storage.addFeatureValue(result.imageId, result.objectId, FeatureName.TEXT, JSON.stringify(result.texts))
    }
}

let worker = new RecognizedTextFeatureQueueWorker();
worker.startConsuming(AMQP_TEXT_QUEUE_OUT);