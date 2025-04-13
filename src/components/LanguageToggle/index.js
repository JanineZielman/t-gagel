import { useEffect, useState } from "react"
import Toggle from "../Bits/Toggle"
import styles from "./LanguageToggle.module.scss"

const LanguageToggle = () => {
  const [isEnglish, setIsEnglish] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    // Load saved preference
    const savedLanguage = localStorage.getItem("language")
    if (savedLanguage) {
      setIsEnglish(savedLanguage === "en")
    }
  }, [])

  const handleLanguageChange = () => {
    const newLanguage = !isEnglish
    setIsEnglish(newLanguage)
    localStorage.setItem("language", newLanguage ? "en" : "nl")
  }

  return (
    <div className={styles.container} id="lang">
      <button
        className={styles.toggleButton}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isEnglish ? "EN" : "NL"}
      </button>
      <div
        className={`${styles.languageToggle} ${
          isExpanded ? styles.expanded : ""
        }`}
      >
        <span className={`${styles.label} ${!isEnglish ? styles.active : ""}`}>
          nl
        </span>
        <Toggle checked={isEnglish} onChange={handleLanguageChange} label="" />
        <span className={`${styles.label} ${isEnglish ? styles.active : ""}`}>
          eng
        </span>
        <button
          className={styles.closeButton}
          onClick={() => setIsExpanded(false)}
        >
          ×
        </button>
      </div>
    </div>
  )
}

export default LanguageToggle
