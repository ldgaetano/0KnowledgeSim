import {getCells} from "./graph";
import {getConnections} from "./graph";


/*
    Defining global constants
 */

const diameter = 20;

// The provers
let p1;
let p2;
let p3;

// The verifiers
let v1;
let v2;
let v3;

let entitySelectedIndex = -1;
let provers;
let verifiers;

// The displayed graph
let cells = [];
let connections = [];


let myp5 = new p5(sketch => {
    sketch.setup = () => {

        let canv = sketch.createCanvas(500, 500);
        canv.position(10, 200)
        resetSketch();
        var reset = sketch.createButton("reset");
        reset.position(10,150)
        reset.mousePressed(resetSketch);
    }

    let checkIfTouching = () => {
        for (var i = 0; i < verifiers.length; ++i) {
            if (verifiers[i].rings.length == 0) continue;
            let ring = verifiers[i].rings[0]
            for (var j = 0; j < verifiers.length; ++j) {
                if (i == j) continue;
                let d = sketch.dist(verifiers[i].x, verifiers[i].y, verifiers[j].x, verifiers[j].y) - verifiers[j].diameter / 2
                if (ring.diameter / 2 >= d) {
                    sketch.noLoop()
                    return;
                }
            }
        }
    }

    let resetSketch = () => {
        p1 = new Prover(sketch.width /2, sketch.height/6);
        p2 = new Prover(sketch.width / 10, sketch.height -100 );
        p3 = new Prover(sketch.width - 100, sketch.height - 100);

        v1 = new Verifier(sketch.width / 2, sketch.height/6+50);
        v2 = new Verifier(sketch.width /10 + 50, sketch.height - 100);
        v3 = new Verifier(sketch.width-150 , sketch.height - 100);

        provers = [p1, p2, p3];
        verifiers = [v1, v2, v3];
        // sketch.createSlider();
    }

    sketch.draw = () => {
        sketch.background(220);

        provers.forEach((e) => {
            e.update(sketch)
        });
        provers.forEach((e) => {
            e.render(sketch)
        });
        Verifier.updateAll(sketch, verifiers, entitySelectedIndex);

        verifiers.forEach((e) => {
            e.render(sketch)
        });

        checkIfTouching()
    }

    sketch.mousePressed = () => {
        verifiers.forEach((e, i) => {
            if (sketch.dist(sketch.mouseX, sketch.mouseY, e.x, e.y) < e.diameter) {
                entitySelectedIndex = i;
            }
        });
    }

    sketch.mouseReleased = () => {
        entitySelectedIndex = -1;
    }
}, "entity-canvas");

let myp5User = new p5(sketch1 => {
    sketch1.setup = () => {
        let canvUser = sketch1.createCanvas(500, 100);
        canvUser.position(10,20)
        let rand1 = sketch1.createButton('1')
        rand1.position(20,70);

        let rand2 = sketch1.createButton('2')
        rand2.position(40,70);

        // let input = sketch1.createInput();
        // input.position(20, 70);

        let commit = sketch1.createButton('commit');
        commit.position(rand2.x + rand2.width, rand2.y);
        // commit.mousePressed();

        let instruction = sketch1.createElement('h3', "Please choose one of the two following randomness.")
        instruction.position(rand1.x, 10);

        // sketch1.textAlign(CENTER);
        sketch1.textSize(100);
    }

    sketch1.draw = () => {
        sketch1.background(220);

    }

}, "user-canvas");

/*
    Canvas that displays the graph
 */
let myp5Graph = new p5(sketch2 => {
    sketch2.setup = () => {
        let canv = sketch2.createCanvas(500, 500);
        canv.position(600,200);
        cells = getCells();
        connections = getConnections();

    }

    sketch2.draw = () => {
        sketch2.background(220);





    }

}, "graph-canvas");