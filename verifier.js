const r = 20;
const speed = 10;

class Verifier {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.rings = [];
    }

    update(sketch) {
        if (sketch.frameCount % 100 == 0) {
            this.rings.push({
                x: this.x,
                y: this.y,
                r: 1,
            });
        }

        this.x = this.x;
        this.y = this.y;


        this.rings = this.rings.map(ring => ({
            x: ring.x,
            y: ring.y,
            r: ring.r + speed / ring.r,
        }));
    }

    render(sketch) {
        sketch.push();
        sketch.stroke(0);
        sketch.fill(0);
        sketch.circle(this.x, this.y, r); // Draw entity

        sketch.noFill();
        sketch.stroke(0);
        this.rings.forEach(ring => {
            sketch.circle(ring.x, ring.y, ring.r); // Draw ring
        })
        sketch.pop();
    }
}