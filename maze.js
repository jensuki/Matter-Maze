const {
    Engine,
    Render,
    Runner,
    World,
    Bodies,
    Body, // for velocity
    Events
} = Matter;

// space alotted for score container
const uiBarHeight = 50;

const cellsHorizontal = 5; // # of columns
const cellsVertical = 5; // # of rows

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

// create renderer for visual simulation
const render = Render.create({
    element: document.body, // attach to main document page
    engine: engine, // link engine to the renderer
    options: {
        width, // width of canvas
        height // height of canvas
    }
});

// run renderer to display simulation
Render.run(render);
// create runner using engine
Runner.run(Runner.create(), engine);
