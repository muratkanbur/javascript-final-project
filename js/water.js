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

function updateWaterUI() {
  waterConsumed.innerText = totalConsumed.toFixed(2).replace(".00", "");

  const isTargetReached = totalConsumed >= TARGET_WATER;
  btnWater250.disabled = isTargetReached;
  btnWater500.disabled = isTargetReached;

  consumedWaterText.style.color = isTargetReached
    ? "var(--primary-color)"
    : "var(--text-color)";
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
