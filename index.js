console.log("--- ZERO KNOWLEDGE SIM ---");
console.log("Written by Luca D'Angelo and Jenny Long");
console.log("McGill University 2020 \n");

/*
    Global Variables
 */

let requestClicked = false;

let entitySelectedIndex = -1;

// The valid graph colorings
let threeCol = [];

// characters
let characters = [];
let provers = [];
let verifiers = [];
const char_diam = 30;

// verifiers
let v1, v2;
const v1_x = 100;
const v1_y = 100;
const v2_x = 450;
const v2_y = 450;
let v1_requests = [];
let v2_requests = [];

// provers
let p1, p2;
const p1_x = 150;
const p1_y = 150;
const p2_x = 400;
const p2_y = 400;

// requests
const info_diam = 0;
const info_speed = 3;
const gen_request_color = "red";
const user_request_name = "User Request";

// Input graph parameters
let graph_params = {
    graph: {
        V: [0,1,2,3,4,5,6,7,8,9,10,11],
        //E: [[0,6], [0,7], [7,6], [7,1], [7,8], [1,8], [1,4], [8,2], [8,9], [2,9], [2,5], [9,10], [9,3], [3,10], [10,11], [10,4], [4,11], [11,5], [11,6], [5,6]],
        E: [[0,6], [0,7], [6,7], [1,7], [7,8], [1,8], [1,4], [2,8], [8,9], [2,9], [2,5], [9,10], [3,9], [3,10], [10,11], [4,10], [4,11], [5,11], [6,11], [5,6]]
    },
    graph_colors: {0: "red", 1: "green", 2: "blue"}
}

// Simulation Instance and DisplayGraph Instance
let zerosim = new Simulation("Zero-Knowledge-Sim", 0, graph_params.graph, graph_params.graph_colors);
let displaygraph = new DisplayGraph("Star Graph", 0, "Star", 86.6, 250, 86.6, 50, graph_params.graph, graph_params.graph_colors);

/*
Color value is based on index of graphCol array:
    Index 0 = "red"
    Index 1 = "green"
    Index 2 = "blue"
 */

let graphCol = {"red": 0, "green": 1, "blue": 2};
graphCol[0]

console.log("COLOR CODE: 0 => RED, 1 => GREEN, 2 => BLUE");

{
    let previous_edge = [];
    let user_selected_edge = [];
    let selected_edge_nodes = [];
    let r_user, r_auto, s_user, s_auto;
    let b = [];
    let auto_selected_edge = [];
    let auto_selected_edge_nodes = [];
    let intercection_r, intercection_s;
    let com_i, com_j, com_ip, com_jp;
    let com_iText, com_jText, com_ipText, com_jpText; //
}

// Buttons
let buttons = {
    cases: {
        honest_case: null,
        dishonest_case: null,
    },
    tests: {
        request: null,
        edge_verification: null,
        well_definition: null,
    },
    user_select: {
        node_i_r: null,
        node_j_s: null
    }
};

// Text
let text = {
    instructions: {
        instruction_1: null,
        instruction_2: null
    },
    user_select: {
        node_i_r: null,
        node_j_s: null
    },
    table: {
        prover_1: null,
        prover_2: null,
        node_i: null,
        node_j: null,
        node_ip: null,
        node_jp: null,
        node_ip_r: null,
        node_jp_s: null,
        result: null,
        init: "-"
    },
    commits: {
        node_i: null,
        node_j: null,
        node_ip: null,
        node_jp: null
    }
};

/*
User Options Canvas
 */
