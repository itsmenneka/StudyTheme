document.addEventListener("DOMContentLoaded", () => {
  const toggleButton = document.getElementById("navbar-toggle");
  const navbar = document.querySelector(".navbar");

  toggleButton.addEventListener("click", () => {
    navbar.classList.toggle("expanded");
    toggleButton.classList.toggle("collapsed");
  });

  // Load saved settings on page load
  loadSettings();
  updateTimerDisplay();
});

let timerInterval;
let isRunning = false;

// DOM Elements
const timerDisplay = document.getElementById("timer-display");
const toggleTimerBtn = document.getElementById("toggle-timer-btn");
const resetBtn = document.getElementById("reset-btn");
const workTimeInput = document.getElementById("work-time");
const breakTimeInput = document.getElementById("break-time");
const modeSelect = document.querySelector(".timer-settings select");

// Initialize Timer
let workTime = parseInt(workTimeInput.value) * 60; // Convert minutes to seconds
let breakTime = parseInt(breakTimeInput.value) * 60;
let remainingTime = workTime;

// Sound to play when timer finishes
const timerEndSound = new Audio("sfx/PomodoroAlarm.mp3"); // Ensure this file exists

// Update Timer Display
function updateTimerDisplay() {
  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;
  timerDisplay.textContent = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

// Start/Stop Timer
function toggleTimer() {
  if (isRunning) {
    clearInterval(timerInterval);
    toggleTimerBtn.textContent = "Start";
  } else {
    timerInterval = setInterval(() => {
      if (remainingTime > 0) {
        remainingTime--;
        updateTimerDisplay();
      } else {
        timerEndSound.play();
        clearInterval(timerInterval);
        handleTimerEnd();
      }
    }, 1000);
    toggleTimerBtn.textContent = "Pause";
  }
  isRunning = !isRunning;
}

// Reset Timer
function resetTimer() {
  clearInterval(timerInterval);
  isRunning = false;
  remainingTime = modeSelect.value === "Work" ? workTime : breakTime;
  updateTimerDisplay();
  toggleTimerBtn.textContent = "Start";
}

// Handle Timer End
function handleTimerEnd() {
  // Hide pause and reset buttons
  toggleTimerBtn.style.display = "none";
  resetBtn.style.display = "none";

  // Show STOP button
  const stopBtn = document.createElement("button");
  stopBtn.id = "stop-btn"; // Add the ID for styling
  stopBtn.textContent = "STOP";
  stopBtn.addEventListener("click", () => {
    // Stop the music
    timerEndSound.pause();
    timerEndSound.currentTime = 0; // Reset the audio to the beginning

    // Switch between work and break mode
    switchMode();

    // Restore buttons
    toggleTimerBtn.style.display = "inline-block";
    resetBtn.style.display = "inline-block";
    stopBtn.remove();
  });
  document.querySelector(".timer-controls").appendChild(stopBtn);
}

// Switch Mode
function switchMode() {
  if (modeSelect.value === "Work") {
    modeSelect.value = "Break";
    remainingTime = breakTime;
    isRunning = false;
  } else {
    modeSelect.value = "Work";
    remainingTime = workTime;
    isRunning = false;
  }
  updateTimerDisplay();
  toggleTimer();
}

// Save settings to localStorage
function saveSettings() {
  localStorage.setItem("workTime", workTimeInput.value);
  localStorage.setItem("breakTime", breakTimeInput.value);
}

// Load saved settings from localStorage
function loadSettings() {
  const savedWorkTime = localStorage.getItem("workTime");
  const savedBreakTime = localStorage.getItem("breakTime");

  if (savedWorkTime) {
    workTimeInput.value = savedWorkTime;
    workTime = parseInt(savedWorkTime) * 60; // Convert minutes to seconds
  }

  if (savedBreakTime) {
    breakTimeInput.value = savedBreakTime;
    breakTime = parseInt(savedBreakTime) * 60; // Convert minutes to seconds
  }

  remainingTime = modeSelect.value === "Work" ? workTime : breakTime;
}

// Update Timer Settings
function updateSettings() {
  if (!isRunning) {
    workTime = parseInt(workTimeInput.value) * 60;
    breakTime = parseInt(breakTimeInput.value) * 60;
    remainingTime = modeSelect.value === "Work" ? workTime : breakTime;
    updateTimerDisplay();

    // Save the updated settings
    saveSettings();
  }
}

// Event Listeners
toggleTimerBtn.addEventListener("click", toggleTimer);
resetBtn.addEventListener("click", resetTimer);
workTimeInput.addEventListener("change", updateSettings);
breakTimeInput.addEventListener("change", updateSettings);
modeSelect.addEventListener("change", switchMode);

// Initialize Display
updateTimerDisplay();
