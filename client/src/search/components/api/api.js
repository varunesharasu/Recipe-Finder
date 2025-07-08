const appId = "184bb69b"
const apiKey = "c6a4f5cc2c3d863e370e2d978382677e"

export const fetchRecipes = async (query) => {
  // Updated to use Edamam API v2 endpoint
  const url = `https://api.edamam.com/api/recipes/v2?type=public&q=${encodeURIComponent(query)}&app_id=${appId}&app_key=${apiKey}&from=0&to=12`

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })

    console.log("API Response Status:", response.status) // Debug log

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log("API Response Data:", data) // Debug log

    if (data && data.hits && data.hits.length > 0) {
      return data
    } else {
      console.log("No recipes found in API response")
      return { hits: [] }
    }
  } catch (error) {
    console.error("Error fetching recipes:", error)
    // Return empty result instead of throwing error to prevent app crash
    return { hits: [] }
  }
}

// Alternative function to fetch recipes with different parameters
export const fetchRecipesWithFilters = async (query, filters = {}) => {
  let url = `https://api.edamam.com/api/recipes/v2?type=public&q=${encodeURIComponent(query)}&app_id=${appId}&app_key=${apiKey}&from=0&to=12`

  // Add diet filters if provided
  if (filters.diet) {
    url += `&diet=${filters.diet}`
  }

  // Add health filters if provided
  if (filters.health) {
    url += `&health=${filters.health}`
  }

  // Add meal type if provided
  if (filters.mealType) {
    url += `&mealType=${filters.mealType}`
  }

  // Add time filter if provided
  if (filters.time) {
    url += `&time=${filters.time}`
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching filtered recipes:", error)
    return { hits: [] }
  }
}
