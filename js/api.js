import { COMMON_SNACKS } from "./snacksDatabase.js";
import { USDA_API_KEY } from "./config.js";


export async function searchFood(query) {
  if (!query || query.trim().length < 2) return [];

  const cleanQuery = query.toLowerCase().trim();

  const matchedSnacks = (Array.isArray(COMMON_SNACKS) ? COMMON_SNACKS : [])
    .filter((snack) => snack && snack.name && snack.name.toLowerCase().includes(cleanQuery))
    .map((snack) => ({
      ...snack,
    unit: "1 serving", 
  }));

  const url = `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${USDA_API_KEY}&query=${encodeURIComponent(
    cleanQuery,
  )}&dataType=Foundation,SR%20Legacy&pageSize=15`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    const rawFoods = Array.isArray(data?.foods) ? data.foods : [];

    const cleanProducts = rawFoods
      .filter((food) => food && food.fdcId != null && food.description)
      .map((food) => {
        const nutrients = Array.isArray(food.foodNutrients) ? food.foodNutrients : [];

        const getNutrientVal = (id) => {
          const item = nutrients.find((n) => n && n.nutrientId === id);
          return item && typeof item.value === "number" && !isNaN(item.value)
            ? Math.round(item.value)
            : 0;
        };

      return {
        id: food.fdcId.toString(),
        name: food.description,
        calories: getNutrientVal(1008),
        protein: getNutrientVal(1003),
        carbs: getNutrientVal(1005),
        fat: getNutrientVal(1004),
        unit: "100g", 
      };
    });

    return [...matchedSnacks, ...cleanProducts];
  } catch (error) {
    console.error("Error fetching data from USDA API:", error);
    return matchedSnacks;
  }
}