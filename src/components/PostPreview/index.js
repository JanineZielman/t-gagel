import styles from "./PostPreview.module.scss"
import { getCategoryTheme } from "../../utils/themeMap"

const PostPreview = ({
  post,
  selectedCategories,
  current,
  categoryThemeMap,
}) => {
  console.log(post)
  let category =
    post.categories && post.categories.length > 0
      ? post.categories[0].name
      : "uncategorized"
  let categorySlug =
    post.categories && post.categories.length > 0
      ? post.categories[0].slug
      : "uncategorized"

  if (category.toLowerCase() === "overige") {
    category = "uncategorized"
  }

  const queryParams =
    selectedCategories?.length > 0
      ? { categories: selectedCategories.join(",") }
      : category.toLowerCase()

  // Get theme for this category
  let theme = null
  if (categoryThemeMap && categorySlug && categoryThemeMap[categorySlug]) {
    theme = categoryThemeMap[categorySlug]
  } else if (post.categories && post.categories.length > 0) {
    // Fallback: use getCategoryTheme if we have the full category object
    theme = getCategoryTheme(post.categories[0])
  }

  return (
    <a
      className={`${styles.postPreview} post-item ${
        current ? current : category.toLowerCase()
      }`}
      href={`/archive/${post.slug}?categories=${queryParams}`}
      style={
        theme
          ? {
              backgroundColor: theme.bg,
              color: theme.fg,
            }
          : {}
      }
    >
      <div>
        <span
          className={styles.category}
          style={theme ? { color: theme.accent } : {}}
        >
          {category === "uncategorized" ? "" : category}
        </span>
        <h2 dangerouslySetInnerHTML={{ __html: post.title }} />
      </div>
      <div>
        <p>{post.meta ? post.meta.author_name : post.author}</p>
        <div
          className={styles.imgWrapper}
          style={theme ? { "--img-overlay-color": theme.accent } : {}}
        >
          <img
            src={
              post.attachment_image
                ? post.attachment_image.img_src[0]
                : post.thumbnail
            }
            alt={post.title}
          />
        </div>
      </div>
    </a>
  )
}

export default PostPreview
