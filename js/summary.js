import { appState } from "./calorie.js";

export function updateSummary() {
  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;

  Object.keys(appState.meals).forEach((mealType) => {
    appState.meals[mealType].forEach((food) => {
      totalCalories += food.calories || 0;
      totalProtein += food.protein || 0;
      totalCarbs += food.carbs || 0;
      totalFat += food.fat || 0;
    });
  });

  const consumedCalorieEl = document.getElementById("consumedCalorie");
  const remainingCalorieEl = document.getElementById("remainingCalorie");
  const targetCalorieEl = document.getElementById("targetCalorie");

  const proteinValEl = document.getElementById("proteinVal");
  const carbValEl = document.getElementById("carbVal");
  const fatValEl = document.getElementById("fatVal");

  const proteinBarEl = document.getElementById("proteinBar");
  const carbBarEl = document.getElementById("carbBar");
  const fatBarEl = document.getElementById("fatBar");

  const calorieProgressRing = document.getElementById("calorieProgressRing");

  const targetCalories = targetCalorieEl
    ? parseInt(targetCalorieEl.textContent, 10)
    : 2100;
  const remainingCalories = Math.max(0, targetCalories - totalCalories);

  if (consumedCalorieEl) consumedCalorieEl.textContent = totalCalories;
  if (remainingCalorieEl) remainingCalorieEl.textContent = remainingCalories;

  if (proteinValEl) proteinValEl.textContent = totalProtein;
  if (carbValEl) carbValEl.textContent = totalCarbs;
  if (fatValEl) fatValEl.textContent = totalFat;

  const targetProtein = 150;
  const targetCarbs = 250;
  const targetFat = 70;

  if (proteinBarEl) {
    const pPercent = Math.min(100, (totalProtein / targetProtein) * 100);
    proteinBarEl.style.width = `${pPercent}%`;
  }
  if (carbBarEl) {
    const cPercent = Math.min(100, (totalCarbs / targetCarbs) * 100);
    carbBarEl.style.width = `${cPercent}%`;
  }
  if (fatBarEl) {
    const fPercent = Math.min(100, (totalFat / targetFat) * 100);
    fatBarEl.style.width = `${fPercent}%`;
  }
  if (calorieProgressRing) {
    const radius = calorieProgressRing.r.baseVal.value;
    const circumference = 2 * Math.PI * radius; 
    
    calorieProgressRing.style.strokeDasharray = `${circumference} ${circumference}`;
    
    const caloriePercent = Math.min(1, totalCalories / targetCalories);
    const offset = circumference - (caloriePercent * circumference);
    
    calorieProgressRing.style.strokeDashoffset = offset;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  updateSummary();
});
