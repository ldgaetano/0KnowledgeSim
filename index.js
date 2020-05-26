console.log("--- ZERO KNOWLEDGE SIM ---");
console.log("Written by Luca D'Angelo and Jenny Long");
console.log("McGill University 2020 \n");
/*
    Defining global constants
 */
let requestClicked = false;

const diameter = 30;
const rate =  50

// The provers
let p1;
let p2;

// The verifiers
let v1;
let v2;

let entitySelectedIndex = -1;
let provers;
let verifiers;

// The valid graph colorings
let threeCol = [];

// The graph
let V = [0,1,2,3,4,5,6,7,8,9,10,11];
let E = [[0,6], [0,7], [7,6], [7,1], [7,8], [1,8], [1,4], [8,2], [8,9], [2,9], [2,5], [9,10], [9,3], [3,10], [10,11], [10,4], [4,11], [11,5], [11,6], [5,6]];
let AdjMatrix = [];

/*
Color value is based on index of graphCol array:
    0 = "red"
    1 = "green"
    2 = "blue"
 */
let graphCol = ["red", "green", "blue"];

console.log("COLOR CODE: 0 => RED, 1 => GREEN, 2 => BLUE");

// 0 => user information
// 2 => backend user information
let previous = [];
let selected = [];
let selectID = [];
let r0,r2,s0,s2;
let b = [];
let selected2 = [];
let selectID2 = [];
let intercr, intercs;
let wi, wj, wipp, wjpp;
let wiPos, wjPos, wippPos, wjppPos;

// Arrays where nodes and edges are stored for the 'displayed' graph
let cells = [];
let connections = [];

// cells
let cell_1, cell_2, cell_3, cell_4, cell_5, cell_6, cell_7, cell_8, cell_9, cell_10, cell_11, cell_12;

// connections
let c1, c2, c3, c4, c5, c6, c7, c8, c9, c10, c11, c12, c13, c14, c15, c16, c17, c18, c19, c20, c21;

