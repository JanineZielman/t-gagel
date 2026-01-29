export const CATEGORY_THEMES = {
  groen: {
    bg: "#5f6a33",
    fg: "#dcff90",
    accent: "#dcff90",
  },
  aubergine: {
    bg: "#470814",
    fg: "#b7dfff",
    accent: "#b7dfff",
  },
  orange: {
    bg: "#85412b",
    fg: "#FFE2DB",
    accent: "#FFE2DB",
  },
  // Default fallback
  default: {
    bg: "#5f6a33",
    fg: "#dcff90",
    accent: "#dcff90",
  },
}

/**
 * Get theme for a category based on ACF data
 * @param {Object} category - Category object from WordPress API
 * @returns {Object} Theme object with bg, fg, and accent colors
 */
export const getCategoryTheme = (category) => {
  if (!category) return CATEGORY_THEMES.default

  // Check if category has ACF theme data
  const themeKey = category?.acf?.kleurthema

  if (themeKey && CATEGORY_THEMES[themeKey]) {
    return CATEGORY_THEMES[themeKey]
  }

  return CATEGORY_THEMES.default
}

/**
 * Create a category theme map from categories array
 * @param {Array} categories - Array of category objects from WordPress API
 * @returns {Object} Map of category slug to theme object
 */
export const createCategoryThemeMap = (categories) => {
  const themeMap = {}

  if (!Array.isArray(categories)) return themeMap

  categories.forEach((category) => {
    if (category?.slug) {
      themeMap[category.slug] = getCategoryTheme(category)
    }
  })

  return themeMap
}
