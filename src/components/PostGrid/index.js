import styles from "./PostGrid.module.scss"
import PostPreview from "../PostPreview"

const PostGrid = ({ posts, selectedCategories }) => {

  return (
    <div className={styles.postGrid}>
      {posts.length > 0 ? (
        posts.map((item, i) => (
          <PostPreview
            key={i}
            post={item}
            selectedCategories={selectedCategories}
          />
        ))
      ) : (
        <p>No posts to show, try adjusting your selection.</p>
      )}
    </div>
  )
}

export default PostGrid
