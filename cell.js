class Cell {
    constructor(id, x, y) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.flags = {
            hover : true,
            clicked: false
        };
        this.radius = 20;
    }

    render(sketch) {
        this.render_cell(sketch);
        this.render_text(sketch);
    }

    render_text(sketch) {
        sketch.noStroke();
        sketch.fill(0);
        sketch.textSize(20);
        sketch.text(this.id, this.x - (sketch.textWidth(this.id) / 2), this.y + ((sketch.textAscent() + sketch.textDescent()) / 4));
    }

    render_cell(sketch) {
        sketch.stroke(0);
        sketch.strokeWeight(2);
        sketch.fill(255);

        if (this.flags.hover) {
            sketch.fill('purple');
        }
        if (this.flags.clicked) {
            sketch.fill('purple');
        }

        sketch.circle(this.x, this.y, this.radius*2);
    }

    isInside(x, y, sketch) {
        const d = sketch.dist(this.x, this.y, x, y);
        return d <= this.radius;
    }
    changeCol(entity){
        entity.forEach(cell => {
            cell.flags.clicked = true;
        });

    }
    // clicked(x, y, sketch){
    //     if (isInside(x,y,sketch)) {
    //         sketch.fill('purple');
    //     }
    // }

}
