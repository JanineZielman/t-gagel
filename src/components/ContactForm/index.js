import React, { useState } from "react"
import styles from "./ContactForm.module.scss"

const ContactForm = ({ backgroundColor, textColor }) => {
  const [formData, setFormData] = useState({
    Name: "",
    EmailAddress: "",
    PhoneNumber: "",
    Topic: "",
    Message: "",
  })
  const [status, setStatus] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setStatus("success")
        setFormData({
          Name: "",
          EmailAddress: "",
          PhoneNumber: "",
          Topic: "",
          Message: "",
        })
      } else {
        const error = await response.json()
        console.error("Form error:", error)
        setStatus("error")
      }
    } catch (error) {
      console.error("Network error:", error)
      setStatus("error")
    }
  }

  // Custom style with CSS variables
  const customStyle = {
    "--form-background-color": backgroundColor || "var(--grey)",
    "--form-text-color": textColor || "var(--text-color)",
  }

  return (
    <div className="form-wrapper">
    <div id="form" className={styles.contactForm} style={customStyle}>
      <h3 className={styles.title}>Neem contact met ons op</h3>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          name="Name"
          value={formData.Name}
          onChange={handleChange}
          placeholder="Naam"
          className={styles.input}
          required
        />
        <input
          type="email"
          name="EmailAddress"
          value={formData.EmailAddress}
          onChange={handleChange}
          placeholder="E-mailadres"
          className={styles.input}
          required
        />
        <input
          type="tel"
          name="PhoneNumber"
          value={formData.PhoneNumber}
          onChange={handleChange}
          placeholder="Telefoonnummer"
          className={styles.input}
          required
        />
        <select
          name="Topic"
          value={formData.Topic}
          onChange={handleChange}
          className={styles.select}
          required
        >
          <option value="" disabled>
            onderwerp
          </option>
          <option value="schuur">Schuur</option>
          <option value="rondleiding">Rondleiding</option>
          <option value="lunch">Lunch</option>
          <option value="workshop">Workshop</option>
          <option value="borrel">Borrel</option>
        </select>
        <textarea
          name="Message"
          value={formData.Message}
          onChange={handleChange}
          placeholder="Je bericht"
          className={styles.textarea}
          required
        />
        <button type="submit" className={styles.button}>
          Versturen
        </button>
      </form>
      {status === "success" && (
        <p className={styles.success}>
          Bedankt voor je bericht! We nemen zo snel mogelijk contact met je op.
        </p>
      )}
    </div>
    </div>
  )
}

export default ContactForm
