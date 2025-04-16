import React, { useState } from "react"
import styles from "./Newsletter.module.scss"

const Newsletter = ({ title = "Schrijf je in voor onze nieuwsbrief" }) => {
  const [status, setStatus] = useState("")

  const handleSubmit = async (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const email = formData.get("EmailAddress")
  
    try {
      const response = await fetch("https://api.emailoctopus.com/lists/769e13c0-19fc-11f0-bc0a-d5788de4ad95/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          api_key: process.env.NEXT_PUBLIC_EMAILOCTOPUS_API_KEY,
          EmailAddress: email,
          tags: ["newsletter"],
          status: "SUBSCRIBED", // optional, defaults to "SUBSCRIBED"
        }),
      })
  
      if (response.ok) {
        setStatus("success")
      } else {
        const errorData = await response.json()
        console.error("API Error:", errorData)
        setStatus("error")
      }
    } catch (error) {
      console.error("Network error:", error)
      setStatus("error")
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
