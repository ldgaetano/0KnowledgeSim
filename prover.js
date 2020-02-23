const radius = 20;
const c = 10;

class Provers {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.rings = [];
    }

    update(sketch) {
        if (sketch.frameCount % 100 == 0) {
            this.rings.push({
                x: this.x,
                y: this.y,
                radius: 1,
            });
        }

        this.x = this.x;
        this.y = this.y;


        this.rings = this.rings.map(ring => ({
            x: ring.x,
            y: ring.y,
            radius: ring.radius + c / ring.radius,
        }));
    }

    render(sketch) {
        sketch.push();
        sketch.stroke(0);
        sketch.fill(0);
        sketch.circle(this.x, this.y, radius); // Draw entity

        sketch.noFill();
        sketch.stroke(0);
        this.rings.forEach(ring => {
            sketch.circle(ring.x, ring.y, ring.radius); // Draw ring
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