document.addEventListener("DOMContentLoaded", () => {
  const toggleButton = document.getElementById("navbar-toggle");
  const navbar = document.querySelector(".navbar");

  toggleButton.addEventListener("click", () => {
    navbar.classList.toggle("expanded");
    toggleButton.classList.toggle("collapsed");
  });

  // Load saved settings and timer state on page load
  loadSettings();
  loadTimerState();
  updateTimerDisplay();

  if (isRunning) {
    isRunning = false;
    toggleTimer(); // Resume timer if it was running
  }
});

let timerInterval;
let isRunning = localStorage.getItem("isRunning") === "true";

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

// Save Timer State to localStorage
function saveTimerState() {
  localStorage.setItem("remainingTime", remainingTime);
  localStorage.setItem("isRunning", isRunning);
  localStorage.setItem("currentMode", modeSelect.value);
  localStorage.setItem("lastUpdated", Date.now()); // Save the current timestamp
}

// Load Timer State from localStorage
function loadTimerState() {
  const savedRemainingTime = localStorage.getItem("remainingTime");
  const savedIsRunning = localStorage.getItem("isRunning");
  const savedMode = localStorage.getItem("currentMode");
  const lastUpdated = localStorage.getItem("lastUpdated");

  if (savedRemainingTime !== null) {
    remainingTime = parseInt(savedRemainingTime, 10);

    // Calculate elapsed time if the timer was running
    if (lastUpdated && savedIsRunning === "true") {
      const elapsedTime = Math.floor(
        (Date.now() - parseInt(lastUpdated, 10)) / 1000
      );
      remainingTime = Math.max(remainingTime - elapsedTime, 0);
    }
  }

  if (savedIsRunning !== null) {
    isRunning = savedIsRunning === "true";
  }

  if (savedMode) {
    modeSelect.value = savedMode;
  }
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
        saveTimerState(); // Save state on every tick
      } else {
        timerEndSound.play();
        clearInterval(timerInterval);
        handleTimerEnd();
      }
    }, 1000);
    toggleTimerBtn.textContent = "Pause";
  }
  isRunning = !isRunning;
  saveTimerState(); // Save state when toggling
}

// Reset Timer
function resetTimer() {
  clearInterval(timerInterval);
  isRunning = false;
  remainingTime = modeSelect.value === "Work" ? workTime : breakTime;
  updateTimerDisplay();
  toggleTimerBtn.textContent = "Start";
  saveTimerState(); // Save state after reset
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
    isRunning = false;
    toggleTimer();

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
    modeSelect.value = "Break"; // Switch to Break mode
    remainingTime = breakTime; // Set remaining time to break time
  } else if (modeSelect.value === "Break") {
    modeSelect.value = "Work"; // Switch to Work mode
    remainingTime = workTime; // Set remaining time to work time
  }
  updateTimerDisplay(); // Update the timer display
  saveTimerState(); // Save the mode change
}

function modeChanged() {
  if (modeSelect.value === "Work") {
    modeSelect.value = "Work"; // Switch to Break mode
    remainingTime = workTime; // Set remaining time to break time
    isRunning = false;
  } else if (modeSelect.value === "Break") {
    modeSelect.value = "Break"; // Switch to Work mode
    remainingTime = breakTime; // Set remaining time to work time
    isRunning = false;
  }
  updateTimerDisplay(); // Update the timer display
  saveTimerState(); // Save the mode change
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
    saveTimerState(); // Save the updated remaining
  }
}

// Event Listeners
toggleTimerBtn.addEventListener("click", toggleTimer);
resetBtn.addEventListener("click", resetTimer);
workTimeInput.addEventListener("change", updateSettings);
breakTimeInput.addEventListener("change", updateSettings);
modeSelect.addEventListener("change", modeChanged);

// Initialize Display
updateTimerDisplay();