// Buttons
let honest;
let dishonest;
let request;
let edge;
let well;
let pr1, pr2, n1, n2, n3, n4, r2_text, s2_text, result;
let init_com = "-";
let node1_r;
let node2_s;



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


    // Find the adjacency list
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
    console.log("Adjacency List: \n");
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

    console.log("Possible 3-colorings: \n");
    console.log(threeCol);

    sketch2.setup = () => {
        let canv = sketch2.createCanvas(500, 500);
        canv.position(10,280);

        // Defining the coordinate system for displaying the graph
        let origin_x = 86.6;
        let origin_y = 250;
        let x = 86.6;
        let y = 50;

        // Create cells
        cell_1 = new Cell(0, origin_x, origin_y);
        cell_2 = new Cell(1, origin_x + x, origin_y - 3*y);
        cell_3 = new Cell(2, origin_x + 3*x, origin_y - 3*y);
        cell_4 = new Cell(3, origin_x + 4*x, origin_y);
        cell_5 = new Cell(4, origin_x + 3*x, origin_y + 3*y);
        cell_6 = new Cell(5, origin_x + x, origin_y + 3*y);
        cell_7 = new Cell(6, origin_x + x, origin_y + y);
        cell_8 = new Cell(7, origin_x + x, origin_y - y);
        cell_9 = new Cell(8, origin_x + 2*x, origin_y - 2*y);
        cell_10 = new Cell(9, origin_x + 3*x, origin_y - y);
        cell_11 = new Cell(10, origin_x + 3*x, origin_y + y);
        cell_12 = new Cell(11, origin_x + 2*x, origin_y + 2*y);

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
        c1 = new Connection(cell_1, cell_7);
        c2 = new Connection(cell_1, cell_8);
        c3 = new Connection(cell_8, cell_7);
        c4 = new Connection(cell_8, cell_2);
        c5 = new Connection(cell_8, cell_9);
        c6 = new Connection(cell_2, cell_9);
        c7 = new Connection(cell_2, cell_5);
        c8 = new Connection(cell_9, cell_3);
        c9 = new Connection(cell_9, cell_10);
        c10 = new Connection(cell_3, cell_10);
        c11 = new Connection(cell_3, cell_6);
        c12 = new Connection(cell_10, cell_11);
        c13 = new Connection(cell_10, cell_4);
        c14 = new Connection(cell_4, cell_11);
        c15 = new Connection(cell_11, cell_12);
        c16 = new Connection(cell_11, cell_5);
        c17 = new Connection(cell_5, cell_12);
        c18 = new Connection(cell_12, cell_6);
        c19 = new Connection(cell_12, cell_7);
        c20 = new Connection(cell_6, cell_7);

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

    // Draw the graph
    sketch2.draw = () => {
        sketch2.background(220);
        connections.forEach(conn => {
            conn.render(sketch2);
        });

        // Change node colour when hovering over it with mouse
        cells.forEach (cell => {
            if (cell.isInside(sketch2.mouseX, sketch2.mouseY, sketch2)) {
                cell.flags.hover = true;
                if (previous.includes(cell)) {
                    cell.flags.hover = true;
                    cell.flags.revealed = false;
                }
            } else {
                cell.flags.hover = false;
                if (previous.includes(cell)) {
                    cell.flags.hover = false;
                    cell.flags.revealed = true;
                }
            }
            cell.render(sketch2);
        });


    };

    // Change node color and log selected nodes when clicking
    sketch2.mouseClicked = () => {

        cells.forEach(cell => {
            if (cell.isInside(sketch2.mouseX, sketch2.mouseY, sketch2)){
                if(selected.length < 2) {
                    selected.push(cell);
                    selectID.push(cell.id);
                    cell.changeCol(selected);
                 } else{
                    selected = [];
                    selectID =[]
                    selected.push(cell);
                    selectID.push(cell.id);
                    cell.changeCol(selected);
                }

                if (selected.length == 2) {
                    console.log("Cells Selected Below: \n");
                    console.log("--Node ID: ");
                    console.log(selectID);
                    console.log("--Node Object: ");
                    console.log(selected);
                }

            } else {
                cell.flags.clicked = false;
            };
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


    sketch1.setup = () => {
        let canvUser = sketch1.createCanvas(1200, 265);
        canvUser.position(10,5);

        // Instructions to user
        let instruction_1 = sketch1.createElement("h3", "Please choose 2 adjacent nodes with appropriate r and s values");
        instruction_1.position(20, 1);

        let instruction_2 = sketch1.createElement("h3", "Please choose nodes in ascending order");
        instruction_2.position(20, 25);

        // Randomness options text
        let n1_text = sketch1.createElement("h4", "r");
        let n2_text = sketch1.createElement("h4", "s");
        n1_text.position(30, 60);
        n2_text.position(120, 60);

        // chose randomness selection for node i and j
        node1_r = sketch1.createSelect();
        node2_s = sketch1.createSelect();

        node1_r.position(45, 80);
        node2_s.position(node1_r.x+90, node1_r.y);

        node1_r.option('1');
        node1_r.option('2');

        node2_s.option('1');
        node2_s.option('2');

        // set up the different buttons
        honest = sketch1.createButton('Honest Prover Case');
        request = sketch1.createButton('Request');
        edge = sketch1.createButton('Edge Verification Test');
        well = sketch1.createButton('Well-definition Test');
        dishonest = sketch1.createButton('Dishonest Prover Case');

        // honest prover button
        honest.position(20, 120);
        honest.style('font-size', '20px');
        honest.style('background-color', sketch1.color(255));
        honest.style('color: black');
        honest.mouseClicked(honest_update);

        // dishonest prover button
        dishonest.position(honest.x + 280, honest.y);
        dishonest.style('font-size', '20px');
        dishonest.style('background-color', sketch1.color(255));
        dishonest.style('color: black');
        dishonest.mouseClicked(dishonest_update);

        // request
        request.position(210, honest.y+honest.height+20);
        request.style('font-size', '20px');
        request.style('background-color', sketch1.color(255));
        request.style('color: black');
        request.id('comButton');
        request.mouseClicked(() => {
            request_update();
            requestClicked = true;
        })

        // edge verification
        edge.position(160, request.y + request.height+10);
        edge.style('font-size', '20px');
        edge.style('background-color', sketch1.color(255));
        edge.style('color: black');
        edge.mouseClicked(() => {
            edge_update();
            requestClicked = true;
        });

        // well definition
        well.position(170, edge.y + edge.height+20);
        well.style('font-size', '20px');
        well.style('background-color', sketch1.color(255));
        well.style('color: black');
        well.mouseClicked(() => {
            well_update();
            requestClicked = true;
        });

        // set up output table
        pr1 = sketch1.createElement('h4', "Prover 1");
        pr1.position(600, 40);
        pr2 = sketch1.createElement('h4', "Prover 2");
        pr2.position(600, pr1.y + pr1.height*2);

        // node names
        n1 = sketch1.createElement('h4', "Node i" );
        n2 = sketch1.createElement('h4', "Node j" );
        n3 = sketch1.createElement('h4', "Node i'");
        n4 = sketch1.createElement('h4', "Node j'");
        r2_text = sketch1.createElement('h4', "r'");
        s2_text = sketch1.createElement('h4', "s'");
        n1.position(700, 5);
        n2.position(800, 5);
        n3.position(900, 5);
        n4.position(1000, 5);
        r2_text.position(1100, 5);
        s2_text.position(1150, 5);

        // commit values for each node
        wiPos = sketch1.createElement('h4', init_com);
        wiPos.position(n1.x, pr1.y);

        wjPos = sketch1.createElement('h4', init_com);
        wjPos.position(n2.x, pr1.y);

        wippPos = sketch1.createElement('h4', init_com);
        wippPos.position(n3.x, pr2.y);

        wjppPos = sketch1.createElement('h4', init_com);
        wjppPos.position(n4.x, pr2.y);

        if(selectID[0] == null || selectID[1]== null ) {
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
    Function called when request button clicked
     */
    let request_update = () => {

        checkEdge(selectID);

        console.log("REQUEST");

        // change the flags of the previously selected nodes
        if (previous.length > 0) {
            previous.forEach(cell => {
                cell.flags.revealed = false;
                cell.flags.clicked = false;
                cell.flags.hover = false;
                cell.revealCol = 255;
            });
            previous = [];
        }

        // pick three-coloring of the graph
        let randomIndex = getRandomInt(0, threeCol.length-1);
        update3Col(randomIndex);

        // user picks edge with r and s
        r0 = node1_r.value();
        s0 = node2_s.value();

        console.log("Node i: " + selectID[0]);
        console.log("Node j: " + selectID[1]);

        console.log("r = " + r0);
        console.log("s = " + s0);

        // pick random edge in graph
        selected2 = getEdge();                          // cell objects
        selectID2 = [selected2[0].id, selected2[1].id]; // cell id

        console.log("Node i': " + selectID2[0]);
        console.log("Node j': " + selectID2[1]);

        // backend pick random r' and s'
        r2 = getRandomInt(1,2);
        s2 = getRandomInt(1,2);

        console.log("r' = " + r2);
        console.log("s' = " + s2);

        // calculate commits
        commits(randomIndex);
        console.log("w_i: " + wi);
        console.log("w_j: " + wj);
        console.log("w_ip: " + wipp);
        console.log("w_jp: " + wjpp);

        // display commits
        n1.html("Node i = " + selectID[0].toString(10));
        n2.html("Node j = " + selectID[1].toString(10));
        n3.html("Node i' = " + selectID2[0].toString(10));
        n4.html("Node j' = " + selectID2[1].toString(10));
        r2_text.html("r' = " + r2);
        s2_text.html("s' = " + s2);

        wiPos.html(wi);
        wjPos.html(wj);
        wippPos.html(wipp);
        wjppPos.html(wjpp);

        let i = selectID[0];
        let j = selectID[1];
        let ip = selectID2[0];
        let jp = selectID2[1];

        // Go through protocol and display color of nodes if it occurs
        if(i == ip && j==jp) {
            if (r0 != r2) {
                console.log(selected[0].revealCol);
                selected[0].flags.revealed = true;
                console.log(selected[0]);
                previous.push(selected[0]);
            }
            if (s0 != s2) {
                console.log(selected[1].revealCol);
                selected[1].flags.revealed = true;
                console.log(selected[1]);
                previous.push(selected[1]);
            }
            if (r0 == r2) {
                if(wi == wipp){
                    console.log("Well definition passed on node i and i'")
                }
            }
            if (s0 == s2) {
                if(wj == wjpp){
                    console.log("Well definition passed on node j and j'")
                }
            }
        }
        else{

            if (i == ip && r0 != r2){
                console.log(selected[0].revealCol);
                selected[0].flags.revealed = true;
                console.log(selected[0]);
                previous.push(selected[0]);
            }
            else if (i == jp && r0 != s2){
                console.log(selected[0].revealCol);
                selected[0].flags.revealed = true;
                console.log(selected[0]);
                previous.push(selected[0]);
            }
            else if (j == jp && s0 != s2){
                console.log(selected[1].revealCol);
                selected[1].flags.revealed = true;
                console.log(selected[1]);
                previous.push(selected[1]);
            }
            else if (j == ip && s0 != r2){
                console.log(selected[1].revealCol);
                selected[1].flags.revealed = true;
                console.log(selected[1]);
                previous.push(selected[1]);
            }
            else if (i == ip && r0 == r2){
                if(wi == wipp) {
                    console.log("Well definition passed for node i and i'");
                }
            }
            else if (i == jp && r0 == s2){
                if(wi == wjpp) {
                    console.log("Well definition passed for node i and j'");
                }
            }
            else if (j == jp && s0 == s2){
                if(wj == wjpp) {
                    console.log("Well definition passed for node j and j'");
                }
            }
            else if (j == ip && s0 == r2){
                if(wj == wipp) {
                    console.log("Well definition passed for node j and i'");
                }
            }
            else{
                console.log("Edges are disjoint!");

            }
        }
        selectID = [];
    };

    /*
    Function called when edge verification test button clicked
     */
    let edge_update = () => {

        checkEdge(selectID);

        console.log("TEST: Edge-Verification Test");

        // change the flags of the previously selected nodes
        if (previous.length > 0) {
            previous.forEach(cell => {
                cell.flags.revealed = false;
                cell.flags.clicked = false;
                cell.flags.hover = false;
                cell.revealCol = 255;
            });
            previous = [];
        }

        // pick three-coloring of the graph
        let randomIndex = getRandomInt(0, threeCol.length-1);
        update3Col(randomIndex);



        // randomness for user
        r0 = node1_r.value();
        s0 = node2_s.value();

        console.log("Node i: " + selectID[0]);
        console.log("Node j: " + selectID[1]);
        console.log("r = " + r0);
        console.log("s = " + s0);

        // forcing randomness for backend user
        if(r0 == s0){
            r2 = 3 - r0;
            s2 = r2;
        }
        else {
            r2 = s0;
            s2 = r0;
        }

        console.log("Node i': " + selectID[0]);
        console.log("Node j': " + selectID[1]);
        console.log("r' = " + r2);
        console.log("s' = " + s2);

        forced_edgeV(randomIndex);
        n1.html("Node i = " + selectID[0].toString(10));
        n2.html("Node j = " + selectID[1].toString(10));
        n3.html("Node i' = " + selectID[0].toString(10));
        n4.html("Node j' = " + selectID[1].toString(10));
        r2_text.html("r' = " + r2);
        s2_text.html("s' = " + s2);

        wiPos.html(wi);
        wjPos.html(wj);
        wippPos.html(wipp);
        wjppPos.html(wjpp);

        console.log("w_i: " + wi);
        console.log("w_j: " + wj);
        console.log("w_ip: " + wipp);
        console.log("w_jp: " + wjpp);

        // change the reveal flag to show the color
        selected.forEach(cell => {
            cell.flags.revealed = true;
            previous.push(cell);
        });
        selectID = [];

        console.log("Edges are the same!");

    };

    /*
    Function called when well definition test button clicked
     */
    let well_update = () => {

        checkEdge(selectID);

        console.log("TEST: Well-Definition Test");

        // change the flags of the previously selected nodes
        if (previous.length > 0) {
            previous.forEach(cell => {
                cell.flags.revealed = false;
                cell.flags.clicked = false;
                cell.flags.hover = false;
                cell.revealCol = 255;
            });
            previous = [];
        }

        // pick three-coloring of the graph
        let randomIndex = getRandomInt(0, threeCol.length-1);
        update3Col(randomIndex);

        // randomness for user
        r0 = node1_r.value();
        s0 = node2_s.value();


        console.log("Node i: " + selectID[0]);
        console.log("Node j: " + selectID[1]);
        console.log("r = " + r0);
        console.log("s = " + s0);

        // forcing the randomness to be the same
        r2 = r0;
        s2 = s0;

        console.log("r' = " + r2);
        console.log("s' = " + s2);
        r2_text.html("r' = " + r2);
        s2_text.html("s' = " + s2);

        // id of intersecting node
        let ind = getRandomInt(0, 1);
        intercr = selectID[ind];
        intercs = selectID[1 - ind];

        n1.html("Node i = " + selectID[0].toString(10));
        n2.html("Node j = " + selectID[1].toString(10));


        forced_wellDef(randomIndex);
        let otherNode = selectID[0];
        while(otherNode == selectID[0] || otherNode == selectID[1]){
            otherNode = getRandomInt(0,cells.length-1);
        }
        let luck = getRandomInt(0, 6);
        if (luck == 0) {
            wjPos.html('-');
            wjppPos.html('-');
            // node i is intersected
            n3.html("Node i' = " + selectID[0].toString(10));
            n4.html("Node j' = " + otherNode.toString(10));
            console.log("Node i': " + selectID[0]);
            console.log("Node j': " + otherNode);
            wiPos.html("w_i: " + wi);
            wippPos.html("w_ip: " + wipp);
            console.log("CASE: Node i intersected");
        }
        else if (luck == 1) {
            wiPos.html('-');
            wippPos.html('-');
            // node j is intersected
            n3.html("Node i' = " + otherNode.toString(10));
            n4.html("Node j' = " + selectID[1].toString(10));
            console.log("Node i': " + otherNode);
            console.log("Node j': " + selectID[1]);
            console.log("w_j: " + wj);
            console.log("w_jp: " + wjpp);
            wjPos.html(wj);
            wjppPos.html(wjpp);
            console.log("CASE: Node j intersected");
        } else {
            consistency(randomIndex);
            n3.html("Node i' = " + selectID[0].toString(10));
            n4.html("Node j' = " + selectID[1].toString(10));
            console.log("Node i': " + selectID[0]);
            console.log("Node j': " + selectID[1]);
            console.log("w_i: " + wi);
            console.log("w_ip: " + wipp);
            console.log("w_j: " + wj);
            console.log("w_jp: " + wjpp);
            wiPos.html(wi);
            wippPos.html(wipp);
            wjPos.html(wj);
            wjppPos.html(wjpp);
            console.log("CASE: Consistency - same edge");
        }
        selectID = [];
    };


    /*
    Function called when dishonest prover case button clicked
     */
    let dishonest_update = () => {
        // add edge
        // check if edge exists - if not, add the edge
        if (connections.length != 21) {
            c21 = new Connection(cell_1, cell_4);
            connections.push(c21);
        }
        console.log("DISHONEST PROVER CASE");
    };

    /*
    Function called when the honest prover button clicked
     */
    let honest_update = () => {
        if (connections.length == 21) {
            connections.pop(); // pop off c21 if it exists
        }
        console.log("HONEST PROVER CASE");
    };

    /*
    Function to get random edge in graph
     */
    function getEdge() {
        let connection_index = getRandomInt(0, connections.length-1);
        let edge = connections[connection_index];
        let cell1 = edge.cell1;
        let cell2 = edge.cell2;
        if (cell1.id > cell2.id) {
            let temp = cell1;
            cell1 = cell2;
            cell2 = temp;
        }
        return [cell1, cell2];
    }

    /*
    Commit values for COMMIT case
     */
    function commits(randomIndex) {
        wi = checkModSum(b[selectID[0]] * r0 + threeCol[randomIndex][selectID[0]]);
        wj = checkModSum(b[selectID[1]] * s0 + threeCol[randomIndex][selectID[1]]);
        wipp = checkModSum(b[selectID2[0]] * r2 + threeCol[randomIndex][selectID2[0]]);
        wjpp = checkModSum(b[selectID2[1]] * s2 + threeCol[randomIndex][selectID2[1]]);

        console.log("b_i: " + b[selectID[0]], "c_i: " + threeCol[randomIndex][selectID[0]]);
        console.log("b_j: " + b[selectID[1]], "c_j: " + threeCol[randomIndex][selectID[1]]);
        console.log("b_ip: " + b[selectID2[0]], "c_ip: " + threeCol[randomIndex][selectID2[0]]);
        console.log("b_jp: " + b[selectID2[1]], "c_jp: " + threeCol[randomIndex][selectID2[1]]);
    }

    /*
    Calculation for each of the 3 cases
     */
    function consistency(randomIndex){
        wi = checkModSum(b[selectID[0]] * r0 + threeCol[randomIndex][selectID[0]]);
        wj = checkModSum(b[selectID[1]] * s0 + threeCol[randomIndex][selectID[1]]);
        wipp = checkModSum(b[selectID[0]] * r2 + threeCol[randomIndex][selectID[0]]);
        wjpp = checkModSum(b[selectID[1]] * s2 + threeCol[randomIndex][selectID[1]]);
    }
    function forced_edgeV(randomIndex){
        wi = checkModSum(b[selectID[0]] * r0 + threeCol[randomIndex][selectID[0]]);
        wj = checkModSum(b[selectID[1]] * s0 + threeCol[randomIndex][selectID[1]]);
        wipp = checkModSum(b[selectID[0]] * r2 + threeCol[randomIndex][selectID[0]]);
        wjpp = checkModSum(b[selectID[1]] * s2 + threeCol[randomIndex][selectID[1]]);
    }
    function forced_wellDef(randomIndex){
        // node i and i' intersect and have the same randomness
        wi = checkModSum(b[intercr] * r0 + threeCol[randomIndex][intercr]);
        wipp = checkModSum(b[intercr] * r0 + threeCol[randomIndex][intercr]);

        // node j and j' intersect and have the same randomness
        wj = checkModSum(b[intercs] * s0 + threeCol[randomIndex][intercs]);
        wjpp = checkModSum(b[intercs] * s0 + threeCol[randomIndex][intercs]);
    }

    sketch1.draw = () => {
        sketch1.background(220);

    }

    /*
    Change coloring of the graph after every query from the verifier
     */
    function update3Col(randomIndex) {
        // select coloring of the graph
        cells.forEach(cell => {
            let colIndex = threeCol[randomIndex][cell.id];
            let col = graphCol[colIndex];
            cell.revealCol = col;
        });
    }


    /*
    Check sum for modulo arithmetic
     */
    function checkModSum(sum) {
        return sum % 3;
    }

    /*
    Check if edge exists
     */
    function checkEdge(edge) {
        let counter = 0;
        for(let i=0; i<E.length; i++) {
            let e = E[i];
            if (!arraysEqual(e, edge)) {
                counter++;
            }
        }
        if (counter == E.length) {
            selected = [];
            selectID = [];
            alert("Pick valid edge!");
        }
    }

    /*
    Check if edge arrays are equal
     */
    function arraysEqual(a1, a2) {
        // check length
        if (a1.length !== a2.length) {
            return false;
        }

        // check contents
        for (let i = 0; i < a1.length; i++) {
            if (a1[i] !== a2[i]) {
                return false;
            }
        }

        // otherwise equal
        return true;
    }


}, "user-canvas");

/* Information Propagation Simulation */
let myp5 = new p5(sketch => {
    sketch.setup = () => {
        let canv = sketch.createCanvas(500, 500);
        canv.position(600, 280);
        p1 = new Prover('P1',100, 50);
        p2 = new Prover('P2',sketch.width - 50, sketch.height -50 );

        v1 = new Verifier('V1', 50, 50);
        v2 = new Verifier('V2',sketch.width - 100, sketch.height - 50);

        provers = [p1, p2];
        verifiers = [v1, v2];

        // In case we want a reset button
        let reset = sketch.createButton('Reset');
        reset.position(600 + canv.width +20, 280);
        // reset.style('font-size', '20px');
        // reset.style('background-color', sketch.color(255));
        // reset.style('color: black');
        reset.mouseClicked(resetSketch);
    }

    // code for resetting the simulation
    let resetSketch = () => {
        p1 = new Prover('P1',100, 50);
        p2 = new Prover('P2',sketch.width - 50, sketch.height -50 );
        set = new Set();
        p1.rings = [];
        p1.rings = [];

        v1 = new Verifier('V1', 50, 50);
        v2 = new Verifier('V2',sketch.width - 100, sketch.height - 50);
        v1.rings = [];
        v2.rings = [];

        provers = [p1, p2];
        verifiers = [v1, v2];

        requestClicked = false
    }

    // function to check if a given pair of prover-verifier completed their communication
    let complete = () => {
        for (let i = 0; i < provers.length; i++){
            if(provers[i].rings.length == 0) continue;
            for (let j=0; j < provers[i].rings.length; j++){
                // let ring = verifiers[i].rings[j];
                let ringp = provers[i].rings[j];
                let d = sketch.dist(verifiers[i].x, verifiers[i].y, provers[i].x, provers[i].y) - verifiers[i].diameter / 2;
                if(ringp.diameter / 2 >= d){
                    verifiers[i].rings.shift();
                    provers[i].rings.shift();

                }
            }
        }
    }

    // same function purpose as the one above, but just for one ring that appears when the buttons are pressed
    let completeOne = () => {
        for (let i = 0; i < provers.length; i++){
            if(provers[i].ring == null) continue;
            let ring1 = provers[0].ring;
            let ring2 = provers[1].ring;

            let d1 = sketch.dist(verifiers[0].x, verifiers[0].y, provers[0].x, provers[0].y) - verifiers[0].diameter / 2;
            let d2 = sketch.dist(verifiers[1].x, verifiers[1].y, provers[1].x, provers[1].y) - verifiers[1].diameter / 2;

            if((ring1.diameter / 2 >= d1) && (ring2.diameter /2 >= d2)){
                verifiers[0].ring.diameter = 0;
                provers[0].ring.diameter = 0;
                verifiers[1].ring.diameter = 0;
                provers[1].ring.diameter = 0;
                requestClicked = false;
                if(d1 > d2){
                    verifiers[1].ring.speed = 1;
                    provers[1].ring.speed = 1;
                }
                else if(d2 >d1){
                    verifiers[0].ring.speed = 1;
                    provers[0].ring.speed = 1;
                }
            }
            if((ring1.diameter / 2 >= d1) && (ring2.diameter /2 < d2)){
                verifiers[0].ring.speed = 0;
                provers[0].ring.speed = 0;
            }
            if((ring2.diameter / 2 >= d2) && (ring1.diameter /2 < d1)){
                verifiers[1].ring.speed = 0;
                provers[1].ring.speed = 0;
            }

        }
    }

    // function to check if V1's info reaches V2 before P1's commit returns back to V1
    let checkIfTouching = () => {
        for (let i = 0; i < verifiers.length; ++i) {
            if (verifiers[i].rings.length == 0) continue;
            let ring = verifiers[i].rings[0];
            for (let j = 0; j < verifiers.length; ++j) {
                if (i == j) continue;
                let d = sketch.dist(verifiers[i].x, verifiers[i].y, verifiers[j].x, verifiers[j].y) - verifiers[j].diameter / 2;
                if (ring.diameter / 2 >= d) {
                    sketch.noLoop();
                    return;
                }
            }
        }
    }

    // same function purpose as the one above, but just for one ring that appears when the buttons are pressed
    let CIT = () => {
        for (let i = 0; i < verifiers.length; ++i) {
            if (verifiers[i].ring == null) continue;
            let ring = verifiers[i].ring;
            for (let j = 0; j < verifiers.length; ++j) {
                if (i == j) continue;
                let d = sketch.dist(verifiers[i].x, verifiers[i].y, verifiers[j].x, verifiers[j].y) - verifiers[j].diameter / 2;
                if (ring.diameter / 2 >= d) {
                    sketch.noLoop();
                    return;
                }
            }
        }
    }


    let set = new Set();
    // function that creates condition for the prover's to commit
    let commit = () => {
        for (let i  = 0; i < verifiers.length; i++){
            if (verifiers[i].rings.length == 0) continue;
            for (let j = 0; j < verifiers[i].rings.length; j++){
                let ring = verifiers[i].rings[j];
                let d = sketch.dist(verifiers[i].x, verifiers[i].y, provers[i].x, provers[i].y) - verifiers[i].diameter /2;
                if (ring.diameter / 2 >= d){
                    // provers[i].update(sketch);
                    // provers[i].render_ring(sketch);
                    set.add(provers[i])
                }
            }

        }
    }

    // same function purpose as the one above, but just for one ring that appears when the buttons are pressed
    let commitOne = () => {
        // if (verifiers[0].ring == null){

        let ring1 = verifiers[0].ring;
        let ring2 = verifiers[1].ring;
        let d1 = sketch.dist(verifiers[0].x, verifiers[0].y, provers[0].x, provers[0].y) - verifiers[0].diameter / 2;
        let d2 = sketch.dist(verifiers[1].x, verifiers[1].y, provers[1].x, provers[1].y) - verifiers[1].diameter / 2;

        if (ring1.diameter / 2 >= d1){
            provers[0].updateOneRing();
            provers[0].renderOneRing(sketch);
            // set1.add(provers[i])
        }
        if (ring2.diameter / 2 >= d2){
            provers[1].updateOneRing();
            provers[1].renderOneRing(sketch);
        }
    }
    sketch.draw = () => {
        sketch.background(220);
        verifiers.forEach((e) => {
            e.update(sketch)
        });
        verifiers.forEach((e) => {
            e.render(sketch)
        });
        Prover.updateAll(sketch, provers, entitySelectedIndex);

        provers.forEach((e) => {
            e.render(sketch)
        });
        commit();
        set.forEach((e)=> {
            e.update(sketch);
            e.render_ring(sketch);
        });
        complete();
        checkIfTouching();
        // If the request or test button are clicked, than we draw the one ring
        if (requestClicked) {
            verifiers.forEach((e) => {
                if(e.ring != null) {
                    e.updateOneRing()
                }
                else{
                    e.ring = {
                        x: this.x,
                        y: this.y,
                        diameter: 1,
                        speed:1
                    };
                    e.updateOneRing()
                }
            });
            verifiers.forEach((e) => {
                if(e.ring != null) {
                    e.renderOneRing(sketch)
                }
                else{
                    e.ring = {
                        x: this.x,
                        y: this.y,
                        diameter: 1,
                        speed:1
                    };
                    e.renderOneRing(sketch)
                }
            });
            commitOne();
            completeOne();
            CIT();
            // Prover.updateAll(sketch, provers, entitySelectedIndex);

        }
    };


    sketch.mousePressed = () => {
        provers.forEach((e, i) => {
            if (sketch.dist(sketch.mouseX, sketch.mouseY, e.x, e.y) < e.diameter) {
                entitySelectedIndex = i;
            }
        });
    };

    sketch.mouseReleased = () => {
        entitySelectedIndex = -1;
    }
}, "entity-canvas");

