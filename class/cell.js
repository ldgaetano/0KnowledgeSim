class Cell {

    #color = "white"; // Default color

    /**
     * Constructor for Cell instance.
     * @param {number} id
     * @param {number} x
     * @param {number} y
     */
    constructor(id, x, y) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.flags = {
            hover : true,
            clicked: false,
            revealed: false,
        };
        this.radius = 20;
    }

    /**
     * Render the Cell instance with text inside.
     * @param {Object} sketch
     */
    renderCell(sketch) {
        this.#renderEmptyCell(sketch);
        this.#renderText(sketch);
    }

    /**
     * Render text inside Cell instance.
     * @param {Object} sketch
     */
    #renderText(sketch) {
        sketch.push();
        sketch.noStroke();
        sketch.fill(0);
        sketch.textSize(20);
        sketch.text(this.id, this.x - (sketch.textWidth(this.id) / 2), this.y + ((sketch.textAscent() + sketch.textDescent()) / 4));
        sketch.pop();
    }

    /**
     * Render Cell instance without text.
     * @param {Object} sketch
     */
    #renderEmptyCell(sketch) {
        sketch.push();
        sketch.stroke(0);
        sketch.strokeWeight(2);
        sketch.fill("white");

        if (this.flags.hover) {
            sketch.fill('purple');
        }
        if (this.flags.clicked) {
            if (this.flags.revealed) {this.flags.revealed = false};
            sketch.fill('purple');
        }
        if (this.flags.revealed) {
            sketch.fill(this.#color);
        }

        sketch.circle(this.x, this.y, this.radius*2);
        sketch.pop();
    }

    /**
     * Check if mouse is inside Cell instance.
     * @param {number} x
     * @param {number} y
     * @param {Object} sketch
     * @returns {boolean}
     */
    mouseIsInsideCell(x, y, sketch) {
        let d = sketch.dist(this.x, this.y, x, y);
        return d <= this.radius;
    }

    /**
     * Reset the cell color to its original color.
     */
    resetCell() {
        this.#color = "White";
        this.flags.hover = false;
        this.flags.clicked = false;
        this.flags.revealed = false;
    }

    /**
     * Change the reveal color of the Cell instance.
     * @param {string} color
     */
    setCellColor(color) {
        this.#color = color;
    }

    /**
     * Get the Cell instance color.
     * @returns {string}
     */
    getCellColor() {
        return this.#color;
    }


}
