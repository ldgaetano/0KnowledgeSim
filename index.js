let p1;
let p2;
let p3;

let v1;
let v2;
let v3;

let entitySelectedIndex = -1;
let provers;
let verifiers;

let myp5 = new p5(sketch => {
    sketch.setup = () => {
        sketch.createCanvas(600, 600);
        p1 = new Prover(sketch.width /2, sketch.height/6);
        p2 = new Prover(sketch.width / 10, sketch.height -100 );
        p3 = new Prover(sketch.width - 100, sketch.height - 100);

        v1 = new Verifier(sketch.width / 2, sketch.height/6+50);
        v2 = new Verifier(sketch.width /10 + 50, sketch.height - 100);
        v3 = new Verifier(sketch.width-150 , sketch.height - 100);

        provers = [p1, p2, p3];
        verifiers = [v1, v2, v3]
        // sketch.createSlider();
    }

    sketch.draw = () => {
        sketch.background(220);

        Prover.updateAll(sketch, provers, entitySelectedIndex);
        provers.forEach((e) => {
            e.render(sketch)
        });
        verifiers.forEach((e) => {
            e.update(sketch)
        });
        verifiers.forEach((e) => {
            e.render(sketch)
        });
    }

    sketch.mousePressed = () => {
        provers.forEach((e, i) => {
            if (sketch.dist(sketch.mouseX, sketch.mouseY, e.x, e.y) < e.radius) {
                entitySelectedIndex = i;
            }
        });
    }

    sketch.mouseReleased = () => {
        entitySelectedIndex = -1;
    }
}, "entity-canvas");