// const diameter = 20;
const c = 0.5;

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
            diameter: ring.diameter + c,
            lifespan: ring.lifespan,
        }));
    }

    render(sketch) {
        sketch.push();
        sketch.stroke('purple');
        sketch.fill('purple');
        sketch.circle(this.x, this.y, diameter); // Draw entity


        sketch.noFill();
        sketch.stroke('purple');
        this.rings.forEach(ring => {
            if (ring.lifespan == false) {
                sketch.stroke(220);
            }
            sketch.circle(ring.x, ring.y, ring.diameter); // Draw ring
            sketch.stroke('purple')
        });
        sketch.pop();
    }

    changeCol(ring) {
        ring.lifespan = false;
    }

    static updateAll(sketch, entities, selectedIndex) {
        entities.forEach((e, i) => {
            e.update(sketch);
            if (i == selectedIndex) {
                e.x = sketch.mouseX;
                e.y = sketch.mouseY;
            }
        });
    }
}