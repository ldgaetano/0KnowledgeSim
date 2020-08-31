class Simulation {

    simulation_params = null;
    simulations;

    /**
     * Constructor for Zero-Knowledge Simulation instance.
     * @param {string}       name
     * @param {number}       id
     * @param {Object}       graph
     * @param {string[]}     colors
     */
    constructor(name, id, graph, colors) {
        this.name = name;
        this.id = id;
        this.simulation_params = {
            characters: {
                verifiers: {
                    automated_v1: {
                        request: {
                            selected_edge: [],
                            edge_randomness: [null, null]
                        }
                    },
                    automated_v2: {
                        request: {
                            selected_edge: [],
                            edge_randomness: [null, null]
                        }
                    }
                },
                provers: {
                    automated_p1: {
                        commit: {
                            node_i: null,
                            node_j: null
                        },
                    },
                    automated_p2: {
                        commit: {
                            node_ip: null,
                            node_jp: null
                        }
                    }
                }
            },
            graph: graph,
            adj_matrix: Simulation.computeAdjacencyList(graph),
            graph_colors: colors,
            three_col_perms: Simulation.generate3ColPerms(graph),
            coloring: null,
            b: Simulation.generateBValues(graph),
            result: {
                node_colorings: [],             // [[node, color]] : [[number, string]]
                edge_verification_status: false,
                well_definition_status: false
            }
        }
    }

    /**
     * Generate the adjacency list for the given input graph.
     * @param   {Object}          graph
     * @returns {Array<number[]>}
     */
    static computeAdjacencyList(graph) {

        let adj_list = [];
        let E = graph.E;
        let V = graph.V;

        // Find the adjacency list
        for (let j=0; j< V.length; j++) {

            let neighbours = [];
            let ind = 0; // Initialise an index at 0

            for (let i = 0; i < E.length; i++){

                // If node index is in the array
                if(E[i].includes(V.indexOf(V[j]))) {

                    ind = graph.E[i].indexOf(V.indexOf(V[j]));
                    ind = 1-ind;
                    neighbours.push(E[i][ind]);
                }
            }

            adj_list.push(neighbours);
        }

        return adj_list;
    }

    /**
     * Generate random integer between min and max.
     * @param   {number} min Inclusive minimum.
     * @param   {number} max Exclusive maximum.
     * @returns {number}
     */
    static getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min; // The maximum is exclusive and the minimum is inclusive
    };

    /**
     * Sort edge in ascending order, in-place.
     * @param   {Array} array
     * @returns {Array}
     */
    static sort_ascending(array) {

        if (array[0] < array[1]) {
            return array;
        }

        for(let i = 0; i < Math.floor(array.length - 2 / 2); i++) {
            let temp = array[i];
            array[i] = array[array.length - 1 - i];
            array[array.length - 1 - i] = temp;
        }
        return array;
    }

    /**
     * Get value modulo n.
     * @param   {number} value
     * @param   {number} n
     * @returns {number}
     */
    static checkModulo(value, n) {
        return value % n;
    }

    /**
     * Generate the relevant permutations of the graph 3-coloring.
     * @param   {Object}          graph
     * @returns {Array<number[]>}
     */
    static generate3ColPerms(graph) {
        let perms = [];
        let V = graph.V;
        let adj_matrix = Simulation.computeAdjacencyList(graph);
        let color = Array(V.length);
        color.fill(-1);

        // Three coloring algorithm using backtracking
        function threeColoring(node) {
            if (node === V.length) {
                perms.push([...color]);
                return;
            }

            let availableCol = [true, true, true];
            for(let i = 0; i < adj_matrix[node].length; i++)
                if (color[adj_matrix[node][i]] !== -1)
                    availableCol[color[adj_matrix[node][i]]] = false;

            for (let i = 0; i < 3; ++i) {
                if (availableCol[i]) {
                    color[node] = i;
                    threeColoring(node + 1);
                }
            }

            color[node] = -1;
        }

        threeColoring(0);
        return [perms[0], perms[1], perms[8], perms[9], perms[16], perms[17]];
    }

    /**
     * Generate the b values that all provers initially agree on.
     * @param   {Object}   graph
     * @returns {number[]}
     */
    static generateBValues(graph) {
        let b = [];
        for (let i = 0; i< graph.V.length; i++){
            b.push(Simulation.getRandomInt(0,2));
        }
        return b;
    }

    /**
     * Obtain new coloring for the graph - operation done by any of the provers during one round of the simulation.
     * @returns {number[]}
     */
    update3Coloring() {
        if(this.simulation_params.three_col_perms != null) {
            return this.simulation_params.three_col_perms[Simulation.getRandomInt(0, this.simulation_params.three_col_perms.length-1)];
        }
    }

    /**
     * Check if selected edge exists.
     */
    includesEdge(edge) {
        return Simulation.includesArray(this.simulation_params.graph.E, edge);
    }

    /**
     * Get commit value for corresponding vertex and randomness value.
     * @param   {number} n Vertex value in graph.
     * @param   {number} r Randomness value for corresponding node.
     * @returns {number}
     */
    generateCommitValue(n, r) {
        return Simulation.checkModulo(this.simulation_params.b[n]*r + this.simulation_params.coloring[n], 3);
    }

    /**
     * Get node color.
     * @param {number} node
     * @returns {string}
     */
    getNodeColor(node) {
        return this.simulation_params.graph_colors[this.simulation_params.coloring[node]];
    }

    /**
     * Get the intersecting node of two edges.
     * @param   {number[]}             edge1
     * @param   {number[]}             edge2
     * @returns {number|number[]|null}
     */
    static checkIntersection(edge1, edge2) {

        if (Simulation.arraysEqual(edge1, edge2)) {
            return edge1;
        }

        if (!Simulation.arraysEqual(edge1, edge2)) {
            edge1.forEach(node => {
                if (Simulation.includesArray(edge2, node)) {
                    return node;
                }
            });
        } else {
            return null;
        }
    }

    /**
     * Check randomness difference.
     * @param   {number[]} random1
     * @param   {number[]} random2
     * @returns {boolean}          Returns true if difference exists.
     */
    static checkRandomnessDifference(random1, random2) {
        return (random1[0] !== random2[0]) && (random1[1] !== random2[1]);
    }

    /**
     * Check if Object[] includes Object
     * @param   {Object[]} haystack
     * @param   {Object}   needle
     * @returns {boolean}
     */
    static includesArray(haystack, needle){

        let i, j, current;

        for(i = 0; i < haystack.length; ++i){

            if(needle.length === haystack[i].length){

                current = haystack[i];

                for(j = 0; j < needle.length && needle[j] === current[j]; ++j) {

                    if((j+1) === needle.length) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    /**
     * Get index of Array
     * @param   {Object[]} haystack
     * @param   {Object}   needle
     * @returns {number}
     */
    static indexOfArray(haystack, needle){
        let i, j, current;
        for(i = 0; i < haystack.length; ++i){
            if(needle.length === haystack[i].length){
                current = haystack[i];
                for(j = 0; j < needle.length && needle[j] === current[j]; j++) {
                    if((j+1) === needle.length) {
                        return i;
                    }
                }
            }
        }
        return -1;
    }

    /**
     * Check if two arrays contain the same elements
     * @param   {Object}  a1
     * @param   {Object}  a2
     * @returns {boolean}
     */
    static arraysEqual(a1, a2) {

        // Check length
        if (a1.length !== a2.length) {
            return false;
        }

        // Check contents
        for (let i = 0; i < a1.length; i++) {

            if (a1[i] !== a2[i]) {
                return false;
            }
        }

        // Otherwise equal
        return true;
    }

    /**
     * Check for the Edge Verification Test
     * @param   {number[]}  edge1
     * @param   {number[]}  edge2
     * @param   {number[]}  edge1_randomness
     * @param   {number[]}  edge2_randomness
     * @param   {number[]}  edge1_commits
     * @param   {number[]}  edge2_commits
     * @returns {boolean}
     */
    testEdgeVerification(edge1, edge2, edge1_randomness, edge2_randomness, edge1_commits, edge2_commits) {

        if ((Simulation.arraysEqual(edge1, edge2)) && (Simulation.checkRandomnessDifference(edge1_randomness, edge2_randomness))) {

            return (edge1_commits[0] + edge1_commits[1]) !== (edge2_commits[0] + edge2_commits[1])

        } else {

            return false;

        }
    }

    /**
     * Check for the Well Definition Test
     * @param   {number[]}  edge1
     * @param   {number[]}  edge2
     * @param   {number[]}  edge1_randomness
     * @param   {number[]}  edge2_randomness
     * @param   {number[]}  edge1_commits
     * @param   {number[]}  edge2_commits
     * @returns {boolean}
     */
    testWellDefinition(edge1, edge2, edge1_randomness, edge2_randomness, edge1_commits, edge2_commits) {

        if ((Simulation.arraysEqual(edge1, edge2)) && (Simulation.arraysEqual(edge1_randomness, edge2_randomness))) {

            return (edge1_commits[0] === edge1_commits[1]) && (edge2_commits[0] === edge2_commits[1]);

        } else if ((Simulation.checkIntersection(edge1, edge2) === edge1[0]) && (edge1_randomness[0] === edge2_randomness[0])) {

            return edge1_commits[0] === edge2_commits[0];

        } else if ((Simulation.checkIntersection(edge1, edge2) === edge1[1]) && (edge1_randomness[1] === edge2_randomness[1])) {

            return edge1_commits[1] === edge2_commits[1];

        } else {

            return false;

        }
    }

    /**
     * Run one iteration of the simulation. Assume input edges are sorted in ascending order.
     * @param {Object} [user_request] Object that includes edge and randomness values as parameters.
     * @param {String} test_case           The case the user has chosen: "REQUEST" | "FORCED-EDGE-VERIFICATION" | "FORCED-WELL-DEFINITION"
     */
    runSingleSimulation(user_request, test_case) {

        if(!user_request) {

            // Add request to automated_verifier_1
            this.simulation_params.characters.verifiers.automated_v1.request.selected_edge = this.simulation_params.graph.E[Simulation.getRandomInt(0, this.simulation_params.graph.E.length-1)];
            this.simulation_params.characters.verifiers.automated_v1.request.edge_randomness = [Simulation.getRandomInt(1,2), Simulation.getRandomInt(1,2)];

        } else {

            // Check if edge exists
            if(this.includesEdge(user_request.edge)) {

                // Add user request edge to verifier_1
                this.simulation_params.characters.verifiers.automated_v1.request.selected_edge = user_request.edge;

                // Add user r values to verifier_1
                this.simulation_params.characters.verifiers.automated_v1.request.edge_randomness = user_request.edge_randomness;

            } else {

                alert("Please pick a valid edge!");

            }
        }

        switch (test_case) {

            case "REQUEST":

                console.log("TEST-CASE: REQUEST");

                // Add request to automated_verifier_2
                this.simulation_params.characters.verifiers.automated_v2.request.selected_edge = this.simulation_params.graph.E[Simulation.getRandomInt(0, this.simulation_params.graph.E.length-1)];
                this.simulation_params.characters.verifiers.automated_v2.request.edge_randomness = [Simulation.getRandomInt(1,2), Simulation.getRandomInt(1,2)];

                // Provers update their pre-agreed coloring
                this.simulation_params.coloring = this.update3Coloring();

                // Provers generate commit values for each verifier request
                this.simulation_params.characters.provers.automated_p1.commit.node_i = this.generateCommitValue(this.simulation_params.characters.verifiers.automated_v1.request.selected_edge[0], this.simulation_params.characters.verifiers.automated_v1.request.edge_randomness[0]);
                this.simulation_params.characters.provers.automated_p1.commit.node_j = this.generateCommitValue(this.simulation_params.characters.verifiers.automated_v1.request.selected_edge[1], this.simulation_params.characters.verifiers.automated_v1.request.edge_randomness[1]);
                this.simulation_params.characters.provers.automated_p2.commit.node_ip = this.generateCommitValue(this.simulation_params.characters.verifiers.automated_v2.request.selected_edge[0], this.simulation_params.characters.verifiers.automated_v2.request.edge_randomness[0]);
                this.simulation_params.characters.provers.automated_p2.commit.node_jp = this.generateCommitValue(this.simulation_params.characters.verifiers.automated_v2.request.selected_edge[1], this.simulation_params.characters.verifiers.automated_v2.request.edge_randomness[1]);

                // Temp variables for verifier nodes
                let i      = this.simulation_params.characters.verifiers.automated_v1.request.selected_edge[0];
                let j      = this.simulation_params.characters.verifiers.automated_v1.request.selected_edge[1];
                let ip     = this.simulation_params.characters.verifiers.automated_v2.request.selected_edge[0];
                let jp     = this.simulation_params.characters.verifiers.automated_v2.request.selected_edge[1];
                let i_r    = this.simulation_params.characters.verifiers.automated_v1.request.edge_randomness[0];
                let j_s    = this.simulation_params.characters.verifiers.automated_v1.request.edge_randomness[1];
                let ip_r   = this.simulation_params.characters.verifiers.automated_v2.request.edge_randomness[0];
                let jp_s   = this.simulation_params.characters.verifiers.automated_v2.request.edge_randomness[1];
                let com_i  = this.simulation_params.characters.provers.automated_p1.commit.node_i;
                let com_j  = this.simulation_params.characters.provers.automated_p1.commit.node_j;
                let com_ip = this.simulation_params.characters.provers.automated_p2.commit.node_ip;
                let com_jp = this.simulation_params.characters.provers.automated_p2.commit.node_jp;

                // Go through protocol cases and output result
                if (this.testEdgeVerification([i, j], [ip, jp], [i_r, j_s], [ip_r, jp_s], [com_i, com_j], [com_ip, com_jp])) {

                    this.simulation_params.result.node_colorings = [[i, this.getNodeColor(i)], [j, this.getNodeColor(j)]];
                    this.simulation_params.result.edge_verification_status = true;
                    this.simulation_params.result.well_definition_status = false;

                } else if (this.testWellDefinition([i, j], [ip, jp], [i_r, j_s], [ip_r, jp_s], [com_i, com_j], [com_ip, com_jp])) {

                    this.simulation_params.result.edge_verification_status = false;
                    this.simulation_params.result.well_definition_status = true;

                } else if ((Simulation.checkIntersection([i, j], [ip, jp]) === i) && (i_r !== ip_r)) {

                    this.simulation_params.result.edge_verification_status = false;
                    this.simulation_params.result.well_definition_status = false;
                    this.simulation_params.result.node_colorings = [i, this.getNodeColor(i)];

                } else if ((Simulation.checkIntersection([i, j], [ip, jp]) === j) && (j_s !== jp_s)) {

                    this.simulation_params.result.edge_verification_status = false;
                    this.simulation_params.result.well_definition_status = false;
                    this.simulation_params.result.node_colorings = [j, this.getNodeColor(j)];

                } else {

                    this.simulation_params.result.edge_verification_status = false;
                    this.simulation_params.result.well_definition_status = false;
                    this.simulation_params.result.node_colorings = null;

                }

                break;

            case "FORCED-EDGE-VERIFICATION":

                console.log("TEST-CASE: FORCED-EDGE-VERIFICATION");

                // Provide the same edge to automated_verifier_2
                this.simulation_params.characters.verifiers.automated_v2.request.selected_edge = user_request.edge;

                // Force randomness values for automated_verifier_2
                if (user_request.edge_randomness[0] === user_request.edge_randomness[1]) {

                    this.simulation_params.characters.verifiers.automated_v2.request.edge_randomness[0] = 3 - user_request.edge_randomness[0];
                    this.simulation_params.characters.verifiers.automated_v2.request.edge_randomness[1] = this.simulation_params.characters.verifiers.automated_v2.request.edge_randomness[0];

                } else {

                    this.simulation_params.characters.verifiers.automated_v2.request.edge_randomness[0] = user_request.edge_randomness[1];
                    this.simulation_params.characters.verifiers.automated_v2.request.edge_randomness[1] = user_request.edge_randomness[0];

                }

                // Provers update their pre-agreed coloring
                this.simulation_params.coloring = this.update3Coloring();

                // Provers generate commit values for each verifier request
                this.simulation_params.characters.provers.automated_p1.commit.node_i = this.generateCommitValue(this.simulation_params.characters.verifiers.automated_v1.request.selected_edge[0], this.simulation_params.characters.verifiers.automated_v1.request.edge_randomness[0]);
                this.simulation_params.characters.provers.automated_p1.commit.node_j = this.generateCommitValue(this.simulation_params.characters.verifiers.automated_v1.request.selected_edge[1], this.simulation_params.characters.verifiers.automated_v1.request.edge_randomness[1]);
                this.simulation_params.characters.provers.automated_p2.commit.node_ip = this.generateCommitValue(this.simulation_params.characters.verifiers.automated_v2.request.selected_edge[0], this.simulation_params.characters.verifiers.automated_v2.request.edge_randomness[0]);
                this.simulation_params.characters.provers.automated_p2.commit.node_jp = this.generateCommitValue(this.simulation_params.characters.verifiers.automated_v2.request.selected_edge[1], this.simulation_params.characters.verifiers.automated_v2.request.edge_randomness[1]);

                // Temp variables
                let i_FEV = this.simulation_params.characters.verifiers.automated_v1.request.selected_edge[0];
                let j_FEV = this.simulation_params.characters.verifiers.automated_v1.request.selected_edge[1];

                // Output result
                this.simulation_params.result.node_colorings = [[i_FEV, this.getNodeColor(i_FEV)], [j_FEV, this.getNodeColor(j_FEV)]];
                this.simulation_params.result.edge_verification_status = true;
                this.simulation_params.result.well_definition_status = false;

                break;

            case "FORCED-WELL-DEFINITION":

                console.log("TEST-CASE: FORCED-WELL-DEFINITION");
                break;

            default:

                console.log("No valid test-case chosen");
                alert("Please choose a valid test-case!");
        }


    }

    /**
     * Run multiple iterations of the simulation.
     * @param  {number} iterations
     * @return {Object}
     */
    runAutomaticSimulation(iterations) {
        let simulations = [];
        for(let i = 0; i < iterations; i++) {
            this.runSingleSimulation();
            simulations.push(this.simulation_params);
        }
        return simulations;
    }

}
