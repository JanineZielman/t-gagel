import styles from "./NewsGrid.module.scss"

export default function NewsItem({ post }) {
  return (
    <a
      className={styles.newsItem}
      href={`/posts/${
        post.slug
      }?categories=${post.categories[0].name.toLowerCase()}`}
    >
      <div className={styles.imgWrapper}>
        <img src={post.attachment_image?.img_src[0]} alt={post.title} />
      </div>

      <div className={styles.postHeader}>
        <div className={styles.title}>{post.title}</div>
      </div>

      <div className={styles.date}>15.02.2025</div>

      <div className={styles.text}>
        Wilderland staat als geen ander open voor de teelt van inheemse
        meerjarige planten die in het landschap van ‘t Gagel thuishoren: zoals
        moerasspirea en natuurlijk wilde gagel! Ze maken heerlijke thee en
        andere producten van wat het landschap wil brengen. We kijken er enorm
        naar uit samen nog veel meer mensen te laten genieten van de geuren en
        smaken van ‘t Gagel!
      </div>

      <div className={styles.tags}>
        {post.categories.map((category, index) => (
          <span key={index} className={styles.tag}>
            {category.name}
          </span>
        ))}
      </div>
    </a>
  )
}
