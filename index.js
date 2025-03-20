import { Timer } from './timer.js';
import { initGame } from './ui.js';
import { initMaze, initBall, setupCollision } from './maze.js';


document.addEventListener('DOMContentLoaded', () => {
    Timer.initDisplay();
    initGame();
    initMaze();
    initBall();
    setupCollision();
});