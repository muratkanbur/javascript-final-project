import { COMMON_SNACKS } from "./snacksDatabase.js";
import { searchFood } from "./api.js";
import { updateSummary } from "./summary.js";
import { updateWaterUI } from "./water.js";

let searchTimeout = null;
let activeMealType = null;

export const appState = {
  meals: {
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: [],
  },
  currentSearchResults: [],
};

const searchModal = document.getElementById("searchModal");
const modalTitle = document.getElementById("modalTitle");
const btnCloseModal = document.getElementById("btnCloseModal");
const foodSearchInput = document.getElementById("foodSearchInput");
const searchResults = document.getElementById("searchResults");
const btnAddMeals = document.querySelectorAll(".btn-add-meal");
let lastFocusedElement;

function openModal(mealType) {
  lastFocusedElement = document.activeElement;
  activeMealType = mealType;
  searchModal.classList.remove("hidden");
  const formattedMeal = mealType.charAt(0).toUpperCase() + mealType.slice(1);
  modalTitle.textContent = `Add Food to ${formattedMeal}`;
  foodSearchInput.focus();
}

function closeModal() {
  searchModal.classList.add("hidden");
  foodSearchInput.value = "";
  searchResults.innerHTML = "";
  activeMealType = null;
  if (lastFocusedElement) lastFocusedElement.focus();
}

function renderSearchResults(results) {
  appState.currentSearchResults = results;
  searchResults.innerHTML = "";

  if (results.length === 0) {
    const noResultText = document.createElement("p");
    noResultText.className = "text-xs text-muted p-sm";
    noResultText.textContent = "No food found.";
    searchResults.appendChild(noResultText);
    return;
  }

  results.forEach((food) => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "search-item p-sm mb-xs";
    itemDiv.setAttribute("data-id", food.id);

    const foodInfo = document.createElement("div");
    foodInfo.className = "food-info";

    const foodName = document.createElement("strong");
    foodName.className = "text-sm";
    foodName.textContent = food.name;

    const foodCal = document.createElement("span");
    foodCal.className = "text-xs text-muted";

    const servingInfo = food.serving ? food.serving : "100g";
    foodCal.textContent = `${food.calories} kcal / ${food.unit || "100g"}`;
    foodInfo.append(foodName, foodCal);

    const foodMacros = document.createElement("div");
    foodMacros.className = "food-macros text-xs text-muted";
    foodMacros.textContent = `P: ${food.protein}g | C: ${food.carbs}g | F: ${food.fat}g`;

    itemDiv.append(foodInfo, foodMacros);
    searchResults.appendChild(itemDiv);
  });
}

function addFoodToMeal(foodId) {
  if (!activeMealType) return;

  const selectedFood = appState.currentSearchResults.find(
    (item) => item.id === foodId,
  );

  if (!selectedFood) return;

  appState.meals[activeMealType].push(selectedFood);
  renderMealList(activeMealType);
  updateSummary();
  closeModal();
}

function renderMealList(mealType) {
  const listElement = document.getElementById(`${mealType}List`);
  if (!listElement) return;

  const foods = appState.meals[mealType];

  listElement.innerHTML = foods
    .map(
      (food, index) => `
      <li class="meal-item p-xs mb-xs">
        <div class="meal-item-info">
          <span class="text-sm font-medium">${food.name}</span>
          <small class="text-xs text-muted">${food.calories} kcal</small>
        </div>
        <button class="btn-delete-food" data-meal="${mealType}" data-index="${index}" aria-label="Remove ${food.name} from ${mealType}">&times;</button>
      </li>
    `,
    )
    .join("");
}

btnAddMeals.forEach((btn) => {
  btn.addEventListener("click", () => {
    const meal = btn.getAttribute("data-meal");
    openModal(meal);
  });
});

btnCloseModal.addEventListener("click", closeModal);

searchModal.addEventListener("click", (e) => {
  if (e.target === searchModal) {
    closeModal();
  }
});

foodSearchInput.addEventListener("input", (e) => {
  const query = e.target.value;

  clearTimeout(searchTimeout);

  searchTimeout = setTimeout(async () => {
    if (query.trim().length >= 2) {
      console.log("A request is being sent to the API:", query);

      searchResults.innerHTML = `<p class="text-xs text-muted p-sm">Searching for foods...</p>`;

      try {
        const results = await searchFood(query);
        renderSearchResults(results);
      } catch (error) {
        searchResults.innerHTML = `<p class="text-xs text-danger p-sm">Failed to fetch food items. Please check your connection and try again.</p>`;
      }
    } else {
      searchResults.innerHTML = "";
    }
  }, 400);
});

searchResults.addEventListener("click", (e) => {
  const item = e.target.closest(".search-item");
  if (item) {
    const foodId = item.getAttribute("data-id");
    addFoodToMeal(foodId);
  }
});

function deleteFoodFromMeal(mealType, index) {
  appState.meals[mealType].splice(index, 1);
  renderMealList(mealType);
  updateSummary();
}

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-delete-food")) {
    const mealType = e.target.getAttribute("data-meal");
    const index = parseInt(e.target.getAttribute("data-index"), 10);
    deleteFoodFromMeal(mealType, index);
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !searchModal.classList.contains("hidden")) {
    closeModal();
  }
});
