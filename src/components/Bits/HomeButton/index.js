import React from "react"
import styles from "./HomeButton.module.scss"
import Link from "next/link"

const HomeButton = ({ children }) => {
  return (
    <div className={styles.homeButton}>
      <Link prefetch={true} href="/">
        <div className={styles.logo}>
          <div className={styles.maskImg}></div>
        </div>
      </Link>
    </div>
  )
}

export default HomeButton
