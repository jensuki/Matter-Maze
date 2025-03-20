import { initMaze, initBall, setupCollision } from './maze.js';
import { Timer } from './timer.js';

document.addEventListener('DOMContentLoaded', () => {
    initMaze();
    initBall();
    setupCollision();
});