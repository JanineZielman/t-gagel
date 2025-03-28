import React, { useState } from "react"
import styles from "./Newsletter.module.scss"

const Newsletter = ({ title = "Schrijf je in voor onze nieuwsbrief" }) => {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    // Placeholder for future Mailchimp integration
    setStatus("success")
    setEmail("")
  }

  return (
    <div className={styles.newsletter}>
      <h3 className={styles.title}>{title}</h3>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Jouw emailadres"
          className={styles.input}
          required
        />
        <button type="submit" className={styles.button}>
          Aanmelden
        </button>
      </form>
      {status === "success" && (
        <p className={styles.success}>Bedankt voor je aanmelding!</p>
      )}
    </div>
  )
}

export default Newsletter
