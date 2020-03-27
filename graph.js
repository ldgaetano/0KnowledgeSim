const cells = [];
const connections = [];

// Create cells
const cell1 = new Cell(1, 100, 400);
const cell2 = new Cell(2, 100, 300);
const cell3 = new Cell(3, 200, 300);
const cell4 = new Cell(4, 200, 400);
const cell5 = new Cell(5, 300, 300);
const cell6 = new Cell(6, 300, 200);

// Add cells to cells list
cells.push(cell1);
cells.push(cell2);
cells.push(cell3);
cells.push(cell4);
cells.push(cell5);
cells.push(cell6);

// Create connections between cells
const c1 = new Connection(cell1, cell2);
const c2 = new Connection(cell2, cell3);
const c3 = new Connection(cell3, cell4);
const c4 = new Connection(cell1, cell4);
const c5 = new Connection(cell4, cell5);
const c6 = new Connection(cell3, cell5);
const c7 = new Connection(cell5, cell6);

// Add connections to connections list
connections.push(c1);
connections.push(c2);
connections.push(c3);
connections.push(c4);
connections.push(c5);
connections.push(c6);
connections.push(c7);

export function getCells() {
    return cells;
}

export function getConnections() {
    return connections;
}