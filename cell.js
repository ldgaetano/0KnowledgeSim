class Cell {
    constructor(id, x, y) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.flags = {
            hover : true
        }
        this.radius = 2;
    }

    render() {
        this.render_cell();
        this.render_text();
    }

    render_text() {
        noStroke();
        fill(0);
        textSize(20);
        text(this.id, this.x - (textWidth(this.id) / 2), this.y + ((textAscent() + textDescent()) / 4));
    }

    render_cell() {
        stroke(0);
        strokeWeight(2);

        if (this.flags.hover) {
            strokeWeight(3);
        }

        circle(this.x, this.y, this.radius*2);
    }

    isInside(x, y) {
        const d = dist(this.x, this.y, x, y);
        return d <= this.radius;
    }

}
