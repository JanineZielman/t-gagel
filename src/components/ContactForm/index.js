import React, { useState } from "react"
import styles from "./ContactForm.module.scss"

const ContactForm = ({ backgroundColor, textColor }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    contactPerson: "",
    message: "",
  })
  const [status, setStatus] = useState("")

  const contactPersons = [
    { value: "", label: "Selecteer een persoon" },
    { value: "daan", label: "Daan" },
    { value: "anne", label: "Anne" },
    { value: "ricardo", label: "Ricardo" },
    { value: "algemeen", label: "Algemeen" },
    { value: "roos", label: "Roos" },
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const mailChimp ="us4-c5688ad997-c79d500b22@inbound.mailchimpapp.net"

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would typically send the form data to your backend
    console.log("Form submitted:", formData)
    setStatus("success")
    setFormData({
      name: "",
      email: "",
      phone: "",
      contactPerson: "",
      message: "",
    })
  }

  // Custom style with CSS variables
  const customStyle = {
    "--form-background-color": backgroundColor || "var(--grey)",
    "--form-text-color": textColor || "var(--text-color)",
  }

  return (
    <div id="form" className={styles.contactForm} style={customStyle}>
      <h3 className={styles.title}>Neem contact met ons op</h3>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Naam"
          className={styles.input}
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="E-mailadres"
          className={styles.input}
          required
        />
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Telefoonnummer"
          className={styles.input}
          required
        />
        <select
          name="contactPerson"
          value={formData.contactPerson}
          onChange={handleChange}
          className={styles.select}
          required
        >
          {contactPersons.map((person) => (
            <option key={person.value} value={person.value}>
              {person.label}
            </option>
          ))}
        </select>
        <textarea
          name="message"
          value={formData.message}
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
  )
}

export default ContactForm
