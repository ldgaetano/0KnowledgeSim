class DisplayGraph {

    display_graph = null;     // Object containing the Cell and Connection instances representing the input graph.
    previous_cells = null;    // Array containing Cell instances of the previously selected cells.
    selected_cells = null;    // Array containing Cell instances the selected cells.
    selected_cells_id = null; // Array containing ids of the selected cells.
    requestSelected;          // Flag to keep track if a request has been selected.

    /**
     * Constructor for DisplayGraph instance.
     * @param {string} name
     * @param {number} id
     * @param {string} type
     * @param {number} origin_x
     * @param {number} origin_y
     * @param {number} x_step
     * @param {number} y_step
     * @param {Object} graph
     * @param {Object} graph_colors
     */
    constructor(name, id, type, origin_x, origin_y, x_step, y_step, graph, graph_colors) {
        this.name = name;
        this.id = id;
        this.graph = graph;
        this.graph_colors = graph_colors;
        this.display_graph = DisplayGraph.generateDisplayGraphInfo(type, origin_x, origin_y, x_step, y_step, graph);
        this.previous_cells = [];
        this.selected_cells = [];
        this.selected_cells_id = [];
        this.requestSelected = false;
    }

    /**
     * Generate graph based on type available.
     * @param   {string} type
     * @param   {number} origin_x
     * @param   {number} origin_y
     * @param   {number} x_step
     * @param   {number} y_step
     * @param   {Object} graph
     * @returns {Object}
     */
    static generateDisplayGraphInfo(type, origin_x, origin_y, x_step, y_step, graph) {
        switch (type) {
            case "Star":
                return DisplayGraph.generateStarGraphInfo(origin_x, origin_y, x_step, y_step, graph);

            default:
                return DisplayGraph.generateStarGraphInfo(origin_x, origin_y, x_step, y_step, graph);
        }
    }

    /**
     * Generate the Star graph.
     * @param   {number} origin_x
     * @param   {number} origin_y
     * @param   {number} x_step
     * @param   {number} y_step
     * @param   {Object} graph
     * @returns {Object}
     */
    static generateStarGraphInfo(origin_x, origin_y, x_step, y_step, graph) {

        // Temp arrays
        let cells = [];
        let connections = [];
        let E = graph.E;
        let V = graph.V;

        // Create cells
        let cell_1 = new Cell(0, origin_x, origin_y);
        let cell_2 = new Cell(1, origin_x + x_step, origin_y - 3*y_step);
        let cell_3 = new Cell(2, origin_x + 3*x_step, origin_y - 3*y_step);
        let cell_4 = new Cell(3, origin_x + 4*x_step, origin_y);
        let cell_5 = new Cell(4, origin_x + 3*x_step, origin_y + 3*y_step);
        let cell_6 = new Cell(5, origin_x + x_step, origin_y + 3*y_step);
        let cell_7 = new Cell(6, origin_x + x_step, origin_y + y_step);
        let cell_8 = new Cell(7, origin_x + x_step, origin_y - y_step);
        let cell_9 = new Cell(8, origin_x + 2*x_step, origin_y - 2*y_step);
        let cell_10 = new Cell(9, origin_x + 3*x_step, origin_y - y_step);
        let cell_11 = new Cell(10, origin_x + 3*x_step, origin_y + y_step);
        let cell_12 = new Cell(11, origin_x + 2*x_step, origin_y + 2*y_step);

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
        let c1 = new Connection(cell_1, cell_7);
        let c2 = new Connection(cell_1, cell_8);
        let c3 = new Connection(cell_8, cell_7);
        let c4 = new Connection(cell_8, cell_2);
        let c5 = new Connection(cell_8, cell_9);
        let c6 = new Connection(cell_2, cell_9);
        let c7 = new Connection(cell_2, cell_5);
        let c8 = new Connection(cell_9, cell_3);
        let c9 = new Connection(cell_9, cell_10);
        let c10 = new Connection(cell_3, cell_10);
        let c11 = new Connection(cell_3, cell_6);
        let c12 = new Connection(cell_10, cell_11);
        let c13 = new Connection(cell_10, cell_4);
        let c14 = new Connection(cell_4, cell_11);
        let c15 = new Connection(cell_11, cell_12);
        let c16 = new Connection(cell_11, cell_5);
        let c17 = new Connection(cell_5, cell_12);
        let c18 = new Connection(cell_12, cell_6);
        let c19 = new Connection(cell_12, cell_7);
        let c20 = new Connection(cell_6, cell_7);

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

        return { cells, connections };
    }

    /**
     * Render the graph on the screen every frame.
     * @param {Object} sketch
     */
    renderDisplayGraph(sketch) {
        if (this.display_graph != null) {
            // Render the connections only
            this.display_graph.connections.forEach(connection => {
                connection.renderConnection(sketch);
            });

            // Change node colour when hovering over it with mouse
            this.display_graph.cells.forEach (cell => {
                if (cell.mouseIsInsideCell(sketch.mouseX, sketch.mouseY, sketch)) {
                    cell.flags.hover = true;
                    if (this.previous_cells.includes(cell)) {
                        cell.flags.hover = true;
                        cell.flags.revealed = false;
                    }
                } else {
                    cell.flags.hover = false;
                    if (this.previous_cells.includes(cell)) {
                        cell.flags.hover = false;
                        cell.flags.revealed = true;
                    }
                }
                cell.renderCell(sketch);
            });
        }
    }

    /**
     * Method to check whether or not a Cell instance is being clicked on in the displayed graph.
     * @param {Object} sketch
     */
    checkCellClicking(sketch) {
        if (this.display_graph != null) {
            this.display_graph.cells.forEach(cell => {
                if (cell.mouseIsInsideCell(sketch.mouseX, sketch.mouseY, sketch)) {
                    // Add Cell to array when clicked
                    // if(this.selected_cells.length > 0 && this.selected_cells.length < 2) {
                    //     this.selected_cells.push(cell);
                    //     this.selected_cells_id.push(cell.id);
                    //     this.selected_cells.forEach(cell => {
                    //        cell.cellSelected();
                    //     });
                    // } else {
                    //     // Empty array if nothing is selected.
                    //     this.selected_cells = [];
                    //     this.selected_cells_id =[];
                    //     this.selected_cells.push(cell);
                    //     this.selected_cells_id.push(cell.id);
                    //     this.selected_cells.forEach(cell => {
                    //         cell.cellSelected();
                    //     });
                    // }
                    // Add Cell to selection array
                        if (this.selected_cells.length < 2) {
                            cell.flags.clicked = true;
                            this.selected_cells.push(cell);
                            this.selected_cells_id.push(cell.id);
                            console.log("Cell Selected:");
                            console.log("--Cell Object: ");
                            console.log(cell);
                        }

                        if (this.selected_cells.length === 2 && !this.selected_cells.includes(cell)) {
                            this.selected_cells.forEach(cell => {
                                cell.flags.clicked = false;
                            });
                            this.selected_cells = [];
                            this.selected_cells_id = [];
                            cell.flags.clicked = true;
                            this.selected_cells.push(cell);
                            this.selected_cells_id.push(cell.id);
                            console.log("Cell Selected:");
                            console.log("--Cell Object: ");
                            console.log(cell);
                        }
                } else {
                    if (!this.selected_cells.includes(cell)) {
                        cell.flags.clicked = false;
                    }
                }
            });
        }
    }

    /**
     * Change the flags of the previously selected cells
     */
    updatePreviousCellsFlags() {
        if (this.previous_cells.length > 0) {
            this.previous_cells.forEach(cell => {
                cell.flags.revealed = false;
                cell.flags.clicked = false;
                cell.flags.hover = false;
                cell.revealCol = 255;
            });
            this.previous_cells = [];
        }
    }

    /**
     * Check if selected edge exists.
     */
    includesEdge() {
        // Sort edge in ascending order, in-place.
        for(let i = 0; i <= Math.floor(this.selected_cells_id.length - 2 / 2); i++) {
            let temp = this.selected_cells_id[i];
            this.selected_cells_id[i] = this.selected_cells_id[this.selected_cells_id.length - 1 - i];
            this.selected_cells[this.selected_cells.length - 1 - i] = temp;
        }

        // Alert user if selected edge is not valid.
        if (!this.graph.E.includes(this.selected_cells_id)) {
            this.selected_cells = [];
            this.selected_cells_id = [];
            alert("Please pick a valid edge!");
        }
    }

    /**
     * Update DisplayedGraph three-coloring and change Cell instance reveal color.
     * @param {Array<number[]>} three_coloring
     */
    updateDisplayedGraph3Coloring(three_coloring) {
        this.display_graph.cells.forEach(cell => {
            cell.setCellColor(this.graph_colors[three_coloring[cell.id]]);
        });
    }
}