import React, { useState, useRef } from "react"
import styles from "./ContactForm.module.scss"

const ContactForm = ({ backgroundColor, textColor }) => {
  const formLoadTime = useRef(Date.now())
  const [honeypot, setHoneypot] = useState("")
  const [fields, setFields] = useState({
    naam: "",
    email: "",
    telefoonnummer: "",
    topic: "",
    message: "",
  })
  const [status, setStatus] = useState(null) // null | "loading" | "success" | "error"
  const [errorMsg, setErrorMsg] = useState("")

  const customStyle = {
    "--form-background-color": backgroundColor || "var(--grey)",
    "--form-text-color": textColor || "var(--text-color)",
  }

  const handleChange = (e) => {
    setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus("loading")
    setErrorMsg("")

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...fields,
          website_url: honeypot,
          formLoadTime: formLoadTime.current,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setErrorMsg(data.error || "Er ging iets mis, probeer het later opnieuw")
        setStatus("error")
      } else {
        setStatus("success")
      }
    } catch {
      setErrorMsg("Er ging iets mis, probeer het later opnieuw")
      setStatus("error")
    }
  }

  return (
    <div className="form-wrapper">
      <div id="form" className={styles.contactForm} style={customStyle}>
        <h3 className={styles.title}>Neem contact met ons op</h3>

        {status === "success" ? (
          <p className={styles.success}>Je bericht is verzonden!</p>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <input
              className={styles.input}
              type="text"
              name="naam"
              placeholder="Naam"
              value={fields.naam}
              onChange={handleChange}
              required
            />
            <input
              className={styles.input}
              type="email"
              name="email"
              placeholder="E-mailadres"
              value={fields.email}
              onChange={handleChange}
              required
            />
            <input
              className={styles.input}
              type="tel"
              name="telefoonnummer"
              placeholder="Telefoonnummer"
              value={fields.telefoonnummer}
              onChange={handleChange}
              required
            />
            <select
              className={styles.select}
              name="topic"
              value={fields.topic}
              onChange={handleChange}
              required
            >
              <option value="" disabled>onderwerp</option>
              <option value="groenteabonnement">groenteabonnement</option>
              <option value="rondleiding">rondleiding</option>
              <option value="huren">huren</option>
              <option value="programma-op-maat">programma op maat</option>
              <option value="cursus">cursus</option>
              <option value="investeren">investeren</option>
              <option value="samenwerken">samenwerken</option>
              <option value="vrijwilligerswerk-stage">vrijwilligerswerk of stage</option>
              <option value="overig">overige vraag</option>
              <option value="boomkwekerij">boomkwekerij</option>
              <option value="overnachten">overnachten</option>
              <option value="residenties">residenties</option>
            </select>
            <textarea
              className={styles.textarea}
              name="message"
              placeholder="bericht"
              value={fields.message}
              onChange={handleChange}
              required
            />

            {status === "error" && (
              <p className={styles.error}>{errorMsg}</p>
            )}

            <button
              className={styles.button}
              type="submit"
              disabled={status === "loading"}
            >
              {status === "loading" ? "Versturen..." : "Versturen"}
            </button>

            {/* Honeypot — hidden from real users, filled by bots */}
            <input
              type="text"
              name="website_url"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex="-1"
              autoComplete="off"
              aria-hidden="true"
              style={{ position: "absolute", left: "-9999px", opacity: 0, pointerEvents: "none" }}
            />
          </form>
        )}
      </div>
    </div>
  )
}

export default ContactForm
