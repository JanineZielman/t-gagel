import styles from "./NewsGrid.module.scss"

export default function NewsItem({ post }) {
  return (
    <a
      className={styles.newsItem}
      href={`/posts/${
        post.node.slug
      }?categories=${post.node.categories.edges[0].node.name.toLowerCase()}`}
    >
      <div className={styles.postHeader}>
        <div className={styles.date}>15 02 2025</div>
        <div className={styles.title}>{post.node.title}</div>
      </div>
      <div className={styles.imgWrapper}>
        <img src={post.node.featuredImage?.node.sourceUrl} />
        <div className={styles.description}>
          Met het warme weer afgelopen week kam de amfibieëntrek bij ons op het
          erf vol op gang!
        </div>
      </div>
    </a>
  )
}
