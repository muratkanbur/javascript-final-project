const waterConsumed = document.getElementById("waterConsumed");
const btnWater250 = document.getElementById("btnWater250");
const btnWater500 = document.getElementById("btnWater500");
const btnResetWater = document.getElementById("btnResetWater");
const waterProgressRing = document.getElementById("waterProgressRing");
const waterMessage = document.getElementById("waterMessage");
const consumedWaterText = document.getElementById("consumedWaterText");


const radius = 70;
const circumference = 2 * Math.PI * radius;
waterProgressRing.style.strokeDasharray = `${circumference} ${circumference}`;
waterProgressRing.style.strokeDashoffset = circumference;

const TARGET_WATER = 2.5;
let totalConsumed = 0;

const waterMessages = [
  "Great start! Keep it up! 💧",
  "Hydration increases your energy! ⚡",
  "Your body will thank you! ❤️",
  "You're halfway there, stay refreshed! 🌟",
  "Keep your mind sharp and healthy! 🧠",
  "Almost reached your daily goal! 🎯",
  "You're doing awesome, take another sip! 🥤",
  "Step by step to perfect hydration! 💪",
  "Consistency is the key to success! 🔥"
];

export function updateWaterUI() {
  waterConsumed.innerText = totalConsumed.toFixed(2).replace(".00", "");

  const isTargetReached = totalConsumed >= TARGET_WATER;
  btnWater250.disabled = isTargetReached;
  btnWater500.disabled = isTargetReached;

  consumedWaterText.style.color = isTargetReached
    ? "var(--primary-color)"
    : "var(--text-color)";

  const percentage = Math.min(totalConsumed / TARGET_WATER, 1);
  const offset = circumference - percentage * circumference;
  waterProgressRing.style.strokeDashoffset = offset;

  if (isTargetReached) {
    waterMessage.innerText = "Congratulations! You reached your daily goal! 🎉";
  } else if (totalConsumed > 0) {
    const randomIndex = Math.floor(Math.random()*waterMessages.length);
    waterMessage.innerText = waterMessages[randomIndex];
  } else {
    waterMessage.innerText = "No water tracked today yet. Click a button to start!";
  }
}

btnWater250.addEventListener("click", () => {
  totalConsumed += 0.25;
  updateWaterUI();
});

btnWater500.addEventListener("click", () => {
  totalConsumed += 0.5;
  updateWaterUI();
});

btnResetWater.addEventListener("click", () => {
  totalConsumed = 0;
  updateWaterUI();
});
