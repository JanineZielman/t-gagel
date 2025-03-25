import Link from "next/link"
import styles from "./ArchiveMenu.module.scss"
import Toggle from "../Bits/Toggle"
import { HomeButton } from "../Bits/HomeButton"

const ArchiveMenu = ({
  categories,
  selectedCategories,
  handleCategoryChange,
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
      <div className={styles.subMenuTitle}>Categorien</div>
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
  )
}

export default ArchiveMenu