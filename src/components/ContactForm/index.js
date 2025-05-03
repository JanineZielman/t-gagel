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
        <div className={styles.title}>
          het contactformulier is tijdelijk niet beschikbaar. Neem contact op via
          <a href="mailto:info@gagel.nl"> info@gagel.nl</a>
        </div>
        {/* <form onSubmit={handleSubmit} className={styles.form}>
          <input
            disabled
            type="text"
            name="Name"
            value={formData.Name}
            onChange={handleChange}
            placeholder="Naam"
            className={styles.input}
            required
          />
          <input
            disabled
            type="email"
            name="EmailAddress"
            value={formData.EmailAddress}
            onChange={handleChange}
            placeholder="E-mailadres"
            className={styles.input}
            required
          />
          <input
            disabled
            type="tel"
            name="PhoneNumber"
            value={formData.PhoneNumber}
            onChange={handleChange}
            placeholder="Telefoonnummer"
            className={styles.input}
            required
          />
          <select
            disabled
            name="Topic"
            value={formData.Topic}
            onChange={handleChange}
            className={styles.select}
            required
          >
            <option value="" disabled>
              onderwerp
            </option>
            <option value="groenteabonnement">groenteabonnement</option>
            <option value="rondleiding">rondleiding</option>
            <option value="huren">huren</option>
            <option value="programma-op-maat">programma op maat</option>
            <option value="cursus">cursus</option>
            <option value="investeren">investeren</option>
            <option value="samenwerken">samenwerken</option>
            <option value="vrijwilligerswerk-stage">
              vrijwilligerswerk of stage
            </option>
            <option value="overig">overige vraag</option>
            <option value="boomkwekerij">boomkwekerij</option>
            <option value="overnachten">overnachten</option>
            <option value="residenties">residenties</option>
          </select>
          <textarea
            disabled
            name="Message"
            value={formData.Message}
            onChange={handleChange}
            placeholder="Je bericht"
            className={styles.textarea}
            required
          />
          <button type="submit" className={styles.button} disabled>
            Versturen
          </button>
        </form> */}
        {status === "success" && (
          <p className={styles.success}>
            Bedankt voor je bericht! We nemen zo snel mogelijk contact met je
            op.
          </p>
        )}
      </div>
    </div>
  )
}

export default ContactForm
