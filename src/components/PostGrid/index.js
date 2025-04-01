import styles from "./PostGrid.module.scss"

const PostGrid = ({ posts, selectedCategories }) => {
  return (
    <div className={styles.postGrid}>
      {posts.length > 0 ? (
        posts.map((item, i) => (
          <a
            key={i}
            className={`${styles.postItem} post-item ${item.categories[0].name.toLowerCase()}`}
            href={`/archive/${item.slug}?categories=${selectedCategories?.length > 0 ? { categories: selectedCategories.join(',') } : item.categories[0].name.toLowerCase()}`}
          >
            <div>
              <span className={styles.category}>{item.categories[0].name}</span>
              <h2>{item.title}</h2>
            </div>
            <div>
              <p>{item.meta.author_name}</p>
              <div className={styles.imgWrapper}>
                <img src={item.attachment_image?.img_src[0]} />
              </div>
            </div>
          </a>
        ))
      ) : (
        <p>No posts to show, try adjusting your selection.</p>
      )}
      </div>
  );
}

export default PostGrid