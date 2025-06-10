import React, { useState } from "react"
import styles from "./Newsletter.module.scss"

const Newsletter = ({ title = "Schrijf je in voor onze nieuwsbrief" }) => {
  const [status, setStatus] = useState("")

  const handleSubmit = async (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const email = formData.get("EmailAddress")
  
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })
  
      if (response.ok) {
        setStatus("success")
      } else {
        const error = await response.json()
        console.error("Error:", error)
        if (error.error.detail == "List contact already exists.") {
          setStatus("success")
        } else {
          setStatus("error")
        }
      }
    } catch (error) {
      if (error.error.detail == "List contact already exists.") {
        setStatus("success")
      } else {
        setStatus("error")
      }
    }
  }
  
  

  return (
    <div className={styles.newsletter}>
      <h3 className={styles.title}>{title}</h3>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="email"
          name="EmailAddress"
          className={`${styles.input} required email`}
          placeholder="Jouw emailadres"
          required
        />
        <button type="submit" name="subscribe" className={styles.button}>
          Aanmelden
        </button>
      </form>
      {status === "success" && (
        <h3 className={styles.success}>Bedankt voor je aanmelding!</h3>
      )}
      {status === "error" && (
        <h3 className={styles.error}>Er ging iets mis. Probeer het opnieuw.</h3>
      )}
    </div>
  )
}

export default Newsletter
