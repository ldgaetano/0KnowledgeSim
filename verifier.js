class Verifier {
    constructor(id, x, y) {
        this.x = x;
        this.y = y;
        this.diameter = diameter;
        this.rings = [];
        this.ring = {
            x: this.x,
            y: this.y,
            diameter: 1,
            // speed:1
        };
        this.id = id;
        this.speed = 1;
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
            diameter: ring.diameter + this.speed,

        }));
    }
    updateOneRing(){
        this.ring = {
            x: this.x,
            y: this.y,
            diameter: this.ring.diameter + this.speed,
        };
    }

    renderV1(sketch) {
        sketch.push();
        sketch.stroke('blue');
        sketch.fill('blue');
        sketch.circle(this.x, this.y, diameter); // Draw entity

        sketch.noStroke();
        sketch.fill(255);
        sketch.textSize(15);
        sketch.text(this.id, this.x - (sketch.textWidth(this.id) / 2), this.y + ((sketch.textAscent() + sketch.textDescent()) / 4));

        sketch.noFill();
        sketch.stroke('blue');
        this.rings.forEach(ring => {
            // if (ring.lifespan == false) {
            //     sketch.stroke(220);
            // }
            sketch.circle(ring.x, ring.y, ring.diameter); // Draw ring
            sketch.stroke('blue');
        });
        sketch.pop();
    }
    renderV2(sketch) {
        sketch.push();
        sketch.stroke('green');
        sketch.fill('green');
        sketch.circle(this.x, this.y, diameter); // Draw entity

        sketch.noStroke();
        sketch.fill(255);
        sketch.textSize(15);
        sketch.text(this.id, this.x - (sketch.textWidth(this.id) / 2), this.y + ((sketch.textAscent() + sketch.textDescent()) / 4));

        sketch.noFill();
        sketch.stroke('green');
        this.rings.forEach(ring => {
            sketch.circle(ring.x, ring.y, ring.diameter); // Draw ring
            sketch.stroke('green');
        });
        sketch.pop();
    }
    renderOneRingV1(sketch){
        sketch.noFill();
        sketch.stroke('orange');
        sketch.circle(this.ring.x, this.ring.y, this.ring.diameter); // Draw ring


    }
    renderOneRingV2(sketch){
        sketch.noFill(0);
        sketch.stroke('red');
        sketch.circle(this.ring.x, this.ring.y, this.ring.diameter); // Draw ring


    }

    changeCol(ring) {
        ring.lifespan = false;
    }


}