"use client"
import { useEffect } from "react"
import styles from "./campingBoeken.module.scss"

export default function Component() {
  useEffect(() => {
    // Load Tommy widget script
    const script = document.createElement("script")
    script.src =
      "https://api.tommybookingsupport.com/widgets/zoekenboek/js/init.js"
    script.async = true
    document.body.appendChild(script)

    return () => {
      // Cleanup on unmount
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [])

  return (
    <div className={styles.container}>
      <tommy-widget
        data-widget="mini"
        data-api-token="GagelLochem:6501dc199c514235a989b6e8c637137cc3a99211b139a3ce8c2d6229863507b7"
        data-language="nl"
      />

      <tommy-widget
        data-widget="default"
        data-api-token="GagelLochem:6501dc199c514235a989b6e8c637137cc3a99211b139a3ce8c2d6229863507b7"
        data-language="nl"
        data-period="day"
      ></tommy-widget>

    </div>
  )
}
