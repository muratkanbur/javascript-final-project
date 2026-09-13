

const USDA_API_KEY = "cjWDeC4ZmU85Vu4E1OExA0qK24wApzaLa52ySa16";

async function searchFood(query) {
  if (!query || query.trim().length < 2) return [];

  const cleanQuery = query.toLowerCase().trim();

  const matchedSnacks = COMMON_SNACKS.filter((snack) =>
    snack.name.toLowerCase().includes(cleanQuery),
  );

  // USDA FoodData Central Search Endpoint
  // dataType: Foundation ve SR Legacy
  const url = `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${USDA_API_KEY}&query=${encodeURIComponent(
    cleanQuery,
  )}&dataType=Foundation,SR%20Legacy&pageSize=15`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const rawFoods = data.foods || [];

    const cleanProducts = rawFoods.map((food) => {
      const nutrients = food.foodNutrients || [];

      // USDA Nutrients ID Mapping:
      // 1008 -> Energy (kcal)
      // 1003 -> Protein (g)
      // 1005 -> Carbohydrate (g)
      // 1004 -> Total lipid/fat (g)

      const getNutrientVal = (id) => {
        const item = nutrients.find((n) => n.nutrientId === id);
        return item ? Math.round(item.value) : 0;
      };

      return {
        id: food.fdcId.toString(),
        name: food.description,
        calories: getNutrientVal(1008),
        protein: getNutrientVal(1003),
        carbs: getNutrientVal(1005),
        fat: getNutrientVal(1004),
      };
    });

    return [...matchedSnacks, ...cleanProducts];
  } catch (error) {
    console.error("Error fetching data from USDA API:", error);
    return matchedSnacks;
  }
}
