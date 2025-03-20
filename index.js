import { initMaze, initBall, setupCollision } from './maze.js';

document.addEventListener('DOMContentLoaded', () => {
    initMaze();
    initBall();
    setupCollision();
})