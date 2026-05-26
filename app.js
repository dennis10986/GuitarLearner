const CHROMATIC = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// MIDI note number of each open string (standard tuning)
const OPEN_MIDI = { e: 40, a: 45, d: 50, g: 55, b: 59, E: 64 };

const STRINGS = {
  e: { label: 'Low E (6th)',  frets: range(0, 12) },
  a: { label: 'A (5th)',      frets: range(0, 12) },
  d: { label: 'D (4th)',      frets: range(0, 12) },
  g: { label: 'G (3rd)',      frets: range(0, 12) },
  b: { label: 'B (2nd)',      frets: range(0, 12) },
  E: { label: 'High E (1st)', frets: range(0, 12) },
};

function range(from, to) {
  return Array.from({ length: to - from + 1 }, (_, i) => i + from);
}

function fretToToneNote(string, fret) {
  const midi = OPEN_MIDI[string] + fret;
  return CHROMATIC[midi % 12] + (Math.floor(midi / 12) - 1);
}

// --- Tone.js sampler setup ---

const sampler = new Tone.Sampler({
  urls: {
    'A2':  'A2.mp3',  'A3':  'A3.mp3',  'A4':  'A4.mp3',
    'A#2': 'As2.mp3', 'A#3': 'As3.mp3', 'A#4': 'As4.mp3',
    'B2':  'B2.mp3',  'B3':  'B3.mp3',  'B4':  'B4.mp3',
    'C3':  'C3.mp3',  'C4':  'C4.mp3',  'C5':  'C5.mp3',
    'C#3': 'Cs3.mp3', 'C#4': 'Cs4.mp3', 'C#5': 'Cs5.mp3',
    'D2':  'D2.mp3',  'D3':  'D3.mp3',  'D4':  'D4.mp3',  'D5': 'D5.mp3',
    'D#2': 'Ds2.mp3', 'D#3': 'Ds3.mp3', 'D#4': 'Ds4.mp3',
    'E2':  'E2.mp3',  'E3':  'E3.mp3',  'E4':  'E4.mp3',
    'F2':  'F2.mp3',  'F3':  'F3.mp3',  'F4':  'F4.mp3',
    'F#2': 'Fs2.mp3', 'F#3': 'Fs3.mp3', 'F#4': 'Fs4.mp3',
    'G2':  'G2.mp3',  'G3':  'G3.mp3',  'G4':  'G4.mp3',
  },
  baseUrl: 'https://nbrosowsky.github.io/tonejs-instruments/samples/guitar-acoustic/',
  onload: onSamplerReady,
  onerror: () => showFeedback('wrong', 'Failed to load audio samples. Check your connection.'),
}).toDestination();

function onSamplerReady() {
  loader.hidden = true;
  if (selectedString) {
    playBtn.disabled = false;
  }
}

// --- DOM refs ---
const playSection   = document.getElementById('playSection');
const playBtn       = document.getElementById('playBtn');
const replayBtn     = document.getElementById('replayBtn');
const answerInput   = document.getElementById('answerInput');
const submitBtn     = document.getElementById('submitBtn');
const revealBtn     = document.getElementById('revealBtn');
const feedback      = document.getElementById('feedback');
const currentLabel  = document.getElementById('currentStringLabel');
const correctEl     = document.getElementById('correct');
const totalEl       = document.getElementById('total');
const streakEl      = document.getElementById('streak');
const loader        = document.getElementById('loader');

// --- State ---
let selectedString = null;
let currentNote    = null;   // e.g. "g5"
let currentToneNote = null;  // e.g. "C4"
let correct = 0, total = 0, streak = 0;

// --- String selection ---
document.querySelectorAll('.string-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.string-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    selectedString = btn.dataset.string;
    currentLabel.textContent = STRINGS[selectedString].label;
    playSection.hidden = false;

    if (!loader.hidden) return; // still loading
    playBtn.disabled = false;
    resetRound();
  });
});

// --- Play buttons ---
playBtn.addEventListener('click', async () => {
  await Tone.start(); // required by browser autoplay policy

  const frets = STRINGS[selectedString].frets;
  const fret  = frets[Math.floor(Math.random() * frets.length)];

  currentNote     = `${selectedString}${fret}`;
  currentToneNote = fretToToneNote(selectedString, fret);

  triggerNote();

  replayBtn.disabled   = false;
  answerInput.disabled = false;
  answerInput.value    = '';
  answerInput.focus();
  submitBtn.disabled   = false;
  revealBtn.disabled   = false;
  resetFeedback();
});

replayBtn.addEventListener('click', async () => {
  if (!currentToneNote) return;
  await Tone.start();
  triggerNote();
});

function triggerNote() {
  const now = Tone.now();
  sampler.triggerAttack(currentToneNote, now);
  sampler.triggerAttack(currentToneNote, now + 1.5);
  sampler.triggerAttack(currentToneNote, now + 3.0);
}

// --- Reveal ---
revealBtn.addEventListener('click', () => {
  if (!currentNote) return;
  total++;
  streak = 0;
  totalEl.textContent  = total;
  streakEl.textContent = streak;
  showFeedback('reveal', `The answer was: ${currentNote} (${currentToneNote})`);
  answerInput.disabled = true;
  submitBtn.disabled   = true;
  revealBtn.disabled   = true;
  currentNote          = null;
});

// --- Answer checking ---
submitBtn.addEventListener('click', checkAnswer);
answerInput.addEventListener('keydown', e => { if (e.key === 'Enter') checkAnswer(); });

function checkAnswer() {
  if (!currentNote || answerInput.disabled) return;

  const answer = answerInput.value.trim();

  total++;
  totalEl.textContent = total;

  if (answer.toLowerCase() === currentNote.toLowerCase()) {
    correct++;
    streak++;
    correctEl.textContent = correct;
    streakEl.textContent  = streak;
    showFeedback('correct', `Correct! ${currentNote} = ${currentToneNote}`);
    answerInput.disabled = true;
    submitBtn.disabled   = true;
    currentNote          = null;
  } else {
    streak = 0;
    streakEl.textContent = streak;
    showFeedback('wrong', 'Not quite — try again!');
    answerInput.value = '';
    answerInput.focus();
  }
}

// --- Helpers ---
function resetRound() {
  currentNote     = null;
  currentToneNote = null;
  answerInput.value    = '';
  answerInput.disabled = true;
  submitBtn.disabled   = true;
  revealBtn.disabled   = true;
  replayBtn.disabled   = true;
  resetFeedback();
}

function showFeedback(type, msg) {
  feedback.textContent = msg;
  feedback.className   = `feedback ${type}`;
}

function resetFeedback() {
  feedback.textContent = '';
  feedback.className   = 'feedback';
}
