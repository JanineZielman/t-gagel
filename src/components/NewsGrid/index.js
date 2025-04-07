import styles from "./NewsGrid.module.scss"
import NewsItem from "./NewsItem"
import Masonry from "react-masonry-css"

const NewsGrid = ({ posts }) => {
  const breakpointColumns = {
    default: 4, // Default number of columns
    1100: 3, // At 1100px viewport width, switch to 3 columns
    700: 2, // At 700px viewport width, switch to 2 columns
    500: 1, // At 500px viewport width, switch to 1 column
  }

  return (
    <div className={styles.newsGridContainer}>
      {posts.length > 0 ? (
        <Masonry
          breakpointCols={breakpointColumns}
          className={styles.newsGrid}
          columnClassName={styles.newsGridColumn}
        >
          {posts.map((post, i) => (
            <NewsItem key={i} post={post} />
          ))}
        </Masonry>
      ) : (
        <p>No posts to show, try adjusting your selection.</p>
      )}
    </div>
  )
}

export default NewsGrid
