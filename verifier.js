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
        };
        this.speed = 1;
        this.id = id
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

    render(sketch) {
        sketch.push();
        sketch.stroke(0);
        sketch.fill(0);
        sketch.circle(this.x, this.y, diameter); // Draw entity

        sketch.noStroke();
        sketch.fill(255);
        sketch.textSize(15);
        sketch.text(this.id, this.x - (sketch.textWidth(this.id) / 2), this.y + ((sketch.textAscent() + sketch.textDescent()) / 4));

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
    renderOneRing(sketch){
        sketch.noFill(0);
        sketch.stroke(255,0,0);
        sketch.circle(this.ring.x, this.ring.y, this.ring.diameter); // Draw ring


    }

    changeCol(ring) {
        ring.lifespan = false;
    }


}
