import { Timer } from './timer.js';
const { Body, Engine } = Matter;
import { ball, engine } from './maze.js';

const initGame = () => {
    const startBtn = document.querySelector('.start-btn');

    startBtn.addEventListener('click', () => {
        startBtn.classList.add('hidden');
        Timer.start();

        // ✅ Wake up the ball before allowing movement
        Body.setVelocity(ball, { x: 0, y: 0 }); // Tiny movement to trigger physics update
        Engine.update(engine); // Force an immediate physics update

        // ✅ Enable movement after ensuring collision detection is active
        Body.setStatic(ball, false);
    });

    // Reload game on window resize
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