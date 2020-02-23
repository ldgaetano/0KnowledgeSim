// var outerDiam = 0;

let p1;
let p2;
let p3;

let v1;
let v2;
let v3;

let entitySelectedIndex = -1;
let entities;

let myp5 = new p5(sketch => {
    sketch.setup = () => {
        sketch.createCanvas(600, 600);
        e1 = new Entity(sketch.width /2, sketch.height/6);
        e2 = new Entity(sketch.width / 10, sketch.height -100 );
        e3 = new Entity(sketch.width - 100, sketch.height - 100)
        entities = [e1, e2, e3];
        sketch.createSlider();
    }

    sketch.draw = () => {
        sketch.background(220);

        Entity.updateAll(sketch, entities, entitySelectedIndex);

        e1.render(sketch);
        e2.render(sketch);
        e3.render(sketch);

    }

    sketch.mousePressed = () => {
        entities.forEach((e, i) => {
            if (sketch.dist(sketch.mouseX, sketch.mouseY, e.x, e.y) < e.radius) {
                entitySelectedIndex = i;
            }
        });
    }

    sketch.mouseReleased = () => {
        entitySelectedIndex = -1;
    }
}, "entity-canvas");