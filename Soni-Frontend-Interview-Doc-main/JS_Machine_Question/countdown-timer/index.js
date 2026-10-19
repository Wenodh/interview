document.addEventListener('DOMContentLoaded', () => {
  const display = document.getElementById('timer-display');
  const hoursInput = document.getElementById('hours');
  const minutesInput = document.getElementById('minutes');
  const secondsInput = document.getElementById('seconds');

  const startBtn = document.getElementById('start-btn');
  const pauseBtn = document.getElementById('pause-btn');
  const resetBtn = document.getElementById('reset-btn');
  const statusMsg = document.getElementById('status-msg');

  let totalSeconds = 0;
  let timerInterval = null;
  let isRunning = false;

  function pad(num) {
    return String(num).padStart(2, '0');
  }

  function updateDisplay() {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    display.textContent = `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
  }

  function syncFromInputs() {
    const h = parseInt(hoursInput.value, 10) || 0;
    const m = parseInt(minutesInput.value, 10) || 0;
    const s = parseInt(secondsInput.value, 10) || 0;
    totalSeconds = h * 3600 + m * 60 + s;
    updateDisplay();
  }

  function setInputsDisabled(disabled) {
    hoursInput.disabled = disabled;
    minutesInput.disabled = disabled;
    secondsInput.disabled = disabled;
  }

  function startTimer() {
    if (!isRunning) {
      if (totalSeconds <= 0) syncFromInputs();
      if (totalSeconds <= 0) {
        statusMsg.textContent = 'Please enter a valid duration.';
        return;
      }

      isRunning = true;
      setInputsDisabled(true);
      startBtn.disabled = true;
      pauseBtn.disabled = false;
      statusMsg.textContent = 'Timer running...';

      timerInterval = setInterval(() => {
        totalSeconds--;
        updateDisplay();

        if (totalSeconds <= 0) {
          clearInterval(timerInterval);
          timerInterval = null;
          isRunning = false;
          setInputsDisabled(false);
          startBtn.disabled = false;
          pauseBtn.disabled = true;
          statusMsg.textContent = '⏰ Time is up!';
        }
      }, 1000);
    }
  }

  function pauseTimer() {
    if (isRunning) {
      clearInterval(timerInterval);
      timerInterval = null;
      isRunning = false;
      startBtn.disabled = false;
      pauseBtn.disabled = true;
      statusMsg.textContent = 'Timer paused.';
    }
  }

  function resetTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    isRunning = false;
    setInputsDisabled(false);
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    syncFromInputs();
    statusMsg.textContent = 'Timer reset.';
  }

  hoursInput.addEventListener('input', syncFromInputs);
  minutesInput.addEventListener('input', syncFromInputs);
  secondsInput.addEventListener('input', syncFromInputs);

  startBtn.addEventListener('click', startTimer);
  pauseBtn.addEventListener('click', pauseTimer);
  resetBtn.addEventListener('click', resetTimer);

  syncFromInputs();
});
