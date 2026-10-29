const startBtn = document.getElementById('startBtn');
const intro = document.getElementById('intro');
const introVideo = document.getElementById('introVideo');
const qrScreen = document.getElementById('qrScreen');
const stageDisplay = document.getElementById('stageDisplay');
const stageTitle = document.getElementById('stageTitle');
const stageText = document.getElementById('stageText');
const timerEl = document.getElementById('timer');

const introVO = document.getElementById('introVO');
const drumsBG = document.getElementById('drumsBG');
const correctSFX = document.getElementById('correctSFX');
const wrongSFX = document.getElementById('wrongSFX');
const victorySFX = document.getElementById('victorySFX');

let currentStage = null;

startBtn.addEventListener('click', () => {
  document.documentElement.requestFullscreen();

  // Hide start button, show video
  intro.style.display = 'none';
  introVideo.style.display = 'block';

  // Play video + voiceover AT THE SAME TIME
  introVideo.play();
  introVO.play();

  // When video ends, show QR code + start drum music
  introVideo.onended = () => {
    introVideo.style.display = 'none';
    qrScreen.style.display = 'flex';
    drumsBG.volume = 0.4; // adjust as needed, keep it subtle
    drumsBG.play();
  };
});

// Listen for Firebase game state changes
db.ref('game').on('value', (snapshot) => {
  const data = snapshot.val();
  if (!data) return;

  // First time the game starts (after QR scan), switch from QR screen to stage display
  if (data.stage && qrScreen.style.display !== 'none') {
    qrScreen.style.display = 'none';
    stageDisplay.style.display = 'flex';
  }

  if (currentStage && currentStage !== data.stage) {
    playStageSound(data.stage);
  }
  currentStage = data.stage;

  updateStageDisplay(data.stage);
  if (data.startTime) startCountdown(data.startTime);
});

function playStageSound(stage) {
  if (stage === 'escaped') {
    drumsBG.pause();
    victorySFX.play();
  } else {
    correctSFX.play();
  }
}

function updateStageDisplay(stage) {
  stageDisplay.className = stage;

  if (stage === 'dice') {
    stageTitle.textContent = "Trial 1: The Dice of Fate";
    stageText.textContent = GAME.diceClue;
  } else if (stage === 'animal') {
    stageTitle.textContent = "Trial 2: Portrait of the Animal";
    stageText.textContent = GAME.animalQuestion + " — " + GAME.animalClue;
  } else if (stage === 'final') {
    stageTitle.textContent = "Trial 3: The Sacred Keycard";
    stageText.textContent = GAME.finalClue;
  } else if (stage === 'escaped') {
    stageTitle.textContent = "YOU ESCAPED!";
    stageText.textContent = "Congratulations, you have survived Jumanji.";
  }
}

let countdownInterval;
function startCountdown(startTime) {
  clearInterval(countdownInterval);
  const totalMs = GAME.timeLimitMinutes * 60 * 1000;

  countdownInterval = setInterval(() => {
    const remaining = totalMs - (Date.now() - startTime);
    if (remaining <= 0) {
      clearInterval(countdownInterval);
      timerEl.textContent = "00:00";
      return;
    }
    const mins = Math.floor(remaining / 60000);
    const secs = Math.floor((remaining % 60000) / 1000);
    timerEl.textContent = String(mins).padStart(2,'0') + ":" + String(secs).padStart(2,'0');
  }, 1000);
}