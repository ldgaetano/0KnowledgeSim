class Prover {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.diameter = diameter;
        this.rings = [];
    }

    update(sketch) {
        if (sketch.frameCount % rate == 0) {
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
        sketch.stroke('purple');
        sketch.fill('purple');
        sketch.circle(this.x, this.y, diameter); // Draw entity
        // sketch.noFill();
        // sketch.stroke('purple');
        // this.rings.forEach(ring => {
        //     sketch.circle(ring.x, ring.y, ring.diameter); // Draw ring
        // });
        sketch.pop();
    }
    render_ring(sketch) {
        sketch.push();
        sketch.noFill();
        sketch.stroke('purple');
        this.rings.forEach(ring => {
            sketch.circle(ring.x, ring.y, ring.diameter);
        });
        sketch.pop();
    }

    changeCol(ring) {
        ring.lifespan = false;
    }

    static updateAll(sketch, entities, selectedIndex) {
        entities.forEach((e, i) => {
            // e.update(sketch);
            if (i == selectedIndex) {
                e.x = sketch.mouseX;
                e.y = sketch.mouseY;
            }
        });
    }
}

