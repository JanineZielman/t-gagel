import React, { useState } from "react"
import styles from "./Newsletter.module.scss"

const Newsletter = ({ title = "Schrijf je in voor onze nieuwsbrief" }) => {
  const [status, setStatus] = useState("")

  return (
    <div className={styles.newsletter}>
      <h3 className={styles.title}>{title}</h3>
      <form 
        action={process.env.NEXT_PUBLIC_MAILCHIMP_URL}
        method="post"
        className={styles.form}
        target="_self"
      >
        <input
          type="email"
          name="EMAIL"
          className={`${styles.input} required email`}
          placeholder="Jouw emailadres"
          required
        />
        <div hidden>
          <input type="hidden" name="tags" value={process.env.NEXT_PUBLIC_MAILCHIMP_TAGS} />
        </div>
        <div aria-hidden="true" style={{ position: 'absolute', left: '-5000px' }}>
          <input type="text" name="b_c8a4e653405eafb1be9b41933_29f8949238" tabIndex="-1" />
        </div>
        <button type="submit" name="subscribe" className={styles.button}>
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
