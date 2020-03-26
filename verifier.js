const speed = 10;

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
            diameter: ring.diameter + speed / ring.diameter,
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