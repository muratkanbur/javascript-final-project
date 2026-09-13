async function searchFood(query) {
  if (!query || query.trim().length < 2) return [];

  const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(
    query,
  )}&search_simple=1&action=process&json=1&page_size=10`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const rawProducts = data.products || [];

    const cleanProducts = rawProducts.map((product) => {
      const nutriments = product.nutriments || {};

      return {
        id: product._id || Math.random().toString(),
        name: product.product_name_en || product.product_name || "Unknown Food",
        calories: Math.round(nutriments["energy-kcal_100g"] || nutriments["energy-kcal"] || 0),
        protein: Math.round(nutriments.proteins_100g || 0),
        carbs: Math.round(nutriments.carbohydrates_100g || 0),
        fat: Math.round(nutriments.fat_100g || 0),
      };
    });
    return cleanProducts;
  } catch (error) {
    console.error("Error fetching food data:", error);
    return [];
  }
}
