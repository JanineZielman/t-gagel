import styles from "./PostPreview.module.scss"

const PostPreview = ({ post, selectedCategories, current }) => {
  const category = post.categories[0].name;
  const queryParams =
    selectedCategories?.length > 0
      ? { categories: selectedCategories.join(",") }
      : category.toLowerCase()

  return (
    <a
      className={`${styles.postPreview} post-item ${current ? current : category.toLowerCase()}`}
      href={`/archive/${post.slug}?categories=${queryParams}`}
    >
      <div>
        <span className={styles.category}>{category}</span>
        <h2  dangerouslySetInnerHTML={{ __html: post.title }}/>
      </div>
      <div>
        <p>{post.meta ? post.meta.author_name : post.author}</p>
        <div className={styles.imgWrapper}>
          <img src={post.attachment_image ? post.attachment_image.img_src[0] : post.thumbnail} alt={post.title} />
        </div>
      </div>
    </a>
  )
}

export default PostPreview
