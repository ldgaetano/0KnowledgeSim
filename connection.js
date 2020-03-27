class Connection {
    constructor(cell1, cell2) {
        this.cell1 = cell1;
        this.cell2 = cell2;

        this.flags = {
            hover : false
        };
    }

    render(sketch) {
        this.render_connection(sketch);
    }

    render_connection(sketch) {
        sketch.stroke(0);
        sketch.strokeWeight(2);
        sketch.line(this.cell1.x, this.cell1.y, this.cell2.x, this.cell2.y);
    }

}