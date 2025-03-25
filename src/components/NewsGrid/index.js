import styles from "./NewsGrid.module.scss"
import NewsItem from "./NewsItem"

const NewsGrid = ({ posts }) => {
  console.log(posts)
  return (
    <>
      <div className={styles.newsGridContainer}>
        <h2>Actueel</h2>
        <div className={styles.newsGrid}>
          {posts.length > 0 ? (
            posts.map((post, i) => <NewsItem key={i} post={post} />)
          ) : (
            <p>No posts to show, try adjusting your selection.</p>
          )}
        </div>
      </div>
    </>
  )
}

export default NewsGrid