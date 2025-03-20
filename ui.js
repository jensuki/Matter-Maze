import { Timer } from './timer.js';
const { Body, Engine } = Matter;
import { ball, engine } from './maze.js';

const showInstructions = () => {
    // only display instructions if users first time playing
    if (!localStorage.getItem('hasPlayed')) {
        const instructions = document.createElement('p');
        instructions.classList.add('game-instructions');
        instructions.textContent = 'Use arrow keys to move';
        document.body.appendChild(instructions);

        setTimeout(() => {
            instructions.remove();
            localStorage.setItem('hasPlayed', 'true');
        }, 1500);
    }
}

const initGame = () => {
    const startBtn = document.querySelector('.start-btn');

    showInstructions();

    startBtn.addEventListener('click', () => {
        startBtn.classList.add('hidden');
        Timer.start();

        Body.setVelocity(ball, { x: 0, y: 0 });
        Engine.update(engine); // force an immediate physics update

        // enable movement after ensuring collision detection is active
        Body.setStatic(ball, false);
    });

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