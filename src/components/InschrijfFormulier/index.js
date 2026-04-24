import React, { useState, useEffect } from "react"
import styles from "./InschrijfFormulier.module.scss"

const InschrijfFormulier = ({ form }) => {
  const [status, setStatus] = useState("idle") // idle | submitting | success | error | vol
  const [errorMessage, setErrorMessage] = useState("")
  const [capacity, setCapacity] = useState(null) // { count, max }

  const [voornaam, setVoornaam] = useState("")
  const [achternaam, setAchternaam] = useState("")
  const [email, setEmail] = useState("")
  const [nieuwsbrief, setNieuwsbrief] = useState(false)
  const [customValues, setCustomValues] = useState(() =>
    (form?.acf?.form_velden || []).map(() => "")
  )

  useEffect(() => {
    if (!form?.id) return
    fetch(`/api/inschrijven-count?formId=${form.id}`)
      .then((r) => r.json())
      .then((data) => {
        setCapacity(data)
        if (data.max && data.count >= data.max) {
          setStatus("vol")
        }
      })
      .catch(() => {
        // non-critical, ignore
      })
  }, [form?.id])

  const handleCustomChange = (index, value) => {
    setCustomValues((prev) => {
      const next = [...prev]
      next[index] = value
      return next
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus("submitting")
    setErrorMessage("")

    const velden = form?.acf?.form_velden || []
    const customFields = velden.map((field, i) => ({
      label: field.label,
      type: field.type,
      value: field.type === "checkbox" ? customValues[i] === true || customValues[i] === "true" : customValues[i],
    }))

    try {
      const res = await fetch("/api/inschrijven", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          formId: form.id,
          voornaam,
          achternaam,
          email,
          nieuwsbrief,
          customFields,
        }),
      })

      if (res.ok) {
        setStatus("success")
        return
      }

      const data = await res.json().catch(() => ({}))

      if (res.status === 409 && data.vol) {
        setStatus("vol")
        return
      }

      if (res.status === 400 && data.error) {
        setErrorMessage(data.error)
        setStatus("error")
        return
      }

      setErrorMessage("Er ging iets mis, probeer het later opnieuw.")
      setStatus("error")
    } catch {
      setErrorMessage("Er ging iets mis, probeer het later opnieuw.")
      setStatus("error")
    }
  }

  if (status === "success") {
    return (
      <div className={styles.inschrijfFormulier}>
        <div className={styles.success}>
          <p>Bedankt voor je inschrijving! Je ontvangt een bevestiging per e-mail.</p>
        </div>
      </div>
    )
  }

  const velden = form?.acf?.form_velden || []
  const showNieuwsbrief = form?.acf?.form_show_nieuwsbrief === true
  const isVol = status === "vol"
  const isSubmitting = status === "submitting"

  return (
    <div className={styles.inschrijfFormulier}>
      <h3 className={styles.title}>{form?.title?.rendered || "Inschrijven"}</h3>

      {capacity?.max && (
        <p className={styles.capacity}>
          {capacity.count}/{capacity.max} plekken bezet
        </p>
      )}

      {isVol ? (
        <div className={styles.volMessage}>
          <p>Dit evenement is helaas vol.</p>
        </div>
      ) : (
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          {/* Fixed fields */}
          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="inschrijf-voornaam">
              voornaam
            </label>
            <input
              id="inschrijf-voornaam"
              className={styles.input}
              type="text"
              placeholder="voornaam"
              required
              value={voornaam}
              onChange={(e) => setVoornaam(e.target.value)}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="inschrijf-achternaam">
              achternaam
            </label>
            <input
              id="inschrijf-achternaam"
              className={styles.input}
              type="text"
              placeholder="achternaam"
              required
              value={achternaam}
              onChange={(e) => setAchternaam(e.target.value)}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="inschrijf-email">
              e-mailadres
            </label>
            <input
              id="inschrijf-email"
              className={styles.input}
              type="email"
              placeholder="e-mailadres"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Custom fields */}
          {velden.map((field, i) => {
            const fieldId = `inschrijf-field-${i}`

            if (field.type === "checkbox") {
              return (
                <div key={i} className={styles.checkboxGroup}>
                  <input
                    id={fieldId}
                    type="checkbox"
                    required={field.required}
                    checked={!!customValues[i]}
                    onChange={(e) => handleCustomChange(i, e.target.checked)}
                  />
                  <label htmlFor={fieldId}>{field.label}</label>
                </div>
              )
            }

            if (field.type === "dropdown") {
              const opties = (field.opties || "")
                .split(",")
                .map((o) => o.trim())
                .filter(Boolean)
              return (
                <div key={i} className={styles.fieldGroup}>
                  <label className={styles.label} htmlFor={fieldId}>
                    {field.label.toLowerCase()}
                  </label>
                  <select
                    id={fieldId}
                    className={styles.select}
                    required={field.required}
                    value={customValues[i]}
                    onChange={(e) => handleCustomChange(i, e.target.value)}
                  >
                    <option value="" disabled>
                      {field.label.toLowerCase()}
                    </option>
                    {opties.map((optie) => (
                      <option key={optie} value={optie}>
                        {optie}
                      </option>
                    ))}
                  </select>
                </div>
              )
            }

            if (field.type === "textarea") {
              return (
                <div key={i} className={styles.fieldGroup}>
                  <label className={styles.label} htmlFor={fieldId}>
                    {field.label.toLowerCase()}
                  </label>
                  <textarea
                    id={fieldId}
                    className={styles.textarea}
                    placeholder={field.label.toLowerCase()}
                    required={field.required}
                    value={customValues[i]}
                    onChange={(e) => handleCustomChange(i, e.target.value)}
                  />
                </div>
              )
            }

            // text | number
            return (
              <div key={i} className={styles.fieldGroup}>
                <label className={styles.label} htmlFor={fieldId}>
                  {field.label.toLowerCase()}
                </label>
                <input
                  id={fieldId}
                  className={styles.input}
                  type={field.type === "number" ? "number" : "text"}
                  placeholder={field.label.toLowerCase()}
                  required={field.required}
                  value={customValues[i]}
                  onChange={(e) => handleCustomChange(i, e.target.value)}
                />
              </div>
            )
          })}

          {/* Newsletter */}
          {showNieuwsbrief && (
            <div className={styles.checkboxGroup}>
              <input
                id="inschrijf-nieuwsbrief"
                type="checkbox"
                checked={nieuwsbrief}
                onChange={(e) => setNieuwsbrief(e.target.checked)}
              />
              <label htmlFor="inschrijf-nieuwsbrief">
                ik wil me ook inschrijven voor de nieuwsbrief
              </label>
            </div>
          )}

          {status === "error" && (
            <p className={styles.errorMessage}>{errorMessage}</p>
          )}

          <button
            className={styles.button}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "versturen…" : "inschrijven"}
          </button>
        </form>
      )}
    </div>
  )
}

export default InschrijfFormulier
