let timerInterval;
let timeRemaining = localStorage.getItem('timeRemaining') 
  ? parseInt(localStorage.getItem('timeRemaining')) 
  : 1500; // Default to 25 minutes
let isRunning = localStorage.getItem('isRunning') === 'true'; // Check if the timer was running

const timerDisplay = document.getElementById('timer-display');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');

// Update the timer display
function updateTimerDisplay() {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Start the timer
function startTimer() {
  if (timerInterval) return; // Prevent multiple intervals
  isRunning = true;
  localStorage.setItem('isRunning', isRunning); // Save running state
  timerInterval = setInterval(() => {
    if (timeRemaining > 0) {
      timeRemaining--;
      localStorage.setItem('timeRemaining', timeRemaining); // Save to localStorage
      updateTimerDisplay();
    } else {
      clearInterval(timerInterval);
      timerInterval = null;
      isRunning = false;
      localStorage.setItem('isRunning', isRunning); // Save running state
      alert('Time is up!');
    }
  }, 1000);
}

// Pause the timer
function pauseTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  isRunning = false;
  localStorage.setItem('isRunning', isRunning); // Save running state
}

// Reset the timer
function resetTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  timeRemaining = 1500; // Reset to 25 minutes
  isRunning = false;
  localStorage.setItem('timeRemaining', timeRemaining); // Save to localStorage
  localStorage.setItem('isRunning', isRunning); // Save running state
  updateTimerDisplay();
}

// Event listeners
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

// Initialize the timer display
updateTimerDisplay();

// Resume the timer if it was running
if (isRunning) {
  startTimer();
}