let searchTimeout = null;
let activeMealType = null;


let appState = {
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


function openModal(mealType) {
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
}

function renderSearchResults(results) {
  appState.currentSearchResults = results;

  if (results.length === 0) {
    searchResults.innerHTML = `<p class="text-xs text-muted p-sm">No food found.</p>`;
    return;
  }

  const html = results
    .map(
      (food) => `
    <div class="search-item p-sm mb-xs" data-id="${food.id}">
        <div class="food-info">
          <strong class="text-sm">${food.name}</strong>
          <span class="text-xs text-muted">${food.calories} kcal / 100g</span>
        </div>
        <div class="food-macros text-xs text-muted">
          P: ${food.protein}g | C: ${food.carbs}g | F: ${food.fat}g
        </div>
      </div>
    `,
    )
    .join("");
  searchResults.innerHTML = html;
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
        <button class="btn-delete-food" data-meal="${mealType}" data-index="${index}">&times;</button>
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
      const results = await searchFood(query);
      renderSearchResults(results);
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
