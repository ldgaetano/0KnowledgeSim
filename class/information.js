class Information extends Ring {

    #val;
    #growth_rate;
    #prop_status = false;

    /**
     * Constructor for Information instance.
     * @param {string} name
     * @param {number} id
     * @param {*}      val
     * @param {number} center_x
     * @param {number} center_y
     * @param {number} diameter
     * @param {number} growth_rate
     * @param {string} color
     * @param {Object} sketch
     */
    constructor(name, id, val, center_x, center_y, diameter, growth_rate, color, sketch) {
        super(name, id, center_x, center_y, diameter, color, sketch);
        this.#val = val;
        this.#growth_rate = growth_rate;
    }

    /**
     * Method to display the increasing diameter of the Information instance.
     */
    displayInformation() {
        this.getSketch().push();
        this.getSketch().noFill();
        this.getSketch().stroke(this.getColor());
        this.getSketch().circle(this.getCenterX(), this.getCenterY(), this.getDiameter());
        this.getSketch().pop();
    }

    /**
     * Method for increasing the diameter of the current Information instance by one growth_rate step.
     */
    updateInformationDiameter() {
        this.setDiameter(this.getDiameter()+this.#growth_rate);
    }

    /**
     * Method to initialize the propagation status, to know if information has been displayed.
     */
    initPropStatus() {
        this.#prop_status = true;
    }

    /**
     * Get the value.
     * @returns {*}
     */
    getInformationVal() {
        return this.#val;
    }

    /**
     * Get the speed.
     * @returns {number}
     */
    getInformationGrowthRate() {
        return this.#growth_rate;
    }

    /**
     * Get the propagation status.
     * @returns {boolean}
     */
    getInformationPropStatus() {
        return this.#prop_status;
    }

    /**
     * Set value.
     * @param {*} val
     */
    setInformationVal(val) {
        this.#val = val;
    }

    /**
     * Set growth rate.
     * @param {number} growth_rate
     */
    setInformationGrowthRate(growth_rate) {
        this.#growth_rate = growth_rate;
    }

    /**
     * Set the propagation status
     * @param {boolean} prop_status
     */
    setInformationPropStatus(prop_status) {
        this.#prop_status = prop_status;
    }


}