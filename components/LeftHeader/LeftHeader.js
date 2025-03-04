import { useState } from "react"
import Link from "next/link"
import styles from "./LeftHeader.module.scss"
import { flatListToHierarchical } from "@faustwp/core"

export default function LeftHeader({ children }) {
  const [isNavShown, setIsNavShown] = useState(false)

  return (
    <header className={`${styles.header} ${isNavShown ? styles.show : ""}`}>
      <div
        className={styles.arrow}
        onClick={() => setIsNavShown(!isNavShown)}
      ></div>
      {/* <div className={styles.menuItems}></div> */}
      {children}
    </header>
  )
}
