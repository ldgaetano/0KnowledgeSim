console.log("--- ZERO KNOWLEDGE SIM ---");
console.log("Written by Luca D'Angelo and Jenny Long");
console.log("McGill University 2020 \n");

/*
    Global Variables
 */

// Input graph parameters
let graph_params = {
    graph: {
        V: [0,1,2,3,4,5,6,7,8,9,10,11],
        //E: [[0,6], [0,7], [7,6], [7,1], [7,8], [1,8], [1,4], [8,2], [8,9], [2,9], [2,5], [9,10], [9,3], [3,10], [10,11], [10,4], [4,11], [11,5], [11,6], [5,6]],
        E: [[0,6], [0,7], [6,7], [1,7], [7,8], [1,8], [1,4], [2,8], [8,9], [2,9], [2,5], [9,10], [3,9], [3,10], [10,11], [4,10], [4,11], [5,11], [6,11], [5,6]],
        compute_E: [[0,6], [0,7], [6,7], [1,7], [7,8], [1,8], [1,4], [2,8], [8,9], [2,9], [2,5], [9,10], [3,9], [3,10], [10,11], [4,10], [4,11], [5,11], [6,11], [5,6]]
    },
    graph_colors: {0: "brown", 1: "yellow", 2: "blue"}
};

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

// provers
let p1, p2;
const p1_x = 150;
const p1_y = 150;
const p2_x = 400;
const p2_y = 400;

// requests
let request_sent_toggle = false;
let automatic_request_sent_toggle = false;
const info_diam = 0;
const info_speed = 3;
const user_request_name = "User Request";

// Simulation Instance and DisplayGraph Instance
let sim_reset_toggle = false;
let iterations = 100;
let frameRate = 30;
let zerosim = new Simulation("Zero-Knowledge-Sim", 0, graph_params.graph, graph_params.graph_colors);
let displaygraph = new DisplayGraph("Star Graph", 0, "Star", 86.6, 250, 86.6, 50, graph_params.graph, graph_params.graph_colors);

// Log color code
console.log("COLOR CODE: 0 => RED, 1 => GREEN, 2 => BLUE");


// Buttons
let buttons = {
    cases: {
        honest_case: null,
        dishonest_case: null,
    },
    modes: {
      regular_mode: null,
      automatic_mode: null
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
        instruction_2: null,
        instruction_3: null,
        instruction_4: null
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
        node_ir: null,
        node_js: null,
        node_ip: null,
        node_jp: null,
        node_ip_r: null,
        node_jp_s: null,
        result: null,
        init: "-",
        commits: {
            node_i: null,
            node_j: null,
            node_ip: null,
            node_jp: null
        }
    }
};

/*
    User Options Canvas
 */
