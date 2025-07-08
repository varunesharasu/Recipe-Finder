"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import RecipeCard from "./components/RecipeCard"
import { fetchRecipesWithFilters } from "./components/api/api"
import axios from "axios"
import { useNotification } from "../components/NotificationContext"
import "./components/styles.css"

const Search = () => {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState("")
  const [user, setUser] = useState(null)
  const [activeFilter, setActiveFilter] = useState("all")
  const [hasSearched, setHasSearched] = useState(false)
  const navigate = useNavigate()
  const { addNotification } = useNotification()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      navigate("/login")
      return
    }
    setUser(JSON.parse(userData))
  }, [navigate])

  const handleSearch = async (searchQuery, filter = "all") => {
    if (!searchQuery.trim()) {
      addNotification("Please enter a search term", "error")
      return
    }

    setLoading(true)
    setHasSearched(true)

    try {
      let combinedRecipes = []

      // Fetch MongoDB recipes first
      try {
        const response = await axios.get(`https://recipe-finder-x2s0.onrender.com/recipes`, {
          params: { label: searchQuery },
        })
        const mongoData = response.data.map((recipe) => ({
          _id: recipe._id,
          uri: `mongodb_${recipe._id}`,
          label: recipe.label,
          image: recipe.image,
          calories: recipe.calories,
          totalTime: recipe.totalTime,
          ingredients: recipe.ingredients,
          servings: recipe.servings || 4,
          source: "mongodb",
        }))
        combinedRecipes = [...mongoData]
        console.log("MongoDB recipes found:", mongoData.length)
      } catch (mongoError) {
        console.log("MongoDB search failed:", mongoError.message)
      }

      // Fetch API recipes with filters
      try {
        const filters = {}

        // Apply filters based on active filter
        switch (filter) {
          case "vegetarian":
            filters.diet = "vegetarian"
            break
          case "healthy":
            filters.health = "low-sodium"
            break
          case "quick":
            filters.time = "1-30"
            break
          case "desserts":
            // For desserts, we'll search for dessert-related terms
            searchQuery = searchQuery.includes("dessert") ? searchQuery : `${searchQuery} dessert`
            break
          default:
            // No additional filters for "all"
            break
        }

        const data = await fetchRecipesWithFilters(searchQuery, filters)
        console.log("API Response:", data)

        if (data && data.hits && data.hits.length > 0) {
          const apiRecipes = data.hits.map((hit, index) => ({
            uri: hit.recipe.uri || `api_${index}`,
            label: hit.recipe.label,
            image: hit.recipe.image,
            calories: Math.round(hit.recipe.calories),
            totalTime: hit.recipe.totalTime || 30,
            ingredients: hit.recipe.ingredients ? hit.recipe.ingredients.map((i) => i.text) : [],
            servings: hit.recipe.yield || 4,
            source: "api",
          }))
          combinedRecipes = [...combinedRecipes, ...apiRecipes]
          console.log("API recipes found:", apiRecipes.length)
        }
      } catch (apiError) {
        console.log("API search failed:", apiError.message)
        addNotification("External recipe search temporarily unavailable", "warning")
      }

      console.log("Total recipes found:", combinedRecipes.length)
      setRecipes(combinedRecipes)

      if (combinedRecipes.length === 0) {
        addNotification("No recipes found. Try different keywords.", "info")
      } else {
        addNotification(`Found ${combinedRecipes.length} recipes!`, "success")
      }
    } catch (error) {
      console.error("Search error:", error)
      addNotification("Search failed. Please try again.", "error")
      setRecipes([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    handleSearch(query, activeFilter)
  }

  const handleFilterClick = (filter) => {
    setActiveFilter(filter)
    if (hasSearched && query.trim()) {
      handleSearch(query, filter)
    }
  }

  // Load some default recipes on component mount
  useEffect(() => {
    if (user && !hasSearched) {
      handleSearch("chicken", "all")
    }
  }, [user])

  if (!user) return null

  return (
    <div className="rf-search-page">
      <div className="rf-search-container">
        {/* Header */}
        <div className="rf-search-header">
          <h1 className="rf-search-title">Recipe Search</h1>
          <p className="rf-search-subtitle">Discover your next favorite dish from thousands of recipes</p>
        </div>

        {/* Search Form */}
        <div className="rf-search-form-container">
          <form onSubmit={handleSubmit} className="rf-search-form">
            <div className="rf-search-input-wrapper">
              <div className="rf-search-input-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for recipes, ingredients, or cuisines..."
                className="rf-search-input"
              />
            </div>
            <button type="submit" disabled={loading} className="rf-search-btn">
              {loading ? (
                <div className="rf-loading"></div>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" />
                  </svg>
                  <span>Search</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Filters */}
        <div className="rf-filters-container">
          <button
            className={`rf-filter-btn ${activeFilter === "all" ? "rf-active" : ""}`}
            onClick={() => handleFilterClick("all")}
          >
            All Recipes
          </button>
          <button
            className={`rf-filter-btn ${activeFilter === "quick" ? "rf-active" : ""}`}
            onClick={() => handleFilterClick("quick")}
          >
            Quick & Easy
          </button>
          <button
            className={`rf-filter-btn ${activeFilter === "healthy" ? "rf-active" : ""}`}
            onClick={() => handleFilterClick("healthy")}
          >
            Healthy
          </button>
          <button
            className={`rf-filter-btn ${activeFilter === "vegetarian" ? "rf-active" : ""}`}
            onClick={() => handleFilterClick("vegetarian")}
          >
            Vegetarian
          </button>
          <button
            className={`rf-filter-btn ${activeFilter === "desserts" ? "rf-active" : ""}`}
            onClick={() => handleFilterClick("desserts")}
          >
            Desserts
          </button>
        </div>

        {/* Results */}
        <div className="rf-results-container">
          {loading ? (
            <div className="rf-loading-container">
              <div className="rf-loading-spinner-large"></div>
              <p className="rf-loading-text">Searching for delicious recipes...</p>
            </div>
          ) : recipes.length > 0 ? (
            <div className="rf-recipes-grid">
              {recipes.map((recipe, index) => (
                <RecipeCard key={recipe.uri || recipe._id || index} recipe={recipe} delay={`${index * 0.1}s`} />
              ))}
            </div>
          ) : hasSearched ? (
            <div className="rf-empty-state">
              <svg className="rf-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="m16 10-4 4-4-4" />
              </svg>
              <h3 className="rf-empty-title">No recipes found</h3>
              <p className="rf-empty-description">Try searching with different keywords or filters</p>
            </div>
          ) : (
            <div className="rf-empty-state">
              <svg className="rf-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <h3 className="rf-empty-title">Start your culinary journey</h3>
              <p className="rf-empty-description">Search for recipes to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Search
