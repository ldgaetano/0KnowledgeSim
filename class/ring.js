class Ring {

    #name;
    #id;
    #center_x;
    #center_y;
    #init_center_x;
    #init_center_y;
    #diameter;
    #color;
    #sketch;
    #init_diameter;

    /**
     * Constructor for Ring instance.
     * @param {string} name
     * @param {number} id
     * @param {number} center_x
     * @param {number} center_y
     * @param {number} diameter
     * @param {string} color
     * @param {Object} sketch
     */
    constructor(name, id, center_x, center_y, diameter, color, sketch) {
        this.#name = name;
        this.#id = id;
        this.#center_x = center_x;
        this.#center_y = center_y;
        this.#init_center_x = center_x;
        this.#init_center_y = center_y;
        this.#diameter = diameter;
        this.#init_diameter = diameter;
        this.#color = color;
        this.#sketch = sketch;
    }

    /**
     * Method to statically display the current Ring instance.
     */
    displayStaticRingInstance() {
        this.#sketch.push();
        this.#sketch.noFill();
        this.#sketch.stroke(this.#color);
        this.#sketch.circle(this.#center_x, this.#center_y, this.#init_diameter);
        this.#sketch.pop();
    }

    /**
     * Method to check if current Ring instance is being reached by another Ring instance.
     * @param  {Ring|Information|CommitInfo|RequestInfo|Character|Prover|Verifier} ring
     * @return {boolean}
     */
    checkRing2RingCollision(ring) {
        // Check if collision has occurred.
        return this.getSketch().collideCircleCircle(this.getCenterX(), this.getCenterY(), this.getDiameter(), ring.getCenterX(), ring.getCenterY(), ring.getDiameter());
    }

    /**
     * Get name.
     * @returns {string}
     */
    getName() {
        return this.#name;
    }

    /**
     * Get id.
     * @returns {number}
     */
    getID() {
        return this.#id;
    }

    /**
     * Get center_x position.
     * @returns {number}
     */
    getCenterX() {
        return this.#center_x;
    }

    /**
     * Get center_y position.
     * @returns {number}
     */
    getCenterY() {
        return this.#center_y;
    }

    /**
     * Get the initial center_x position.
     * @returns {number}
     */
    getInitCenterX() {
        return this.#init_center_x;
    }

    /**
     * Get the initial center_y position.
     * @returns {number}
     */
    getInitCenterY() {
        return this.#init_center_y;
    }

    /**
     * Get diameter.
     * @returns {number}
     */
    getDiameter() {
        return this.#diameter;
    }

    /**
     * Get radius.
     * @returns {number}
     */
    getRadius() {
        return this.#diameter / 2;
    }

    /**
     * Get initial diameter.
     * @returns {number}
     */
    getInitDiameter() {
        return this.#init_diameter;
    }

    /**
     * Get color.
     * @returns {string}
     */
    getColor() {
        return this.#color;
    }

    /**
     * Get sketch.
     * @returns {Object}
     */
    getSketch() {
        return this.#sketch;
    }

    /**
     * Set center_x position.
     * @param {number} center_x
     */
    setCenterX(center_x) {
        this.#center_x = center_x;
    }

    /**
     * Set center_y position.
     * @param {number} center_y
     */
    setCenterY(center_y) {
        this.#center_y = center_y;
    }

    /**
     * Set diameter.
     * @param {number} diameter
     */
    setDiameter(diameter) {
        this.#diameter = diameter;
    }

    /**
     * Set color.
     * @param {string } color
     */
    setColor(color) {
        this.#color = color;
    }
}