import { Timer } from './timer.js';
const { Body } = Matter;
import { ball } from './maze.js';

const initGame = () => {
    const startBtn = document.querySelector('.start-btn');

    startBtn.addEventListener('click', () => {
        startBtn.classList.add('hidden');

        Timer.start();

        // reset any velocity captured before click event
        Body.setVelocity(ball, { x: 0, y: 0 });
        // enable movement as soon as timer starts
        Body.setStatic(ball, false);
        // startBtn.remove();
    });

    // load new game to browser dimensions
    window.addEventListener('resize', () => location.reload());
};

// display win message + replay button
const showWinMsg = (timeTaken) => {
    const winnerMsg = document.querySelector('.winner');
    winnerMsg.innerHTML = `<h1>Finished in ${Timer.formatTime(timeTaken)}</h1>`;
    winnerMsg.classList.remove('hidden'); // reveal message

    // add replay button
    setTimeout(() => {
        const replayBtn = document.createElement('button');
        replayBtn.textContent = 'Play Again';
        replayBtn.classList.add('replay');

        winnerMsg.appendChild(replayBtn);

        // reload game
        replayBtn.addEventListener('click', () => {
            location.reload();
        })
    }, 1500);
};

export { initGame, showWinMsg };