let options = new p5(s1 => {


    s1.setup = () => {
        //console.log(text.table.init);
        let canvUser = s1.createCanvas(1300, 300);
        s1.frameRate(frameRate);

        // Instructions to user
        {
            text.instructions.instruction_1 = s1.createElement("h5", "1. Choose a case:");
            text.instructions.instruction_1.position(20, 0);

            text.instructions.instruction_2 = s1.createElement("h5", "2. Choose a mode:");
            text.instructions.instruction_2.position(text.instructions.instruction_1.x, text.instructions.instruction_1.y + 50);

            text.instructions.instruction_3 = s1.createElement("h5", "3. Regular Mode - Choose 2 nodes with r and s values:");
            text.instructions.instruction_3.position(text.instructions.instruction_2.x, text.instructions.instruction_2.y + 50);

            text.instructions.instruction_4 = s1.createElement("h5", "4. Regular Mode - Action:");
            text.instructions.instruction_4.position(text.instructions.instruction_3.x, text.instructions.instruction_3.y + 50);
        }

        // Honest prover button
        {
            buttons.cases.honest_case = s1.createButton('Honest Prover');
            buttons.cases.honest_case.position(150, 20);
            buttons.cases.honest_case.style('font-size', '14px');
            buttons.cases.honest_case.style('background-color', s1.color(255));
            buttons.cases.honest_case.style('color: black');
            buttons.cases.honest_case.mouseClicked(() => {
                caseButtonClicked("HONEST-CASE");
            });
        }

        // Dishonest prover button
        {
            buttons.cases.dishonest_case = s1.createButton('Dishonest Prover');
            buttons.cases.dishonest_case.position(265, buttons.cases.honest_case.y);
            buttons.cases.dishonest_case.style('font-size', '14px');
            buttons.cases.dishonest_case.style('background-color', s1.color(255));
            buttons.cases.dishonest_case.style('color: black');
            buttons.cases.dishonest_case.mouseClicked(() => {
                caseButtonClicked("DISHONEST-CASE");
            });
        }

        // Regular Mode button
        {
            buttons.modes.regular_mode = s1.createButton('Regular');
            buttons.modes.regular_mode.position(150, 70);
            buttons.modes.regular_mode.style('font-size', '14px');
            buttons.modes.regular_mode.style('background-color', s1.color(255));
            buttons.modes.regular_mode.style('color: black');
            buttons.modes.regular_mode.mouseClicked(() => {
                modeButtonClicked("REGULAR-MODE");
            });
        }

        // Automatic Mode button
        {
            buttons.modes.automatic_mode = s1.createButton('Automatic');
            buttons.modes.automatic_mode.position(buttons.modes.regular_mode.x + 75, buttons.modes.regular_mode.y);
            buttons.modes.automatic_mode.style('font-size', '14px');
            buttons.modes.automatic_mode.style('background-color', s1.color(255));
            buttons.modes.automatic_mode.style('color: black');
            buttons.modes.automatic_mode.mouseClicked(() => {
                modeButtonClicked("AUTOMATIC-MODE");
            });
        }

        // Randomness options text
        {
            text.user_select.node_i_r = s1.createElement("h5", "r");
            text.user_select.node_j_s = s1.createElement("h5", "s");
            text.user_select.node_i_r.position(375, 100);
            text.user_select.node_j_s.position(425, 100);
        }

        // Randomness select buttons
        {
            buttons.user_select.node_i_r = s1.createSelect();
            buttons.user_select.node_j_s = s1.createSelect();

            buttons.user_select.node_i_r.position(385, 120);
            buttons.user_select.node_j_s.position(435, 120);

            buttons.user_select.node_i_r.option('1');
            buttons.user_select.node_i_r.option('2');

            buttons.user_select.node_j_s.option('1');
            buttons.user_select.node_j_s.option('2');
        }

        // Request button
        {
            buttons.tests.request = s1.createButton('Request');
            buttons.tests.request.position(190, 170);
            buttons.tests.request.style('font-size', '14px');
            buttons.tests.request.style('background-color', s1.color(255));
            buttons.tests.request.style('color: black');
            buttons.tests.request.id('comButton');
            buttons.tests.request.mouseClicked(() => {
                testButtonClicked("REQUEST");

            });
        }

        // Edge verification button
        {
            buttons.tests.edge_verification = s1.createButton('Edge Verification Test');
            buttons.tests.edge_verification.position(190, buttons.tests.request.y + buttons.tests.request.height + 10);
            buttons.tests.edge_verification.style('font-size', '14px');
            buttons.tests.edge_verification.style('background-color', s1.color(255));
            buttons.tests.edge_verification.style('color: black');
            buttons.tests.edge_verification.mouseClicked(() => {
                testButtonClicked("FORCED-EDGE-VERIFICATION");
            });
        }

        // Well definition button
        {
            buttons.tests.well_definition = s1.createButton('Well-Definition Test');
            buttons.tests.well_definition.position(190, buttons.tests.edge_verification.y + buttons.tests.edge_verification.height + 10);
            buttons.tests.well_definition.style('font-size', '14px');
            buttons.tests.well_definition.style('background-color', s1.color(255));
            buttons.tests.well_definition.style('color: black');
            buttons.tests.well_definition.mouseClicked(() => {
                testButtonClicked("FORCED-WELL-DEFINITION");
            });
        }

        // Output table
        {
            text.table.prover_1 = s1.createElement('h5', "Prover 1");
            text.table.prover_1.position(600, 40);

            text.table.prover_2 = s1.createElement('h5', "Prover 2");
            text.table.prover_2.position(600, text.table.prover_1.y + text.table.prover_1.height * 2);
        }

        // Output table node names
        {
            text.table.node_i = s1.createElement('h5', "Node i");
            text.table.node_j = s1.createElement('h5', "Node j");
            text.table.node_ip = s1.createElement('h5', "Node i'");
            text.table.node_jp = s1.createElement('h5', "Node j'");
            text.table.node_i_r = s1.createElement('h5', "r");
            text.table.node_j_s = s1.createElement('h5', "s");
            text.table.node_ip_r = s1.createElement('h5', "r'");
            text.table.node_jp_s = s1.createElement('h5', "s'");

            text.table.node_i.position(700, 5);
            text.table.node_j.position(800, 5);
            text.table.node_ip.position(900, 5);
            text.table.node_jp.position(1000, 5);
            text.table.node_i_r.position(1100, 5);
            text.table.node_j_s.position(1150, 5);
            text.table.node_ip_r.position(1200, 5);
            text.table.node_jp_s.position(1250, 5);
        }

        // Output table commit values for each node
        {
            text.table.commits.node_i = s1.createElement('h5', text.table.init);
            text.table.commits.node_i.position(text.table.node_i.x, text.table.prover_1.y);

            text.table.commits.node_j = s1.createElement('h5', text.table.init);
            text.table.commits.node_j.position(text.table.node_j.x, text.table.prover_1.y);

            text.table.commits.node_ip = s1.createElement('h5', text.table.init);
            text.table.commits.node_ip.position(text.table.node_ip.x, text.table.prover_2.y);

            text.table.commits.node_jp = s1.createElement('h5', text.table.init);
            text.table.commits.node_jp.position(text.table.node_jp.x, text.table.prover_2.y);

        }

    };

    s1.draw = () => {

        s1.background(220);

    }

}, "user-canvas-container");

