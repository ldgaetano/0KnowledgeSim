const speed = 0.5;

class Verifier {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.diameter = diameter;
        this.rings = [];
    }

    update(sketch) {
        if (sketch.frameCount % 100 == 0) {
            this.rings.push({
                x: this.x,
                y: this.y,
                diameter: 1,
            });
        }

        this.x = this.x;
        this.y = this.y;


        this.rings = this.rings.map(ring => ({
            x: ring.x,
            y: ring.y,
            diameter: ring.diameter + speed,
            lifespan: ring.lifespan,

        }));
    }

    render(sketch) {
        sketch.push();
        sketch.stroke(0);
        sketch.fill(0);
        sketch.circle(this.x, this.y, diameter); // Draw entity

        sketch.noFill();
        sketch.stroke(0);
        this.rings.forEach(ring => {
            if (ring.lifespan == false) {
                sketch.stroke(220);
            }
            sketch.circle(ring.x, ring.y, ring.diameter); // Draw ring
            sketch.stroke(0);
        });
        sketch.pop();
    }

    changeCol(ring) {
        ring.lifespan = false;
    }


}