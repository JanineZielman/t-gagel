import Link from "next/link"
import styles from "./ArchiveMenu.module.scss"
import Toggle from "../Bits/Toggle"
import LeftHeader from "../LeftHeader/LeftHeader"

export default function ArchiveMenu({
  categories,
  selectedCategories,
  handleCategoryChange,
}) {
  return (
    <div className={styles.menu}>
      <LeftHeader>
        <div>Logo</div>
        <div className={styles.subMenu}>
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
      </LeftHeader>
    </div>
  )
}