/*
Graph Canvas
 */
let graph = new p5(s2 => {

    let show_3col;

    s2.setup = () => {

        let graph_canv = s2.createCanvas(500, 500);
        show_3col = s2.createButton("Show 3 Coloring");
        show_3col.position(10, 475);
        show_3col.mouseClicked(() => {
            show3Col();
        });
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

let simulation = new p5(s3 => {

    let reset_button;

    s3.setup = function() {

        s3.createCanvas(500, 500);
        s3.frameRate(frameRate);
        s3.textSize(30);

        // Defining the characters
        v1 = new Verifier("V1", 0, v1_x, v1_y, char_diam, "purple", "P1", "V2", s3);
        v2 = new Verifier("V2", 1, v2_x, v2_y, char_diam, "pink", "P2", "V1", s3);
        p1 = new Prover("P1", 0, p1_x, p1_y, char_diam, "orange", "V1", "P2", s3);
        p2 = new Prover("P2", 1, p2_x, p2_y, char_diam, "black", "V2", "P1", s3);

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

        // Display characters
        displayVerifiers();
        displayProvers();

        // Check test has been chosen by user
        if ( request_sent_toggle ) {

            // Add request to verifiers
            addInfoFromTestButton();

            // Display the node information data to the table
            displayNodeInfoToTable(zerosim.simulation_params);

            // Display colors on display graph
            displayNodeInfoToGraph(zerosim.simulation_params);

            // Change the toggle
            request_sent_toggle = false;
        }

        // Check if automatic mode was chosen by user
        if ( automatic_request_sent_toggle ) {
            for(let i = 0; i < iterations; i++) {

                if (Verifier.sim_stopped_toggle === true || sim_reset_toggle === true) {
                    automatic_request_sent_toggle = false;
                    break;
                }

                // Add request to verifiers
                addInfoFromTestButton();

                // Display the node information data to the table
                setTimeout(function() {
                    // Display the node information data to the table
                    displayNodeInfoToTable(zerosim.simulations[i]);

                    // Display colors on display graph
                    displayNodeInfoToGraph(zerosim.simulations[i]);
                }, 1000 * i);

            }
            automatic_request_sent_toggle = false;
        }

    };

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

/**
 * Display node information to table
 * @param {Object} simulation_params Object that includes all of the simulation parameters.
 */
function displayNodeInfoToTable( simulation_params ) {

    // Display nodes chosen from both verifiers
    text.table.node_i.html("Node i = " + simulation_params.characters.verifiers.automated_v1.request.selected_edge[0]);
    text.table.node_j.html("Node j = " + simulation_params.characters.verifiers.automated_v1.request.selected_edge[1]);
    text.table.node_ip.html("Node i' = " + simulation_params.characters.verifiers.automated_v2.request.selected_edge[0]);
    text.table.node_jp.html("Node j' = " + simulation_params.characters.verifiers.automated_v2.request.selected_edge[1]);

    // Display randomness values for automated_verifier_2
    text.table.node_i_r.html("r = " + simulation_params.characters.verifiers.automated_v1.request.edge_randomness[0]);
    text.table.node_j_s.html("s = " + simulation_params.characters.verifiers.automated_v1.request.edge_randomness[1]);
    text.table.node_ip_r.html("r' = " + simulation_params.characters.verifiers.automated_v2.request.edge_randomness[0]);
    text.table.node_jp_s.html("s' = " + simulation_params.characters.verifiers.automated_v2.request.edge_randomness[1]);

    // Display verifiers accept or decline commit values based on edge-verification and well-definition tests
    if (simulation_params.result.edge_verification_status || simulation_params.result.well_definition_status) {
        text.table.commits.node_i.style('color', 'green');
        text.table.commits.node_j.style('color', 'green');
        text.table.commits.node_ip.style('color', 'green');
        text.table.commits.node_jp.style('color', 'green');
    } else {
        text.table.commits.node_i.style('color', 'red');
        text.table.commits.node_j.style('color', 'red');
        text.table.commits.node_ip.style('color', 'red');
        text.table.commits.node_jp.style('color', 'red');
    }

    // Display commit values
    text.table.commits.node_i.html(simulation_params.characters.provers.automated_p1.commit.node_i);
    text.table.commits.node_j.html(simulation_params.characters.provers.automated_p1.commit.node_j);
    text.table.commits.node_ip.html(simulation_params.characters.provers.automated_p2.commit.node_ip);
    text.table.commits.node_jp.html(simulation_params.characters.provers.automated_p2.commit.node_jp);

}

/**
 * Display node information to graph
 * @param {Object} simulation_params Object that includes all of the simulation parameters.
 */
function displayNodeInfoToGraph( simulation_params ) {

    // Reset the display graph
    displaygraph.resetDisplayGraphProperties();
    displaygraph.resetDisplayGraphCells();

    // Display node color if possible
    let colorings = simulation_params.result.node_colorings;
    if ( colorings ) {
        for (let i = 0; i < colorings.length; i++) {
            let cell = colorings[i][0];
            let color = colorings[i][1];
            displaygraph.revealCellColor(cell, color);
        }
    }
}

/**
 * Method called when case button is clicked prover case button is clicked
 * @param {string} CASE Case type, one of: "HONEST-CASE" | "DISHONEST-CASE"
 */
function caseButtonClicked( CASE ) {

    switch ( CASE ) {

        case "HONEST-CASE":

            zerosim.simulation_case = "HONEST-CASE";
            zerosim.removeDishonestEdgeSTAR();
            displaygraph.removeDishonestEdgeSTAR();
            console.log("HONEST PROVER CASE");
            break;

        case "DISHONEST-CASE":

            zerosim.simulation_case = "DISHONEST-CASE";
            zerosim.addDishonestEdgeSTAR();
            displaygraph.addDishonestEdgeSTAR();
            console.log("DISHONEST PROVER CASE");
            break;

        default:

            console.log("Pick a case!");
            alert("Please pick a case!");
    }
}

/**
 * Function called when mode button is clicked.
 * @param {string} MODE Mode type, one of: "REGULAR-MODE" | "AUTOMATIC-MODE"
 */
function modeButtonClicked( MODE ) {

    switch ( MODE ) {

        case "REGULAR-MODE":

            zerosim.simulation_mode = "REGULAR-MODE";
            console.log("REGULAR-MODE");
            break;

        case "AUTOMATIC-MODE":

            zerosim.simulation_mode = "AUTOMATIC-MODE";
            console.log("AUTOMATIC MODE");

            // Run the simulation
            zerosim.runAutomaticSimulation(iterations);
            console.log(zerosim.simulations);

            // Change the automatic request toggle
            automatic_request_sent_toggle = true;

            break;

        default:

            console.log("Mode error!");
            alert("Mode error!");
    }
}

/**
 * Method called when one of the three test buttons are clicked.
 * @param {String} TEST Test type, one of: "REQUEST" | "FORCED-EDGE-VERIFICATION" | "FORCED-WELL-DEFINITION"
 */
function testButtonClicked( TEST ) {

    // Check if and edge has been selected
    if (displaygraph.selected_cells.length === 0) {
        console.log("Please select and edge!");
        alert("Please select and edge!");
    } else {

        // Get the user request information
        let user_selected_request = {
            edge: Simulation.sort_ascending(displaygraph.selected_cells_id),
            edge_randomness: [parseInt(buttons.user_select.node_i_r.value()), parseInt(buttons.user_select.node_j_s.value())]
        };

        // Run the simulation
        zerosim.runSingleSimulation(TEST, user_selected_request);
        console.log(zerosim.simulation_params);

        // Change the request toggle
        request_sent_toggle = true;

    }

}

/**
 * Method to reveal the graph 3 coloring when show_3col button is clicked.
 */
function show3Col() {

    // Display node colors
    if (zerosim.simulation_params.coloring !== null) {
        for (let i = 0; i < zerosim.simulation_params.coloring.length; i++) {
            let cell = i;
            let color = zerosim.simulation_params.graph_colors[zerosim.simulation_params.coloring[i]];
            displaygraph.revealCellColor(cell, color);
        }
    } else {
        console.log("Send a request first!");
        alert("Send a request first!");
    }

}

/**
 * Generate and emit Information from Character instance when clicking on one of the test buttons.
 */
function addInfoFromTestButton() {
    v1.addSingleInformationFromUser(generateInformation(v1));
    v2.addSingleInformationFromUser(generateInformation(v2));
}

/**
 * Generate some dummy RequestInfo instances.
 * @param   {Character}   character
 * @param   {String}      color
 * @returns {RequestInfo}
 */
function generateInformation(character) {
    return new RequestInfo(user_request_name, Math.random(), [Math.random(), Math.random(), Math.random(), Math.random()], character.getCenterX(), character.getCenterY(), info_diam, info_speed, character.getColor(), simulation);
}

/**
 * Reset the simulation.
 */
function resetSimulation() {
    simulation.noLoop();
    for(let i in characters) {

        let char = characters[i];

        // Reset the position.
        char.setCenterX(char.getInitCenterX());
        char.setCenterY(char.getInitCenterY());

        // Reset the information.
        char.resetQueuedInformation();
        char.resetDisplayedInformation();
    }

    simulation.loop();
    sim_reset_toggle = true;
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

