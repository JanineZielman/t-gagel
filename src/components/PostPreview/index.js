import styles from "./PostPreview.module.scss"

const PostPreview = ({ post, selectedCategories }) => {
  const category = post.categories[0].name
  const queryParams =
    selectedCategories?.length > 0
      ? { categories: selectedCategories.join(",") }
      : category.toLowerCase()

  return (
    <a
      className={`${styles.postPreview} post-item ${category.toLowerCase()}`}
      href={`/archive/${post.slug}?categories=${queryParams}`}
    >
      <div>
        <span className={styles.category}>{category}</span>
        <h2>{post.title}</h2>
      </div>
      <div>
        <p>{post.meta.author_name}</p>
        <div className={styles.imgWrapper}>
          <img src={post.attachment_image?.img_src[0]} alt={post.title} />
        </div>
      </div>
    </a>
  )
}

export default PostPreview
