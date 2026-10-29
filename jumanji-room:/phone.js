// Run this once when phone.html loads (right after QR scan)
db.ref('game/stage').once('value', (snapshot) => {
  if (!snapshot.exists()) {
    // This is the first phone to scan, start the game
    db.ref('game').set({
      stage: 'dice',
      startTime: Date.now()
    });
  }
});

const codeInput = document.getElementById('codeInput');
const submitBtn = document.getElementById('submitBtn');
const feedback = document.getElementById('feedback');
const instruction = document.getElementById('instruction');

let currentStage = 'dice';

db.ref('game/stage').on('value', (snapshot) => {
  currentStage = snapshot.val() || 'dice';
  updateInstruction();
});

function updateInstruction() {
  if (currentStage === 'dice') instruction.textContent = GAME.diceClue;
  else if (currentStage === 'animal') instruction.textContent = GAME.animalClue;
  else instruction.textContent = "No code needed right now. Go find the keycard!";
  codeInput.value = "";
  feedback.textContent = "";
}

submitBtn.addEventListener('click', () => {
  const code = codeInput.value.trim().toUpperCase();

  if (currentStage === 'dice') {
    if (GAME.diceCodes.includes(code)) {
      feedback.textContent = "Correct! Move on to the next trial.";
      db.ref('game/stage').set('animal');
    } else feedback.textContent = "Incorrect. Try again.";
  }
  else if (currentStage === 'animal') {
    if (code === GAME.animalCode) {
      feedback.textContent = "Correct! Now go find the keycard.";
      db.ref('game/stage').set('final');
    } else feedback.textContent = "Incorrect. Try again.";
  }
  else feedback.textContent = "Just find the keycard hidden in the room!";
});