import { useState } from "react"
import Link from "next/link"
import styles from "./LeftHeader.module.scss"
import { flatListToHierarchical } from "@faustwp/core"

export default function Header({
  title = "Headless by WP Engine",
  description,
  menuItems,
}) {
  const [isNavShown, setIsNavShown] = useState(false)
  const hierarchicalMenuItems = flatListToHierarchical(menuItems)

  return (
    <header className={`${styles.header} ${isNavShown ? styles.show : ""}`}>
      <div
        className={styles.arrow}
        onClick={() => setIsNavShown(!isNavShown)}
      ></div>
      <div className={styles.menuItems}></div>
    </header>
  )
}
