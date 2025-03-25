import React from "react"
import { useRouter } from "next/router"
import styles from "./ArchiveButton.module.scss"
import { useState } from "react"

const ArchiveButton = () => {
  const router = useRouter()
  const [isAnimating, setIsAnimating] = useState(false)

  const handleArchiveClick = () => {
    setIsAnimating(true)
    setTimeout(() => {
      router.push("/archive")
    }, 200)
  }

  return (
    <div
      className={`${styles.archiveButton} ${isAnimating ? styles.animate : ""}`}
      onClick={handleArchiveClick}
      role="button"
      tabIndex={0}
    >
      <span className={styles.archiveText}>
        Levend <br></br>Archief
      </span>
    </div>
  )
}

export default ArchiveButton;
