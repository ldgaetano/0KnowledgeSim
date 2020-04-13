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

// The graph cells
let threeCol;
let selected = [];
let selectID = [];
let r0,r1,r2,s0,s1,s2;
let b = [];
// 0 => user information
// 2 => backend user information
let edge0 = []
//let edge1 = [];
let edge2 = [];
let intercr, intercs;
let wi, wj, wipp, wjpp;
let wiPos, wjPos, wippPos, wjppPos;



/*
Generate random b_i for each of the nodes
*/
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is exclusive and the minimum is inclusive
};


/*
    Canvas that displays the graph
 */
let myp5Graph = new p5(sketch2 => {
    let cells = [];
    let connections = [];
    sketch2.setup = () => {
        let canv = sketch2.createCanvas(500, 500);
        canv.position(10,200);

        // Defining the coordinate system for displaying the graph
        let origin_x = 86.6;
        let origin_y = 250;
        let x = 86.6;
        let y = 50;

        // Create cells
        const cell_1 = new Cell(0, origin_x, origin_y);
        const cell_2 = new Cell(1, origin_x + x, origin_y - 3*y);
        const cell_3 = new Cell(2, origin_x + 3*x, origin_y - 3*y);
        const cell_4 = new Cell(3, origin_x + 4*x, origin_y);
        const cell_5 = new Cell(4, origin_x + 3*x, origin_y + 3*y);
        const cell_6 = new Cell(5, origin_x + x, origin_y + 3*y);
        const cell_7 = new Cell(6, origin_x + x, origin_y + y);
        const cell_8 = new Cell(7, origin_x + x, origin_y - y);
        const cell_9 = new Cell(8, origin_x + 2*x, origin_y - 2*y);
        const cell_10 = new Cell(9, origin_x + 3*x, origin_y - y);
        const cell_11 = new Cell(10, origin_x + 3*x, origin_y + y);
        const cell_12 = new Cell(11, origin_x + 2*x, origin_y + 2*y);

        // Add cells to cells list
        cells.push(cell_1);
        cells.push(cell_2);
        cells.push(cell_3);
        cells.push(cell_4);
        cells.push(cell_5);
        cells.push(cell_6);
        cells.push(cell_7);
        cells.push(cell_8);
        cells.push(cell_9);
        cells.push(cell_10);
        cells.push(cell_11);
        cells.push(cell_12);

        // Create connections between cells
        const c1 = new Connection(cell_1, cell_7);
        const c2 = new Connection(cell_1, cell_8);
        const c3 = new Connection(cell_8, cell_7);
        const c4 = new Connection(cell_8, cell_2);
        const c5 = new Connection(cell_8, cell_9);
        const c6 = new Connection(cell_2, cell_9);
        const c7 = new Connection(cell_2, cell_5);
        const c8 = new Connection(cell_9, cell_3);
        const c9 = new Connection(cell_9, cell_10);
        const c10 = new Connection(cell_3, cell_10);
        const c11 = new Connection(cell_3, cell_6);
        const c12 = new Connection(cell_10, cell_11);
        const c13 = new Connection(cell_10, cell_4);
        const c14 = new Connection(cell_4, cell_11);
        const c15 = new Connection(cell_11, cell_12);
        const c16 = new Connection(cell_11, cell_5);
        const c17 = new Connection(cell_5, cell_12);
        const c18 = new Connection(cell_12, cell_6);
        const c19 = new Connection(cell_12, cell_7);
        const c20 = new Connection(cell_6, cell_7);

        // Add connections to connections list
        connections.push(c1);
        connections.push(c2);
        connections.push(c3);
        connections.push(c4);
        connections.push(c5);
        connections.push(c6);
        connections.push(c7);
        connections.push(c8);
        connections.push(c9);
        connections.push(c10);
        connections.push(c11);
        connections.push(c12);
        connections.push(c13);
        connections.push(c14);
        connections.push(c15);
        connections.push(c16);
        connections.push(c17);
        connections.push(c18);
        connections.push(c19);
        connections.push(c20);
    };
    // Find the adjacency list
    let V = [0,1,2,3,4,5,6,7,8,9,10,11];
    let E = [[0,6],[0,7], [7,6], [7,1], [7,8], [1,8], [1,4],[8,2],[8,9], [2,9],[2,5], [9,10], [9,3],
        [3,10], [10,11], [10,4],[4,11],[11,5],[11,6],[5,6]];
    let AdjMatrix = [];

    for (let j=0; j< V.length; j++) {
        let neighbours = [];
        let ind = 0; // initialise an index at 0
        for (let i = 0; i < E.length; i++){
            // if node index in the array
            if(E[i].includes(V.indexOf(V[j])))
            {
                ind = E[i].indexOf(V.indexOf(V[j]));
                ind = 1-ind;
                neighbours.push(E[i][ind]);
            }
        }
        AdjMatrix.push(neighbours);
    }
    console.log(AdjMatrix);

    //Three coloring algorithm -- using backtracking
    threeCol = [];
    let color = Array(V.length);
    color.fill(-1);

    function coloring(node) {
        if (node == V.length) {
            threeCol.push([...color]);
            return;
        }

        let availableCol = [true, true, true];
        for(let i = 0; i < AdjMatrix[node].length; i++)
            if (color[AdjMatrix[node][i]] != -1)
                availableCol[color[AdjMatrix[node][i]]] = false;

        for (let i = 0; i < 3; ++i) {
            if (availableCol[i]) {
                color[node] = i;
                coloring(node + 1);
            }
        }

        color[node] = -1;
    }
    // calling the function
    coloring(0);

    // only need 6 of the 18 permutations
    threeCol = [threeCol[0], threeCol[1], threeCol[8], threeCol[9], threeCol[16], threeCol[17]];
    console.log(threeCol);

    sketch2.draw = () => {
        sketch2.background(220);
        connections.forEach(conn => {
            conn.render(sketch2);
        });

        cells.forEach (cell => {
            if (cell.isInside(sketch2.mouseX, sketch2.mouseY, sketch2)) cell.flags.hover = true;
            else cell.flags.hover = false;

            cell.render(sketch2);
        });
    };

    // Change node color and log selected nodes when clicking
    sketch2.mouseClicked = () => {
        cells.forEach(cell => {
            if (cell.isInside(sketch2.mouseX, sketch2.mouseY, sketch2)){
                // cell.flags.clicked = true;
                if(selected.length < 2) {
                    selected.push(cell);
                    selectID.push(cell.id);
                    console.log(selectID);
                    cell.changeCol(selected);
                }
                else{
                    selected = [];
                    selectID =[]
                }
            }
            else cell.flags.clicked = false;
        });
    };

    //Find the pre-agreed b value for each of the nodes
    for (let i = 0; i< V.length; i++){
        b.push(getRandomInt(0,2));
    }

}, "graph-canvas");

