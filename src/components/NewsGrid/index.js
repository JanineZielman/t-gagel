import styles from "./NewsGrid.module.scss"
import NewsItem from "./NewsItem"

const NewsGrid = ({ posts }) => {

  return (
    <>
      <div className={styles.newsGridContainer}>
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