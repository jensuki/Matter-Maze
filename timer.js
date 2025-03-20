// timer object for handling game timer + storing best time score

const Timer = {
    startTime: null,
    timerInterval: null,
    bestTime: parseInt(localStorage.getItem('bestTime')) || null,

    // time formatter helper
    formatTime(totalSeconds) {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `Time ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    },

    // start game timer
    start() {
        this.startTime = Date.now() - 1000; // start recording at 1

        // func to update the timer display
        const updateTimer = () => {
            const timeElapsed = Math.floor((Date.now() - this.startTime) / 1000);
            document.querySelector('.timer').textContent = this.formatTime(timeElapsed);
        };

        // call timer immediately
        updateTimer();

        // set up interval for continuous updates
        this.timerInterval = setInterval(updateTimer, 1000);
    },

    stop() {
        clearInterval(this.timerInterval);

        // now calculate time taken for current game
        const timeTaken = Math.floor((Date.now() - this.startTime) / 1000);
        document.querySelector('.timer').textContent = this.formatTime(timeTaken);

        // check if no best time exists or new time is best
        if (!this.bestTime || timeTaken < this.bestTime) {
            // if current time is best so far, update it as new best
            this.bestTime = timeTaken;
            localStorage.setItem('bestTime', this.bestTime);
        }

        // update score to new best time
        document.querySelector('.best-time').textContent = this.formatTime(this.bestTime);

        // return timeTaken to use it for displaying during a win
        return timeTaken;
    },

    // display best time when game loads
    initDisplay() {
        document.querySelector('.best-time').textContent = this.bestTime ? `Best: ${this.formatTime(bestTime)}` : `Best: --`;
    }

}
export { Timer };