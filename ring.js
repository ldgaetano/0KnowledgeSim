const radius = 20;
const c = 10;

class Ring {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = radius;
    }

    update(sketch) {
        if (sketch.frameCount % 100 == 0) {
            this.rings.push({
                x: this.x,
                y: this.y,
                radius: this.radius + c / this.radius
            });
        }
    }

    render(sketch) {
        sketch.push();
        sketch.noFill();
        sketch.stroke(0);
        sketch.circle(ring.x, ring.y, ring.radius); // Draw ring

        sketch.pop();
    }
}