/*
User interaction canvas
 */
let myp5User = new p5(sketch1 => {
    let consist;
    let edge;
    let well;
    let p1, p2, n1, n2, n3, n4;
    let init_com = "-";

    sketch1.setup = () => {
        let canvUser = sketch1.createCanvas(1200, 100);
        canvUser.position(10,5);

        // chose randomness selection for node i and j
        node1_r = sketch1.createSelect();
        node2_s = sketch1.createSelect();

        node1_r.position(60, 70);
        node2_s.position(node1_r.x+90, node1_r.y);

        node1_r.option('1');
        node1_r.option('2');

        node2_s.option('1');
        node2_s.option('2');



        // set up 2 different buttons
        edge = sketch1.createButton('Edge verification');
        well = sketch1.createButton('Check for well-definition');

        // edge verification
        edge.position(20, 120);
        edge.style('font-size', '20px');
        edge.style('background-color', sketch1.color(255));
        edge.style('color: black');
        edge.mouseClicked(update);

        // well definition
        well.position(edge.x, edge.y + edge.height+20);
        well.style('font-size', '20px');
        well.style('background-color', sketch1.color(255));
        well.style('color: black');
        well.mouseClicked(update);
        // Instruction to user
        let instruction = sketch1.createElement("h3", "Please choose 2 adjacent nodes with appropriate r and s values");
        instruction.position(edge.x, 5);

        let n1_text = sketch1.createElement("h4", "r_i");
        let n2_text = sketch1.createElement("h4", "r_j");
        n1_text.position(30, 50);
        n2_text.position(node2_s.x-30, 50);

        // set up output table
        p1 = sketch1.createElement('h4', "Prover 1");
        p1.position(600, 40);
        p2 = sketch1.createElement('h4', "Prover 2");
        p2.position(600, p1.y + p1.height*2);

        // node names
        n1 = sketch1.createElement('h4', "Node i" );
        n2 = sketch1.createElement('h4', "Node j" );
        n3 = sketch1.createElement('h4', "Node i'");
        n4 = sketch1.createElement('h4', "Node j'");
        n1.position(700, 5);
        n2.position(800, 5);
        n3.position(900, 5);
        n4.position(1000, 5);

        // commit values
        wiPos = sketch1.createElement('h4', init_com);
        wiPos.position(n1.x, p1.y);

        wjPos = sketch1.createElement('h4', init_com);
        wjPos.position(n2.x, p1.y);

        wippPos = sketch1.createElement('h4', init_com);
        wippPos.position(n3.x, p2.y);

        wjppPos = sketch1.createElement('h4', init_com);
        wjppPos.position(n4.x, p2.y);

        if(edge0[0] == null || edge0[1]== null ) {
            n1.html("Node i" );
            n2.html("Node j" );
            n3.html("Node i'");
            n4.html("Node j'");

            wiPos.html(init_com);
            wjPos.html(init_com);
            wippPos.html(init_com);
            wjppPos.html(init_com);

        }

    };

    /*
    Dynamic update when clicking on one of the 3 functionalities
     */
    let update = () => {
        // randomness for user
        r0 = node1_r.value();
        s0 = node2_s.value();

        // randomness for backend verifier
        r2 = getRandomInt(1,2);
        s2 = 3 - r2;
        edge0 = [...selectID];
        if (sketch1.dist(sketch1.mouseX, sketch1.mouseY, edge.x, edge.y) < 30){
            edge.style('background-color', sketch1.color(255,200,200));
            // r0 = s2;
            // s0 = r2;
            edgeV();
            // printText();
            n1.html("Node i = " + edge0[0].toString(10));
            n2.html("Node j = " + edge0[1].toString(10));

            wiPos.html(wi);
            wjPos.html(wj);
            wippPos.html(wipp);
            wjppPos.html(wjpp);


            selectID = [];
        } else if (sketch1.dist(sketch1.mouseX, sketch1.mouseY, well.x, well.y) < 30) {
            well.style('background-color', sketch1.color(255, 200, 200));

            // r0 = r2;
            // s0 = s2;
            let ind = getRandomInt(0, 1);
            // id of intersecting node
            intercr = selectID[ind];
            intercs = selectID[1 - ind];
            n1.html("Node i = " + edge0[0].toString(10));
            n2.html("Node j = " + edge0[1].toString(10));
            wellDef();
            let luck = getRandomInt(0, 2);
            if (luck == 0) {
                // node i is intersected
                wiPos.html(wi);
                wippPos.html(wipp);

            }
            else if (luck == 1) {
                // node j is intersected
                wjPos.html(wj);
                wjppPos.html(wjpp);
            } else {
                consistency();

                wiPos.html(wi);
                wippPos.html(wipp);

                wjPos.html(wj);
                wjppPos.html(wjpp);

            }
            console.log("luck=" + luck);
            selectID = [];
        }
    };

    /*
    Calculation for each of the 3 cases
     */
    function consistency(){
        const randomIndex = getRandomInt(0,threeCol.length-1);
        wi = b[edge0[0]] * r0 + threeCol[randomIndex][edge0[0]];
        wj = b[edge0[1]] * s0 + threeCol[randomIndex][edge0[1]];
        wipp = b[selectID[0]] * r2 + threeCol[randomIndex][selectID[0]];
        wjpp = b[selectID[1]] * s2 + threeCol[randomIndex][selectID[1]];
    }
    function edgeV(){
        const randomIndex = getRandomInt(0,threeCol.length-1);
        wi = b[edge0[0]] * r0 + threeCol[randomIndex][edge0[0]];
        wj = b[edge0[1]] * s0 + threeCol[randomIndex][edge0[1]];
        wipp = b[selectID[0]] * r2 + threeCol[randomIndex][selectID[0]];
        wjpp = b[selectID[1]] * s2 + threeCol[randomIndex][selectID[1]];
    }
    function wellDef(){
        const randomIndex = getRandomInt(0,threeCol.length-1);
        wi = b[intercr] * r0 + threeCol[randomIndex][intercr];
        wipp = b[intercr] * r0 + threeCol[randomIndex][intercr];

        wj = b[intercs] * s0 + threeCol[randomIndex][intercs];
        wjpp = b[intercs] * s0 + threeCol[randomIndex][intercs];
    }
    sketch1.draw = () => {
        sketch1.background(255);

    }

}, "user-canvas");

/* Information Propagation Simulation*/
let myp5 = new p5(sketch => {
    sketch.setup = () => {

        let canv = sketch.createCanvas(500, 500);
        canv.position(600, 200)
        resetSketch();
        let reset = sketch.createButton("reset");
        reset.position(600,150)
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
    };

    sketch.mousePressed = () => {
        verifiers.forEach((e, i) => {
            if (sketch.dist(sketch.mouseX, sketch.mouseY, e.x, e.y) < e.diameter) {
                entitySelectedIndex = i;
            }
        });
    };

    sketch.mouseReleased = () => {
        entitySelectedIndex = -1;
    }
}, "entity-canvas");

