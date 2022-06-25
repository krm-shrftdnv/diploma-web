const {FeatureName} = require("../enums");
const {AbstractRecognizedQueueWorker} = require("../interfaces/workers");
const {ColorResponseDto} = require('../dto')
const {RecognizingObjectsCacheStorage} = require('../components/RecognizingObjectCacheStorage');

const storage = RecognizingObjectsCacheStorage.getInstance();
const AMQP_COLOR_QUEUE_OUT = 'color_out'

class RecognizedColorFeatureQueueWorker extends AbstractRecognizedQueueWorker {
    /**
     *
     * @param result : ColorResponseDto
     */
    process(result) {
        storage.addFeatureValue(result.imageId, result.objectId, FeatureName.COLOR, JSON.stringify(result.colors))
    }
}

let worker = new RecognizedColorFeatureQueueWorker();
worker.startConsuming(AMQP_COLOR_QUEUE_OUT);