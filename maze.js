import { Timer } from './timer.js';
import { showWinMsg } from './ui.js';

const {
    Engine,
    Render,
    Runner,
    World,
    Bodies,
    Body, // for velocity
    Events
} = Matter;

const cellsHorizontal = 20; // # of columns
const cellsVertical = 15; // # of rows

// score container + dynamic screen dimensions
const uiBarHeight = 50;
const width = window.innerWidth;
const height = window.innerHeight - uiBarHeight;

// each cell unit
const unitLengthX = width / cellsHorizontal;
const unitLengthY = height / cellsVertical;

////////////////////////////////////////////////////////

// create new engine
const engine = Engine.create();
engine.world.gravity.y = 0;
const { world } = engine;

// create renderer to visualize world
const render = Render.create({
    element: document.body, // attach canvas to body
    engine: engine, // connect engine to the renderer
    options: {
        wireframes: false,
        width, // width of canvas
        height, // height of canvas

    }
});

// start rendering display simulation
Render.run(render);
Runner.run(Runner.create(), engine);

// outer bordering walls
const outerWalls = [
    Bodies.rectangle(width / 2, 0, width, 10, { isStatic: true }),
    Bodies.rectangle(width, height / 2, 10, height, { isStatic: true }),
    Bodies.rectangle(width / 2, height, width, 10, { isStatic: true }),
    Bodies.rectangle(0, height / 2, 10, height, { isStatic: true })
];
World.add(world, outerWalls);

// 2D GRID arrays (each cell intially 'unvisited' = false)
const grid = Array(cellsVertical).fill(null).map(() => Array(cellsHorizontal).fill(false));

// horizontal + vertical array (initally all 'false')
const verticals = Array(cellsVertical).fill(null).map(() => Array(cellsHorizontal - 1).fill(false));
const horizontals = Array(cellsVertical - 1).fill(null).map(() => Array(cellsHorizontal).fill(false));

// shuffle for random path generation
const shuffle = arr => {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        // swap
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
};

/**
 * recursive maze generation using DFS
 * - randomly selected neighboring cell
 * - removes walls between visited cells
 */

// random starting cell row and column
const startRow = Math.floor(Math.random() * cellsVertical);
const startCol = Math.floor(Math.random() * cellsHorizontal);

const stepThroughCell = (row, column) => {

    // if current cell already visited, stop and mark as visited
    if (grid[row][column]) return;
    grid[row][column] = true;

    // randomly order the 4 possible movement directions
    const neighbors = shuffle([
        [row - 1, column, 'up'],
        [row, column + 1, 'right'],
        [row + 1, column, 'down'],
        [row, column - 1, 'left']
    ]);

    // loop through neighbors
    for (let [nextRow, nextCol, direction] of neighbors) {

        // if neighbor is out of bounds or already visited, continue
        if (nextRow < 0
            || nextRow >= cellsVertical
            || nextCol < 0
            || nextCol >= cellsHorizontal) continue;

        if (grid[nextRow][nextCol]) continue;

        // remove wall from horizontal or vertical neighbor depending on where we go
        if (direction === 'up') horizontals[row - 1][column] = true;
        else if (direction === 'right') verticals[row][column] = true;
        else if (direction === 'down') horizontals[row][column] = true;
        else if (direction === 'left') verticals[row][column - 1] = true;

        stepThroughCell(nextRow, nextCol);
    };
};


stepThroughCell(startRow, startCol); // start maze generation


/**
 * intialize and build the maze structure
 * - recursively call stepThroughCell() to generate maze
 * - draw vertical + horizontal walls on the canvas based on maze data
 */

const initMaze = () => {

    // draw horizontal walls
    horizontals.forEach((row, rowIndex) => {
        row.forEach((open, columnIndex) => {
            if (!open) { // if path is blocked(false), create wall
                World.add(world, Bodies.rectangle(
                    columnIndex * unitLengthX + unitLengthX / 2, // center x coordinate
                    rowIndex * unitLengthY + unitLengthY, // bottom y coordinate
                    unitLengthX, 5, {
                    label: 'wall',
                    isStatic: true,
                    render: {
                        fillStyle: '#37374F'
                    }
                }
                ));
            }
        });
    });

    // draw vertical walls
    verticals.forEach((row, rowIndex) => {
        row.forEach((open, columnIndex) => {
            if (!open) { // if path is blocked(false), create wall
                World.add(world, Bodies.rectangle(
                    columnIndex * unitLengthX + unitLengthX, // right side of current cell (x coordinate)
                    rowIndex * unitLengthY + unitLengthY / 2, // middle of y coordinate
                    5, unitLengthY, {
                    label: 'wall',
                    isStatic: true,
                    render: {
                        fillStyle: '#37374F'
                    }
                }
                ));
            }
        });
    });

    // draw goal
    World.add(world, Bodies.rectangle(
        width - unitLengthX / 2,
        height - unitLengthY / 2,
        unitLengthX * .7, unitLengthY * .7, {
        label: 'goal',
        isStatic: true,
        render: {
            fillStyle: '#37374F'
        }
    }
    ));
};

// ball (player) setup
const ballRadius = Math.min(unitLengthX, unitLengthY) / 3;
const ballSize = 276;
const buffer = 2;
let ball;

const initBall = () => {
    ball = Bodies.circle(
        unitLengthX / 2 - buffer, unitLengthY / 2 - buffer, ballRadius, {
        label: 'ball',
        isStatic: true,
        restitution: 0,
        render: {
            sprite: {
                texture: 'assets/maze_sphere.png',
                xScale: (ballRadius * 2) / ballSize,
                yScale: (ballRadius * 2) / ballSize
            }
        }
    });
    World.add(world, ball);
}

// handle ball movement
document.addEventListener('keydown', (e) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        e.preventDefault(); // prevent page scrolling
    }
    const maxSpeed = 4.5;
    let velocity = { x: 0, y: 0 };

    if (e.code === 'ArrowUp') velocity = { x: 0, y: -maxSpeed };
    if (e.code === 'ArrowRight') velocity = { x: maxSpeed, y: 0 };
    if (e.code === 'ArrowDown') velocity = { x: 0, y: maxSpeed };
    if (e.code === 'ArrowLeft') velocity = { x: -maxSpeed, y: 0 };

    Body.setVelocity(ball, velocity);
});

// handle collision events (for winning condition)

let gameOver = false;

const setupCollision = () => {
    Events.on(engine, 'collisionStart', (event) => {
        event.pairs.forEach(({ bodyA, bodyB }) => {
            const labels = ['ball', 'goal'];
            if (labels.includes(bodyA.label) && labels.includes(bodyB.label)) {
                // goal!
                world.gravity.y = .8;
                if (gameOver) return;
                gameOver = true;

                // stop timer
                const timeTaken = Timer.stop();
                showWinMsg(timeTaken)
                world.bodies.forEach(body => {
                    if (body.label === 'wall') Body.setStatic(body, false);
                })
            }
        })
    })
}


export { ball, engine, initMaze, initBall, setupCollision };