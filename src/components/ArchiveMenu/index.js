import Link from "next/link"
import styles from "./ArchiveMenu.module.scss"
import Toggle from "../Bits/Toggle"

const ArchiveMenu = ({
  categories,
  selectedCategories,
  handleCategoryChange,
  tags,
  selectedTags,
  handleTagChange,
}) => {
  return (
    <div className={styles.menu}>
      <div className={styles.homeButton}>
        <Link prefetch={true} href="/">
          <div className={styles.logo}>
            <div className={styles.maskImg}></div>
          </div>
        </Link>
      </div>
      <h2>Levend archief</h2>
      <div className={styles.toggleFlex}>
        <div className={styles.toggleWrapper}>
          <div className={styles.subMenuTitle}>categorien</div>
          <div className={styles.toggles}>
            {categories.map((category, index) => (
              <Toggle
                key={index}
                label={category.charAt(0).toUpperCase() + category.slice(1)}
                checked={selectedCategories.includes(category)}
                onChange={() => handleCategoryChange(category)}
              />
            ))}
          </div>
        </div>
        <div className={styles.toggleWrapper}>
          <div className={styles.subMenuTitle}>themas</div>
          <div className={styles.toggles}>
            {tags.map((tag, index) => (
              <Toggle
                key={index}
                label={tag.charAt(0).toUpperCase() + tag.slice(1)}
                checked={selectedTags.includes(tag)}
                onChange={() => handleTagChange(tag)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ArchiveMenu