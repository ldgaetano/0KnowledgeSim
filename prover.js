class Prover {
    constructor(id, x, y) {
        this.x = x;
        this.y = y;
        this.diameter = diameter;
        this.rings = [];
        this.ring = {
            x: this.x,
            y: this.y,
            diameter: 1,
            // speed: 1
        }
        this.id = id;
        this.speed = 1
    }

    update(sketch) {
        if (sketch.frameCount % rate == 0) {
            this.rings.push({
                x: this.x,
                y: this.y,
                diameter: 1,
            });
        }

    }
    grow(){
        this.x = this.x;
        this.y = this.y;

        this.rings = this.rings.map(ring => ({
            x: ring.x,
            y: ring.y,
            diameter: ring.diameter + this.speed,
        }));
    }

    updateOneRing(){
        this.x = this.x;
        this.y = this.y;

        this.ring = {
            x: this.x,
            y: this.y,
            diameter: this.ring.diameter + this.speed
        };
    }

    renderP1(sketch) {
        sketch.push();
        sketch.stroke('yellow');
        sketch.fill('yellow');
        sketch.circle(this.x, this.y, diameter); // Draw entity

        sketch.noStroke();
        sketch.fill(0);
        sketch.textSize(15);
        sketch.text(this.id, this.x - (sketch.textWidth(this.id) / 2), this.y + ((sketch.textAscent() + sketch.textDescent()) / 4));
        sketch.pop();
    }
    renderP2(sketch) {
        sketch.push();
        sketch.stroke('white');
        sketch.fill('white');
        sketch.circle(this.x, this.y, diameter); // Draw entity

        sketch.noStroke();
        sketch.fill(0);
        sketch.textSize(15);
        sketch.text(this.id, this.x - (sketch.textWidth(this.id) / 2), this.y + ((sketch.textAscent() + sketch.textDescent()) / 4));
        sketch.pop();
    }
    render_ringP1(sketch) {
        sketch.push();
        sketch.noFill();
        sketch.stroke('yellow');
        this.rings.forEach(ring => {
            sketch.circle(ring.x, ring.y, ring.diameter);
        });
        sketch.pop();
    }
    render_ringP2(sketch) {
        sketch.push();
        sketch.noFill();
        sketch.stroke('white');
        this.rings.forEach(ring => {
            sketch.circle(ring.x, ring.y, ring.diameter);
        });
        sketch.pop();
    }
    renderOneRingP1(sketch){
        sketch.push();
        sketch.noFill();
        sketch.stroke('purple');
        sketch.circle(this.ring.x, this.ring.y, this.ring.diameter);
        sketch.pop();
    }
    renderOneRingP2(sketch){
        sketch.push();
        sketch.noFill();
        sketch.stroke('black');
        sketch.circle(this.ring.x, this.ring.y, this.ring.diameter);
        sketch.pop();
    }

    static updateAll(sketch, entities, selectedIndex) {
        entities.forEach((e, i) => {
            // e.update(sketch);
            if (i == selectedIndex) {
                e.x = sketch.mouseX ;
                e.y = sketch.mouseY ;
            }
        });
    }
}

