// const diameter = 20;
const c = 100;

class Prover {
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
            diameter: ring.diameter + c / ring.diameter,
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
            sketch.circle(ring.x, ring.y, ring.diameter); // Draw ring
        })
        sketch.pop();
    }

}