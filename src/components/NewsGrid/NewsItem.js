import styles from "./NewsGrid.module.scss"

export default function NewsItem({ post }) {
  return (
    <a
      className={styles.newsItem}
      href={`/nieuws/${
        post.slug
      }?categories=${post.categories[0].name.toLowerCase()}`}
    >
      <div className={styles.imgWrapper}>
        <img src={post.attachment_image?.img_src[0]} alt={post.title} />
      </div>

      <div className={styles.postHeader}>
        <div className={styles.title}  dangerouslySetInnerHTML={{ __html: post.title }}/>
      </div>

      <div className={styles.date}>{post.date}</div>

      <div className={styles.text} dangerouslySetInnerHTML={{ __html: post.excerpt }}/>

      <div className={styles.tags}>
        {post.tags.map((tag, index) => (
          <span key={index} className={styles.tag}>
            #{tag.name}
          </span>
        ))}
      </div>
    </a>
  )
}
