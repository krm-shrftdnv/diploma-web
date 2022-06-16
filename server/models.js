class Point {
    /**
     * @type float
     */
    x;

    /**
     * @type float
     */
    y;

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Object {
    /**
     * @type string
     */
    type;

    /**
     * @type array
     * bounding box
     * [[x1,y1], [x2,y2]]
     */
    roi;

    /**
     * @type array
     * numpy array
     */
    mask;

    constructor(type, roi, mask) {
        this.type = type;
        this.roi = roi;
        this.mask = mask;
    }
}

module.exports = {
    Point, Object
}