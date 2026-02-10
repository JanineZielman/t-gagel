"use client"
import styles from "./campingBoeken.module.scss"
import { useEffect } from "react"
import HomeButton from "../Bits/HomeButton"

const Tommy = ({ product }) => {
  useEffect(() => {
    // Remove hash from URL to prevent auto-scroll to Tommy widget
    if (window.location.hash) {
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search,
      )
    }

    // Load Tommy widget script immediately
    const script = document.createElement("script")
    script.src = "https://api.tommybookingsupport.com/widgets/js/widget.js"
    script.type = "text/javascript"

    document.body.appendChild(script)

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [])

  console.log("Tommy Booking Product:", product)

  return (
    <div>
      <div className={styles.container} suppressHydrationWarning>
        <div
          id="TommyBookingSupport"
          data-widget="boeken"
          data-apikey="6501dc199c514235a989b6e8c637137cc3a99211b139a3ce8c2d6229863507b7"
          data-account="GagelLochem"
          data-language="nl"
          data-country="nl"
          data-accommodatie={product ? product : ""}
        ></div>
      </div>
    </div>
  )
}

export default Tommy