let options = new p5(s1 => {


    s1.setup = () => {
        //console.log(text.table.init);
        let canvUser = s1.createCanvas(1200, 300);

        // Instructions to user
        {
            text.instructions.instruction_1 = s1.createElement("h3", "Please choose 2 adjacent nodes with appropriate r and s values");
            text.instructions.instruction_1.position(20, 1);

            text.instructions.instruction_2 = s1.createElement("h3", "Please choose nodes in ascending order");
            text.instructions.instruction_2.position(20, 25);
        }

        // Randomness options text
        {
            text.user_select.node_i_r = s1.createElement("h4", "r");
            text.user_select.node_j_s = s1.createElement("h4", "s");
            text.user_select.node_i_r.position(30, 60);
            text.user_select.node_j_s.position(120, 60);
        }

        // Randomness select buttons
        {
            buttons.user_select.node_i_r = s1.createSelect();
            buttons.user_select.node_j_s = s1.createSelect();

            buttons.user_select.node_i_r.position(45, 80);
            buttons.user_select.node_j_s.position(buttons.user_select.node_i_r.x + 90, buttons.user_select.node_i_r.y);

            buttons.user_select.node_i_r.option('1');
            buttons.user_select.node_i_r.option('2');

            buttons.user_select.node_j_s.option('1');
            buttons.user_select.node_j_s.option('2');
        }

        // Honest prover button
        {
            buttons.cases.honest_case = s1.createButton('Honest Prover Case');
            buttons.cases.honest_case.position(20, 120);
            buttons.cases.honest_case.style('font-size', '20px');
            buttons.cases.honest_case.style('background-color', s1.color(255));
            buttons.cases.honest_case.style('color: black');
            buttons.cases.honest_case.mouseClicked(honest_update);
        }

        // Dishonest prover button
        {
            buttons.cases.dishonest_case = s1.createButton('Dishonest Prover Case');
            buttons.cases.dishonest_case.position(buttons.cases.honest_case.x + 280, buttons.cases.honest_case.y);
            buttons.cases.dishonest_case.style('font-size', '20px');
            buttons.cases.dishonest_case.style('background-color', s1.color(255));
            buttons.cases.dishonest_case.style('color: black');
            buttons.cases.dishonest_case.mouseClicked(dishonest_update);
        }

        // Request button
        {
            buttons.tests.request = s1.createButton('Request');
            buttons.tests.request.position(210, buttons.cases.honest_case.y + buttons.cases.honest_case.height + 20);
            buttons.tests.request.style('font-size', '20px');
            buttons.tests.request.style('background-color', s1.color(255));
            buttons.tests.request.style('color: black');
            buttons.tests.request.id('comButton');
            buttons.tests.request.mouseClicked(() => {
                requestButtonClicked();
            });
            // buttons.tests.request.mouseClicked(() => {
            //     request_update();
            //     requestClicked = true;
            // })
        }

        // Edge verification button
        {
            buttons.tests.edge_verification = s1.createButton('Edge Verification Test');
            buttons.tests.edge_verification.position(160, buttons.tests.request.y + buttons.tests.request.height + 10);
            buttons.tests.edge_verification.style('font-size', '20px');
            buttons.tests.edge_verification.style('background-color', s1.color(255));
            buttons.tests.edge_verification.style('color: black');
            buttons.tests.edge_verification.mouseClicked(() => {
                edgeVerificationButtonClicked();
                //edge_update();
                //requestClicked = true;
            });
        }

        // Well definition button
        {
            buttons.tests.well_definition = s1.createButton('Well-definition Test');
            buttons.tests.well_definition.position(170, buttons.tests.edge_verification.y + buttons.tests.edge_verification.height + 20);
            buttons.tests.well_definition.style('font-size', '20px');
            buttons.tests.well_definition.style('background-color', s1.color(255));
            buttons.tests.well_definition.style('color: black');
            buttons.tests.well_definition.mouseClicked(() => {
                well_update();
                requestClicked = true;
            });
        }

        // Output table
        {
            text.table.prover_1 = s1.createElement('h4', "Prover 1");
            text.table.prover_1.position(600, 40);
            text.table.prover_2 = s1.createElement('h4', "Prover 2");
            text.table.prover_2.position(600, text.table.prover_1.y + text.table.prover_1.height * 2);
        }

        // Output table node names
        {
            text.table.node_i = s1.createElement('h4', "Node i");
            text.table.node_j = s1.createElement('h4', "Node j");
            text.table.node_ip = s1.createElement('h4', "Node i'");
            text.table.node_jp = s1.createElement('h4', "Node j'");
            text.table.node_ip_r = s1.createElement('h4', "r'");
            text.table.node_jp_s = s1.createElement('h4', "s'");
            text.table.node_i.position(700, 5);
            text.table.node_j.position(800, 5);
            text.table.node_ip.position(900, 5);
            text.table.node_jp.position(1000, 5);
            text.table.node_ip_r.position(1100, 5);
            text.table.node_jp_s.position(1150, 5);
        }

        // Output table commit values for each node
        {
            text.commits.node_i = s1.createElement('h4', text.table.init);
            text.commits.node_i.position(text.table.node_i.x, text.table.prover_1.y);

            text.commits.node_j = s1.createElement('h4', text.table.init);
            text.commits.node_j.position(text.table.node_j.x, text.table.prover_1.y);

            text.commits.node_ip = s1.createElement('h4', text.table.init);
            text.commits.node_ip.position(text.table.node_ip.x, text.table.prover_2.y);

            text.commits.node_jp = s1.createElement('h4', text.table.init);
            text.commits.node_jp.position(text.table.node_jp.x, text.table.prover_2.y);

            // if (simulation_params.requests.user_request.user_selected_nodes[0] == null || simulation_params.requests.user_request.user_selected_nodes[1] == null) {
            //     n1.html("Node i");
            //     n2.html("Node j");
            //     n3.html("Node i'");
            //     n4.html("Node j'");
            //
            //     com_iText.html(init_com);
            //     com_jText.html(init_com);
            //     com_ipText.html(init_com);
            //     com_jpText.html(init_com);
            //
            // }
        }

    };

    /*
    Function called when request button clicked
     */
    function requestButtonClicked() {

        let user_selected_request = {
            edge: Simulation.sort_ascending(displaygraph.selected_cells_id),
            edge_randomness: [parseInt(buttons.user_select.node_i_r.value()), parseInt(buttons.user_select.node_j_s.value())]
        };

        //displaygraph.requestSelected = true;
        zerosim.runSingleSimulation(user_selected_request, "REQUEST");
        console.log(zerosim.simulation_params);
        // let request =
        // request_update();
        // requestClicked = true;
    }

    function request_update() {

        console.log("REQUEST");

        let user_selected_request = {
            edge: Simulation.sort_ascending(displaygraph.selected_cells_id),
            edge_randomness: [buttons.user_select.node_i_r.value(), buttons.user_select.node_j_s.value()]
        }

        // Check if edge exists
        displaygraph.includesEdge()

        // Change the flags of the previously selected cells
        displaygraph.updatePreviousCellsFlags();

        // Pick three-coloring of the graph
        displaygraph.updateDisplayedGraph3Coloring(simulation.simulation_params.coloring);

        // user picks edge with r and s
        r0 = node1_r.value();
        s0 = node2_s.value();

        console.log("Node i: " + selectID[0]);
        console.log("Node j: " + selectID[1]);

        console.log("r = " + r0);
        console.log("s = " + s0);

        // pick random edge in graph
        selected2 = getEdge();                          // cell object
        selectID2 = [selected2[0].id, selected2[1].id]; // cell id

        console.log("Node i': " + selectID2[0]);
        console.log("Node j': " + selectID2[1]);

        // backend picks random r' and s'
        r2 = getRandomInt(1,2);
        s2 = getRandomInt(1,2);

        console.log("r' = " + r2);
        console.log("s' = " + s2);

        // calculate commit values
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
    function edgeVerificationButtonClicked() {

      let user_selected_request = {
          edge: Simulation.sort_ascending(displaygraph.selected_cells_id),
          edge_randomness: [parseInt(buttons.user_select.node_i_r.value()), parseInt(buttons.user_select.node_j_s.value())]
      };

      zerosim.runSingleSimulation(user_selected_request, "FORCED-EDGE-VERIFICATION");
      console.log(zerosim.simulation_params);

    }

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
        com_i = checkModSum(b[selectID[0]] * r0 + threeCol[randomIndex][selectID[0]]);
        com_j = checkModSum(b[selectID[1]] * s0 + threeCol[randomIndex][selectID[1]]);
        com_ip = checkModSum(b[selectID2[0]] * r2 + threeCol[randomIndex][selectID2[0]]);
        com_jp = checkModSum(b[selectID2[1]] * s2 + threeCol[randomIndex][selectID2[1]]);

        console.log("b_i: " + b[selectID[0]], "c_i: " + threeCol[randomIndex][selectID[0]]);
        console.log("b_j: " + b[selectID[1]], "c_j: " + threeCol[randomIndex][selectID[1]]);
        console.log("b_ip: " + b[selectID2[0]], "c_ip: " + threeCol[randomIndex][selectID2[0]]);
        console.log("b_jp: " + b[selectID2[1]], "c_jp: " + threeCol[randomIndex][selectID2[1]]);
    }

    /*
    Calculation for each of the 3 cases
     */
    function consistency(randomIndex){
        com_i = checkModSum(b[selectID[0]] * r0 + threeCol[randomIndex][selectID[0]]);
        com_j = checkModSum(b[selectID[1]] * s0 + threeCol[randomIndex][selectID[1]]);
        com_ip = checkModSum(b[selectID[0]] * r2 + threeCol[randomIndex][selectID[0]]);
        com_jp = checkModSum(b[selectID[1]] * s2 + threeCol[randomIndex][selectID[1]]);
    }
    function forced_edgeV(randomIndex){
        com_i = checkModSum(b[selectID[0]] * r0 + threeCol[randomIndex][selectID[0]]);
        com_j = checkModSum(b[selectID[1]] * s0 + threeCol[randomIndex][selectID[1]]);
        com_ip = checkModSum(b[selectID[0]] * r2 + threeCol[randomIndex][selectID[0]]);
        com_jp = checkModSum(b[selectID[1]] * s2 + threeCol[randomIndex][selectID[1]]);
    }
    function forced_wellDef(randomIndex){
        // node i and i' intersect and have the same randomness
        com_i = checkModSum(b[intercr] * r0 + threeCol[randomIndex][intercr]);
        com_ip = checkModSum(b[intercr] * r0 + threeCol[randomIndex][intercr]);

        // node j and j' intersect and have the same randomness
        com_j = checkModSum(b[intercs] * s0 + threeCol[randomIndex][intercs]);
        com_jp = checkModSum(b[intercs] * s0 + threeCol[randomIndex][intercs]);
    }

    s1.draw = () => {
        s1.background(220);

    }

    /*
    Change coloring of the graph after every query from the verifier
     */
    function update3Coloring(three_coloring) {
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
    function checkModulo(val, modulo) {
        return val % modulo;
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


}, "user-canvas-container");

/*
Graph Canvas
 */
let graph = new p5(s2 => {

    s2.setup = () => {
        let graph_canv = s2.createCanvas(500, 500);
    };

    s2.draw = () => {
        s2.background(220);
        displaygraph.renderDisplayGraph(s2);
    };

    /**
     * Function called on mouse click event.
     */
    s2.mouseClicked = function() {
        // Change node color and log selected nodes when clicking
        displaygraph.checkCellClicking(s2);
    };

}, "graph-canvas-container");

/*
Information Propagation Simulation
*/
// let myp5 = new p5(sketch => {
//
//     sketch.setup = () => {
//         let canv = sketch.createCanvas(500, 500);
//         canv.position(600, 280);
//         p1 = new Prover('P1',100, 50);
//         p2 = new Prover('P2',sketch.width - 50, sketch.height -50 );
//
//         v1 = new Verifier('V1', 50, 50);
//         v2 = new Verifier('V2',sketch.width - 100, sketch.height - 50);
//
//         provers = [p1, p2];
//         verifiers = [v1, v2];
//
//         // In case we want a reset button
//         let reset = sketch.createButton('Reset');
//         reset.position(600 + canv.width +20, 280);
//         // reset.style('font-size', '20px');
//         // reset.style('background-color', sketch.color(255));
//         // reset.style('color: black');
//         reset.mouseClicked(resetSketch);
//     }
//
//     // code for resetting the simulation
//     let resetSketch = () => {
//         p1 = new Prover('P1',100, 50);
//         p2 = new Prover('P2',sketch.width - 50, sketch.height -50 );
//         set = new Set();
//         p1.rings = [];
//         p1.rings = [];
//
//         v1 = new Verifier('V1', 50, 50);
//         v2 = new Verifier('V2',sketch.width - 100, sketch.height - 50);
//         v1.rings = [];
//         v2.rings = [];
//
//         provers = [p1, p2];
//         verifiers = [v1, v2];
//
//         requestClicked = false
//     }
//
//     // function to check if a given pair of prover-verifier completed their communication
//     let complete = () => {
//         for (let i = 0; i < provers.length; i++){
//             if(provers[i].rings.length == 0) continue;
//             for (let j=0; j < provers[i].rings.length; j++){
//                 // let ring = verifiers[i].rings[j];
//                 let ringp = provers[i].rings[j];
//                 let d = sketch.dist(verifiers[i].x, verifiers[i].y, ringp.x, ringp.y) - verifiers[i].diameter / 2;
//                 if(ringp.diameter / 2 >= d){
//                     verifiers[i].rings.shift();
//                     provers[i].rings.shift();
//
//                 }
//             }
//         }
//     }
//
//     // same function purpose as the one above, but just for one ring that appears when the buttons are pressed
//     let completeOne = () => {
//         for (let i = 0; i < provers.length; i++){
//             if(provers[i].ring == null) continue;
//             let ring1 = provers[0].ring;
//             let ring2 = provers[1].ring;
//
//             let d1 = sketch.dist(verifiers[0].x, verifiers[0].y, provers[0].x, provers[0].y) - verifiers[0].diameter / 2;
//             let d2 = sketch.dist(verifiers[1].x, verifiers[1].y, provers[1].x, provers[1].y) - verifiers[1].diameter / 2;
//
//             if((ring1.diameter / 2 >= d1) && (ring2.diameter /2 >= d2)){
//                 verifiers[0].ring.diameter = 0;
//                 provers[0].ring.diameter = 0;
//                 verifiers[1].ring.diameter = 0;
//                 provers[1].ring.diameter = 0;
//                 requestClicked = false;
//                 if(d1 > d2){
//                     verifiers[1].ring.speed = 1;
//                     provers[1].ring.speed = 1;
//                 }
//                 else if(d2 >d1){
//                     verifiers[0].ring.speed = 1;
//                     provers[0].ring.speed = 1;
//                 }
//             }
//             if((ring1.diameter / 2 >= d1) && (ring2.diameter /2 < d2)){
//                 verifiers[0].ring.speed = 0;
//                 provers[0].ring.speed = 0;
//             }
//             if((ring2.diameter / 2 >= d2) && (ring1.diameter /2 < d1)){
//                 verifiers[1].ring.speed = 0;
//                 provers[1].ring.speed = 0;
//             }
//
//         }
//     }
//
//     // function to check if V1's info reaches V2 before P1's commit returns back to V1
//     let checkIfTouching = () => {
//         for (let i = 0; i < verifiers.length; ++i) {
//             if (verifiers[i].rings.length == 0) continue;
//             let ring = verifiers[i].rings[0];
//             for (let j = 0; j < verifiers.length; ++j) {
//                 if (i == j) continue;
//                 let d = sketch.dist(verifiers[i].x, verifiers[i].y, verifiers[j].x, verifiers[j].y) - verifiers[j].diameter / 2;
//                 if (ring.diameter / 2 >= d) {
//                     sketch.noLoop();
//                     return;
//                 }
//             }
//         }
//     }
//
//     // same function purpose as the one above, but just for one ring that appears when the buttons are pressed
//     let CIT = () => {
//         for (let i = 0; i < verifiers.length; ++i) {
//             if (verifiers[i].ring == null) continue;
//             let ring = verifiers[i].ring;
//             for (let j = 0; j < verifiers.length; ++j) {
//                 if (i == j) continue;
//                 let d = sketch.dist(verifiers[i].x, verifiers[i].y, verifiers[j].x, verifiers[j].y) - verifiers[j].diameter / 2;
//                 if (ring.diameter / 2 >= d) {
//                     sketch.noLoop();
//                     return;
//                 }
//             }
//         }
//     }
//
//
//     let set = new Set();
//     // function that creates condition for the prover's to commit
//     let commit = () => {
//         for (let i  = 0; i < verifiers.length; i++){
//             if (verifiers[i].rings.length == 0) continue;
//             for (let j = 0; j < verifiers[i].rings.length; j++) {
//                 let ring = verifiers[i].rings[j];
//                 let d = sketch.dist(verifiers[i].x, verifiers[i].y, provers[i].x, provers[i].y) - verifiers[i].diameter / 2;
//                 if (ring.diameter / 2 >= d) {
//                     provers[i].update(sketch);
//                     // provers[0].render_ringP1(sketch);
//                     // provers[1].render_ringP2(sketch);
//                     // set.add(provers[i])
//
//                 }
//             }
//             if (provers[i].rings.length != 0) {
//                 provers[i].grow();
//             }
//         }
//     }
//
//     // same function purpose as the one above, but just for one ring that appears when the buttons are pressed
//     let commitOne = () => {
//         // if (verifiers[0].ring == null){
//
//         let ring1 = verifiers[0].ring;
//         let ring2 = verifiers[1].ring;
//         let d1 = sketch.dist(verifiers[0].x, verifiers[0].y, provers[0].x, provers[0].y) - verifiers[0].diameter / 2;
//         let d2 = sketch.dist(verifiers[1].x, verifiers[1].y, provers[1].x, provers[1].y) - verifiers[1].diameter / 2;
//
//         if (ring1.diameter / 2 >= d1){
//             provers[0].updateOneRing();
//             provers[0].renderOneRingP1(sketch);
//         }
//         if (ring2.diameter / 2 >= d2){
//             provers[1].updateOneRing();
//             provers[1].renderOneRingP2(sketch);
//         }
//     }
//
//     sketch.draw = () => {
//         sketch.background(220);
//         verifiers.forEach((e) => {
//             e.update(sketch)
//         });
//         verifiers[0].renderV1(sketch)
//         verifiers[1].renderV2(sketch)
//         // verifiers.forEach((e) => {
//         //     e.render(sketch)
//         // });
//
//         Prover.updateAll(sketch, provers, entitySelectedIndex);
//         provers[0].renderP1(sketch);
//         provers[1].renderP2(sketch);
//         // provers.forEach((e) => {
//         //     e.render(sketch)
//         // });
//         commit();
//         provers[0].render_ringP1(sketch);
//         provers[1].render_ringP2(sketch);
//         // set.forEach((e)=> {
//         //     e.update(sketch)
//         //     if (e == provers[0]){
//         //         e.render_ringP1(sketch)
//         //     }
//         //     else{
//         //         e.render_ringP2(sketch);
//         //     }
//         //     // e.update(sketch);
//         //     // e.render_ring(sketch);
//         // });
//         complete();
//         checkIfTouching();
//         // If the request or test button are clicked, than we draw the one ring
//         if (requestClicked) {
//             verifiers.forEach((e) => {
//                 if(e.ring != null) {
//                     e.updateOneRing()
//                 }
//                 else{
//                     e.ring = {
//                         x: this.x,
//                         y: this.y,
//                         diameter: 1,
//                         speed:1
//                     };
//                     e.updateOneRing()
//                 }
//             });
//             if (verifiers[0].ring != null){
//                 verifiers[0].renderOneRingV1(sketch)
//             }
//             else{
//                 verifiers[0].ring = {
//                     x: this.x,
//                     y: this.y,
//                     diameter:1,
//                     speed:1
//                 };
//                 verifiers.renderOneRingV1(sketch)
//             }
//             if (verifiers[1].ring != null){
//                 verifiers[1].renderOneRingV2(sketch)
//             }
//             else{
//                 verifiers[1].ring = {
//                     x: this.x,
//                     y: this.y,
//                     diameter:1,
//                     speed:1
//                 };
//                 verifiers.renderOneRingV2(sketch)
//             }
//             // verifiers.forEach((e) => {
//             //     if(e.ring != null) {
//             //         e.renderOneRing(sketch)
//             //     }
//             //     else{
//             //         e.ring = {
//             //             x: this.x,
//             //             y: this.y,
//             //             diameter: 1,
//             //             speed:1
//             //         };
//             //         e.renderOneRing(sketch)
//             //     }
//             // });
//             commitOne();
//             completeOne();
//             CIT();
//             // Prover.updateAll(sketch, provers, entitySelectedIndex);
//
//         }
//     };
//
//
//     sketch.mousePressed = () => {
//         provers.forEach((e, i) => {
//             if (sketch.dist(sketch.mouseX, sketch.mouseY, e.x, e.y) < e.diameter) {
//                 entitySelectedIndex = i;
//             }
//         });
//     };
//
//     sketch.mouseReleased = () => {
//         entitySelectedIndex = -1;
//     }
// }, "entity-canvas");

let simulation = new p5(s3 => {

    let request_i1, request_i2, request_i3, request_i4;
    let i1, i2, i3, i4;
    i1 = [0, 1, 1, 1];
    i2 = [1, 8, 1, 2];
    i3 = [2, 3, 2, 2];
    i4 = [4, 5, 2, 1];

    let reset_button;

    s3.setup = function() {
        s3.createCanvas(500, 500);
        s3.frameRate(30);
        s3.textSize(30);

        v1 = new Verifier("V1", 0, v1_x, v1_y, char_diam, "blue", "P1", "V2", s3);
        v2 = new Verifier("V2", 1, v2_x, v2_y, char_diam, "green", "P2", "V1", s3);
        p1 = new Prover("P1", 0, p1_x, p1_y, char_diam, "yellow", "V1", "P2", s3);
        p2 = new Prover("P2", 1, p2_x, p2_y, char_diam, "black", "V2", "P1", s3);

        request_i1 = new RequestInfo("I1", 0, i1, v1.getCenterX(), v1.getCenterY(), info_diam, info_speed, v1.getColor(), s3);
        request_i2 = new RequestInfo("I2", 1, i2, v1.getCenterX(), v1.getCenterY(), info_diam, info_speed, v1.getColor(), s3);
        request_i3 = new RequestInfo("I3", 0, i3, v2.getCenterX(), v2.getCenterY(), info_diam, info_speed, v2.getColor(), s3);
        request_i4 = new RequestInfo("I4", 1, i4, v2.getCenterX(), v2.getCenterY(), info_diam, info_speed, v2.getColor(), s3);

        v1_requests = [request_i1, request_i2];
        v2_requests = [request_i3, request_i4];
        v1.addInformation(v1_requests);
        v2.addInformation(v2_requests);

        verifiers = [v1, v2];
        provers = [p1, p2];
        characters = verifiers.concat(provers);

        reset_button = s3.createButton("RESET");
        reset_button.position(10, 475);
        reset_button.mouseClicked(resetSimulation);

        //request_button.mouseClicked(addInfoFromRequestButton());
    };

    s3.draw = function() {
        s3.background(220);
        s3.text(s3.frameCount, 500, 50);
        displayVerifiers();
        displayProvers();
    };

    /**
     * Generate and emit Information from Character instance when clicking on button.
     */
    function addInfoFromRequestButton() {
        v1.addSingleInformationFromUser(generateInformation());
    }

    /**
     * Generate some dummy RequestInfo instances.
     * @returns {RequestInfo}
     */
    function generateInformation() {
        return new RequestInfo(user_request_name, s3.random(), [s3.random(), s3.random(), s3.random(), s3.random()], v1.getCenterX(), v1.getCenterY(), info_diam, info_speed, gen_request_color, s3);
    }

    /**
     * Reset the simulation.
     */
    function resetSimulation() {
        s3.noLoop();
        for(let i in characters) {
            let char = characters[i];
            // Reset the position.
            char.setCenterX(char.getInitCenterX());
            char.setCenterY(char.getInitCenterY());
            // Reset the information.
            char.resetQueuedInformation();
            char.resetDisplayedInformation();
        }
        s3.loop();
    }

    /**
     * Display all of the verifiers required for the simulation.
     */
    function displayVerifiers() {
        if (verifiers.length > 0) {
            for(let i in verifiers) {
                let verifier = verifiers[i];
                verifier.displayCharacter(); // Display prover on the screen every frame.

                // Check for commits from paired provers.
                for(let j in provers) {
                    let prover = provers[j];
                    // Check if verifier and prover are linked together.
                    if (verifier.isProverLinked(prover)) {
                        verifier.scanForCommits(prover.getDisplayedInformations());
                    }
                }

                // Check for requests from paired verifiers.
                for(let k in verifiers) {
                    let compare_verifier = verifiers[k];
                    // Check if verifier pairs are linked together.
                    if (verifier.isVerifierLinked(compare_verifier)) {
                        verifier.scanForPairedRequests(compare_verifier.getDisplayedInformations());
                    }
                }
                verifier.emitInformation();
            }
        }
    }


    /**
     * Display all provers required for the simulation.
     */
    function displayProvers() {
        if(provers.length > 0) {
            for(let i in provers) {
                let prover = provers[i];
                prover.displayCharacter(); // Display prover on the screen every frame.

                // Check for requests from paired verifiers.
                for(let j in verifiers) {
                    let verifier = verifiers[j];
                    // Check if prover and verifier are linked together.
                    if (prover.isVerifierLinked(verifier)) {
                        prover.scanForRequests(verifier.getDisplayedInformations()); // Scan for requests from linked verifier.
                    }
                }
                prover.emitInformation(); // Emit any corresponding commits.
            }
        }
    }

    /**
     * Function to called when mouse click is pressed.
     */
    s3.mousePressed = function() {
        if (characters.length > 0) {
            for(let i in characters) {
                characters[i].characterIsPressed();
            }
        }
    }

    /**
     * Function called when mouse click is released.
     */
    s3.mouseReleased = function() {
        for(let i in characters) {
            characters[i].characterIsReleased();
        }
    }

}, "simulation-canvas-container");


/*
Helper Methods
 */


