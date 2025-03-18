import styles from "./PostGrid.module.scss"

export default function PostGrid({ filteredPosts, selectedCategories }) {
  return (
    <div className={styles.postGrid}>
      {filteredPosts.length > 0 ? (
        filteredPosts.map((item, i) => (
          <a
            key={i}
            className={`${styles.postItem} post-item ${item.node.categories.edges[0].node.name.toLowerCase()}`}
            href={`/posts/${item.node.slug}?categories=${selectedCategories.length > 0 ? { categories: selectedCategories.join(',') } : item.node.categories.edges[0].node.name.toLowerCase()}`}
          >
            <div>
              <span className={styles.category}>{item.node.categories.edges[0].node.name}</span>
              <h2>{item.node.title}</h2>
            </div>
            <div>
              <p>{item.node.author.node.name}</p>
              <div className={styles.imgWrapper}>
                <img src={item.node.featuredImage?.node.sourceUrl} />
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

