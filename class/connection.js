class Connection {

    /**
     * Constructor for Connection instance.
     * @param {Cell} cell1
     * @param {Cell} cell2
     */
    constructor(cell1, cell2) {
        this.cell1 = cell1;
        this.cell2 = cell2;
        this.flags = {
            hover : false
        };
    }

    /**
     * Get the Node ids in the Connection instance.
     * @returns {number[]}
     */
    getConnectionNodeIDs() {
        return [this.cell1.id, this.cell2.id];
    }

    /**
     * Render the Connection instance.
     * @param {Object} sketch
     */
    renderConnection(sketch) {
        sketch.push();
        sketch.stroke(0);
        sketch.strokeWeight(2);
        sketch.line(this.cell1.x, this.cell1.y, this.cell2.x, this.cell2.y);
        sketch.pop();
    }

}