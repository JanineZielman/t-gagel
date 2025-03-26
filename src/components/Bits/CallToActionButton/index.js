import React from "react"
import styles from "./CallToActionButton.module.scss"
import Link from "next/link"

const CallToActionButton = ({ children, link }) => {
  return (
    <div className={styles.callToActionButton}>
      <Link prefetch={true} href={link}>
        <div className={styles.text}>{children}</div>
      </Link>
    </div>
  )
}

export default CallToActionButton
