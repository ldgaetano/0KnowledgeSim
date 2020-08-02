class CommitInfo extends Information {

    /**
     * Constructor for CommitInfo instance.
     * @param {string}        name
     * @param {number}        id
     * @param {Array<number>} val         Commit value represented as [com_i, com_j]
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
     * Get the commit values of the commit.
     * @returns {Array<number>}
     */
    getCommitVals() {
        return this.getInformationVal();
    }

    /**
     * Get comm_i value of the commit.
     * @returns {number}
     */
    getCommitIVal() {
        return this.getInformationVal()[0];
    }

    /**
     * Get com_j value of the commit.
     * @returns {number}
     */
    getCommitJVal() {
        return this.getInformationVal()[1];
    }

    /**
     * Set the commit values of the CommitInfo instance.
     * @param {Array<number>} commit_vals
     */
    setCommitVals(commit_vals) {
        this.setInformationVal(commit_vals);
    }
}