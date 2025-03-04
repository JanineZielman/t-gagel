import React from "react"
import styles from "./CallToActionButton.module.scss"
import Link from "next/link"

const CallToActionButton = ({ children, link }) => {
  return (
    <div>
    <Link prefetch={true} href={link} className={styles.callToActionButton}>
      <div className={styles.text}>{children}</div>
    </Link>
    </div>
  )
}

export default CallToActionButton
