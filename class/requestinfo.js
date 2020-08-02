class RequestInfo extends Information {

    /**
     * Constructor for RequestInfo instance.
     * @param {string}        name
     * @param {number}        id
     * @param {Array<number>} val         Request value represented as [n_i, n_j, r_i, r_j]
     * @param {number}        center_x
     * @param {number}        center_y
     * @param {number}        diameter
     * @param {number}        growth_rate
     * @param {string}        color
     * @param {Object}        sketch
     */
    constructor(name, id, val, center_x, center_y, diameter, growth_rate, color, sketch) {
        super(name, id, val, center_x, center_y, diameter, growth_rate, color, sketch);
    }

    /**
     * Get the node values of the request.
     * @returns {Array<number>}
     */
    getRequestNodeVals() {
        return this.getInformationVal().slice(0, 2);
    }

    /**
     * Get the r values of the request.
     * @returns {Array<number>}
     */
    getRequestRVals() {
        return this.getInformationVal().slice(2, 4);
    }

    /**
     * Get the node_i value of the request.
     * @returns {number}
     */
    getRequestNodeIVal() {
        return this.getRequestNodeVals()[0];
    }

    /**
     * Get the node_j value of the request.
     * @returns {number}
     */
    getRequestNodeJVal() {
        return this.getRequestNodeVals()[1];
    }

    /**
     * Get the r_i value of the request.
     * @returns {number}
     */
    getRequestRIVal() {
        return this.getRequestRVals()[0];
    }

    /**
     * Get the r_j value of the request.
     * @returns {number}
     */
    getRequestRJVal() {
        return this.getRequestRVals()[1];
    }

    /**
     * Set the request values of the RequestInfo instance.
     * @param {Array<number>} request_vals
     */
    setRequestVals(request_vals) {
        this.setInformationVal(request_vals);
    }

}
