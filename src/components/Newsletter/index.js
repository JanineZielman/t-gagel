import React, { useState } from "react"
import styles from "./Newsletter.module.scss"

const Newsletter = ({ title = "Schrijf je in voor onze nieuwsbrief" }) => {
  const [status, setStatus] = useState("")

  const handleSubmit = async (event) => {
    event.preventDefault() // Voorkom standaard formulierverzending

    const formData = new FormData(event.target)
    const queryString = new URLSearchParams(formData).toString()

    const mailchimpURL = `${process.env.NEXT_PUBLIC_MAILCHIMP_URL}&${queryString}`

    try {
      await fetch(mailchimpURL, { method: "GET", mode: "no-cors" })
      setStatus("success")
      window.location.href = "/bedankt" // Changed to relative path
    } catch (error) {
      console.error("Fout bij inschrijven:", error)
      setStatus("error")
    }
  }

  return (
    <div className={styles.newsletter}>
      <h3 className={styles.title}>{title}</h3>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="email"
          name="EMAIL"
          className={`${styles.input} required email`}
          placeholder="Jouw emailadres"
          required
        />
        <div hidden>
          <input
            type="hidden"
            name="tags"
            value={process.env.NEXT_PUBLIC_MAILCHIMP_TAGS}
          />
        </div>
        <div
          aria-hidden="true"
          style={{ position: "absolute", left: "-5000px" }}
        >
          <input
            type="text"
            name="b_c8a4e653405eafb1be9b41933_29f8949238"
            tabIndex="-1"
          />
        </div>
        <button type="submit" name="subscribe" className={styles.button}>
          Aanmelden
        </button>
      </form>
      {status === "success" && (
        <p className={styles.success}>Bedankt voor je aanmelding!</p>
      )}
      {status === "error" && (
        <p className={styles.error}>Er ging iets mis. Probeer het opnieuw.</p>
      )}
    </div>
  )
}

export default Newsletter
