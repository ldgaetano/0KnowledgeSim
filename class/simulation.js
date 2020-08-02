class Simulation {

    simulation_params = null;

    /**
     * Constructor for Zero-Knowledge Simulation instance.
     * @param {string}       name
     * @param {number}       id
     * @param {Object}       graph
     * @param {string[]}     colors
     */
    constructor(name, id, graph, colors) {
        this.simulation_params = {
            sim_name: name,
            sim_id: id,
            characters: {
                verifiers: {
                    automated_v1: {
                        request: {
                            selected_edge: [],
                            node_i_r: null,
                            node_j_r: null,
                        }
                    },
                    automated_v2: {
                        request: {
                            selected_edge: [],
                            node_i_r: null,
                            node_j_r: null,
                        }
                    },
                    user_verifier: {
                        request: {
                            previous_selected_edge: [],
                            selected_edge: [],
                            node_i_r: null,
                            node_j_r: null,
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
                            node_i: null,
                            node_j: null
                        }
                    },
                    user_prover: {
                        commit: {
                            node_i: null,
                            node_j: null
                        }
                    }
                }
            },
            graph: graph,
            adj_matrix: Simulation.computeAdjacencyList(this.simulation_params.graph),
            graph_colors: colors,
            three_col_perms: Simulation.generate3ColPerms(this.simulation_params.graph),
            coloring: null,
            b: Simulation.generateBValues(this.simulation_params.graph),
            verifier_result: null
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
                // If node index in the array
                if(E[i].includes(V.indexOf(V[j])))
                {
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
        return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is exclusive and the minimum is inclusive
    };

    /**
     * Sort edge in ascending order, in-place.
     * @param {Array} array
     * @returns {Array}
     */
    static sort_ascending(array) {
        for(let i = 0; i <= Math.floor(array.length - 2 / 2); i++) {
            let temp = array[i];
            array[i] = arr[array.length - 1 - i];
            array[array.length - 1 - i] = temp;
        }
        return array;
    }

    /**
     * Get value modulo n.
     * @param {number} value
     * @param {number} n
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

        // Alert user if selected edge is not valid.
        if (!this.simulation_params.graph.E.includes(edge)) {
            alert("Pick a valid edge!");
        }

        return this.simulation_params.graph.E.includes(edge);
    }

    /**
     * Get commit value for corresponding vertex and randomness value.
     * @param {number} n Vertex value in graph.
     * @param {number} r Randomness value for corresponding node.
     * @returns {number}
     */
    getCommitValue(n, r) {
        return Simulation.checkModulo(this.simulation_params.b[n]*r + this.simulation_params.coloring[n], 3);
    }

    /**
     * Run one iteration of the simulation.
     * @param {Object} [user_request] Object that includes edge and r_values as parameters.
     */
    runSingleSimulation(user_request) {

        if(!user_request) {
            // Add request to automated verifier_1
            this.simulation_params.characters.verifiers.automated_v1.request.selected_edge = this.simulation_params.graph.E[Simulation.getRandomInt(0, this.simulation_params.graph.E.length-1)];
            this.simulation_params.characters.verifiers.automated_v1.request.node_i_r = Simulation.getRandomInt(1,2);
            this.simulation_params.characters.verifiers.automated_v1.request.node_j_r = Simulation.getRandomInt(1,2);
        } else {
            // Check if edge exists
            if(this.includesEdge(user_request.edge)) {

                // Add user request edge to verifier_1
                this.simulation_params.characters.verifiers.automated_v1.request.selected_edge = user_request.edge;

                // Add user r values to verifier_1
                this.simulation_params.characters.verifiers.automated_v1.request.node_i_r = user_request.r_values[0];
                this.simulation_params.characters.verifiers.automated_v1.request.node_j_r = user_request.r_values[1];
            }
        }

        // Add request to automated verifier_2
        this.simulation_params.characters.verifiers.automated_v2.request.selected_edge = this.simulation_params.graph.E[Simulation.getRandomInt(0, this.simulation_params.graph.E.length-1)];
        this.simulation_params.characters.verifiers.automated_v2.request.node_i_r = Simulation.getRandomInt(1,2);
        this.simulation_params.characters.verifiers.automated_v2.request.node_j_r = Simulation.getRandomInt(1,2);

        // Provers update their pre-agreed coloring
        this.simulation_params.c = this.update3Coloring();

        // Prover generate commit values for each verifier request
        this.simulation_params.characters.provers.automated_p1.commit.node_i = this.getCommitValue(this.simulation_params.characters.verifiers.automated_v1.request.selected_edge[0], this.simulation_params.characters.verifiers.automated_v1.request.node_i_r);
        this.simulation_params.characters.provers.automated_p1.commit.node_j = this.getCommitValue(this.simulation_params.characters.verifiers.automated_v1.request.selected_edge[1], this.simulation_params.characters.verifiers.automated_v1.request.node_j_r);
        this.simulation_params.characters.provers.automated_p2.commit.node_i = this.getCommitValue(this.simulation_params.characters.verifiers.automated_v2.request.selected_edge[0], this.simulation_params.characters.verifiers.automated_v2.request.node_i_r);
        this.simulation_params.characters.provers.automated_p2.commit.node_j = this.getCommitValue(this.simulation_params.characters.verifiers.automated_v2.request.selected_edge[1], this.simulation_params.characters.verifiers.automated_v2.request.node_j_r);

        // Temp variables for verifier nodes
        let i      = this.simulation_params.characters.verifiers.automated_v1.request.selected_edge[0];
        let j      = this.simulation_params.characters.verifiers.automated_v1.request.selected_edge[1];
        let ip     = this.simulation_params.characters.verifiers.automated_v2.request.selected_edge[0];
        let jp     = this.simulation_params.characters.verifiers.automated_v2.request.selected_edge[1];
        let i_r    = this.simulation_params.characters.verifiers.automated_v1.request.node_i_r;
        let j_r    = this.simulation_params.characters.verifiers.automated_v1.request.node_j_r;
        let ip_r   = this.simulation_params.characters.verifiers.automated_v2.request.node_i_r;
        let jp_r   = this.simulation_params.characters.verifiers.automated_v2.request.node_j_r;
        let com_i  = this.simulation_params.characters.provers.automated_p1.commit.node_i;
        let com_j  = this.simulation_params.characters.provers.automated_p1.commit.node_j;
        let com_ip = this.simulation_params.characters.provers.automated_p2.commit.node_i;
        let com_jp = this.simulation_params.characters.provers.automated_p2.commit.node_j;

        // Go through protocol cases
        if(i === ip && j === jp) {
            if (i_r !== ip_r) {
                this.simulation_params.verifier_result = this.simulation_params.graph_colors[this.simulation_params.coloring[i]];
                console.log("Node: " + i);
                console.log("Node_Color: " + this.simulation_params.graph_colors[this.simulation_params.verifier_result]);
            }
            if (j_r != jp_r) {
                this.simulation_params.verifier_result = this.simulation_params.graph_colors[this.simulation_params.coloring[j]];
            }
            if (i_r == ip_r) {
                if(com_i == com_ip){
                    this.simulation_params.verifier_result = "Well definition passed on node i and i'";
                    console.log("Well definition passed on node i and i'");
                }
            }
            if (j_r == jp_r) {
                if(com_j == com_jp){
                    this.simulation_params.verifier_result = "Well definition passed on node j and j'";
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
    }




}
