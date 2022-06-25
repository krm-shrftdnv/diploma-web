const {RecognizingImageDto} = require("../dto.js");
const {QueryTypes} = require('sequelize');
const sequelize = require('sequelize');

class LocationService {
    /**
     *
     * @param imageInfo : RecognizingImageDto
     */
    static getLocationByImageInfo(imageInfo) {
        let locations = {};
        let max = 0;
        let maxLocationInfo = null;
        for (let object in imageInfo.objects) {
            for (let feature in object.features) {
                let locationsInfo = sequelize.query(
                    "select\n" +
                    "       object.id as id,\n" +
                    "       fv.value as value,\n" +
                    "       latitude as latitude,\n" +
                    "       longitude as longitude\n" +
                    "from object\n" +
                    "join object_type ot on object.object_type_id = ot.id\n" +
                    "join feature_value fv on object.id = fv.object_id\n" +
                    "join feature f on fv.feature_id = f.id\n" +
                    "where\n" +
                    "    (fv.feature_id = 1 and fv.value ilike :text)\n" +
                    "    or\n" +
                    "    (fv.feature_id = 2 and fv.value in :colors)\n" +
                    "group by object.id, fv.value, latitude, longitude",
                    {
                        replacements: {
                            text: JSON.parse(feature.value),
                            colors: JSON.parse(feature.value),
                        },
                        type: QueryTypes.SELECT,
                    }
                ).then();
                if (locationsInfo.length > 0) {
                    for (let locationInfo in locationsInfo) {
                        let coordinates = locationInfo['latitude'] + ',' + locationInfo['longitude'];
                        if (locations[coordinates] !== null && locations[coordinates] !== undefined) {
                            locations[coordinates] += 1;
                        } else {
                            locations[coordinates] = 1;
                        }
                        if (locations[coordinates] > max) {
                            max = locations[coordinates];
                            maxLocationInfo = locationInfo;
                        }
                    }
                }
            }
        }
        return maxLocationInfo;
    }
}

module.exports = {LocationService};