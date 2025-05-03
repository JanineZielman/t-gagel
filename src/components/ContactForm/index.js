import React, { useState } from "react"
import styles from "./ContactForm.module.scss"
import { useEffect } from "react"
import Head from "next/head"

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

  useEffect(() => {
    window.REQUIRED_CODE_ERROR_MESSAGE = "Please choose a country code"
    window.LOCALE = "en"
    window.EMAIL_INVALID_MESSAGE = window.SMS_INVALID_MESSAGE =
      "The information provided is invalid. Please review the field format and try again."
    window.REQUIRED_ERROR_MESSAGE = "This field cannot be left blank."
    window.GENERIC_INVALID_MESSAGE =
      "The information provided is invalid. Please review the field format and try again."

    window.translation = {
      common: {
        selectedList: "{quantity} list selected",
        selectedLists: "{quantity} lists selected",
      },
    }

    const form = document.getElementById("sib-form")
    if (!form) return

    const button = form.querySelector("button[type='submit']")

    const validateForm = () => {
      const inputs = form.querySelectorAll(
        "input[required], select[required], textarea[required]"
      )
      let isValid = true

      inputs.forEach((input) => {
        if (!input.value.trim()) {
          isValid = false
        }
      })

      if (button) {
        button.disabled = !isValid
      }
    }

    form.addEventListener("input", validateForm)
    form.addEventListener("change", validateForm)
    validateForm()

    return () => {
      form.removeEventListener("input", validateForm)
      form.removeEventListener("change", validateForm)
    }
  }, [])

  return (
    <div className="form-wrapper">
      <Head>
        <link
          rel="stylesheet"
          href="https://sibforms.com/forms/end-form/build/sib-styles.css"
        />
        <script
          defer
          src="https://sibforms.com/forms/end-form/build/main.js"
        ></script>
      </Head>
      <div id="form" className={styles.contactForm} style={customStyle}>
        <h3 className={styles.title}>Neem contact met ons op</h3>
        {/* <form onSubmit={handleSubmit} className={styles.form}> */}
        {/* <form
         className={styles.form}
          method="POST"
          data-type="subscription"
          action="https://sibforms.com/serve/MUIFALw6WliQsF6Rc-z38xxMZjG9lRJ3KL52MGlla18m_91FjJPJu_zGHTzhrUylFbkAyw-ndWc9CWhnSPViM3t4LwAMut6SYdmd8r2i9ZiGqIrSmfyBve6W0wGMDPJO6zqzSuHkldGmS98mQK6FMfG21NVPnjHN42-LGhdhexnEiNZZTpKhG9ujJFPvL7QUlO4SWdPjnbH2kw6F"
        >
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
            Bedankt voor je bericht! We nemen zo snel mogelijk contact met je
            op.
          </p>
        )} */}

        <div className="sib-form">
        {/* <div className={`sib-form ${styles.formContainer}`}> */}
          <div id="sib-form-container" className="sib-form-container">
            <div id="error-message" className="sib-form-message-panel">
              <div className="sib-form-message-panel__text sib-form-message-panel__text--center">
                <svg
                  viewBox="0 0 512 512"
                  className="sib-icon sib-notification__icon"
                >
                  <path d="M256 40c118.621 0 216 96.075 216 216 0 119.291-96.61 216-216 216-119.244 0-216-96.562-216-216 0-119.203 96.602-216 216-216m0-32C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm-11.49 120h22.979c6.823 0 12.274 5.682 11.99 12.5l-7 168c-.268 6.428-5.556 11.5-11.99 11.5h-8.979c-6.433 0-11.722-5.073-11.99-11.5l-7-168c-.283-6.818 5.167-12.5 11.99-12.5zM256 340c-15.464 0-28 12.536-28 28s12.536 28 28 28 28-12.536 28-28-12.536-28-28-28z" />
                </svg>
                <span className="sib-form-message-panel__inner-text">
                  Your subscription could not be saved. Please try again.
                </span>
              </div>
            </div>
            <div></div>
            <div id="success-message" className="sib-form-message-panel">
              <div className="sib-form-message-panel__text sib-form-message-panel__text--center">
                <svg
                  viewBox="0 0 512 512"
                  className="sib-icon sib-notification__icon"
                >
                  <path d="M256 8C119.033 8 8 119.033 8 256s111.033 248 248 248 248-111.033 248-248S392.967 8 256 8zm0 464c-118.664 0-216-96.055-216-216 0-118.663 96.055-216 216-216 118.664 0 216 96.055 216 216 0 118.663-96.055 216-216 216zm141.63-274.961L217.15 376.071c-4.705 4.667-12.303 4.637-16.97-.068l-85.878-86.572c-4.667-4.705-4.637-12.303.068-16.97l8.52-8.451c4.705-4.667 12.303-4.637 16.97.068l68.976 69.533 163.441-162.13c4.705-4.667 12.303-4.637 16.97.068l8.451 8.52c4.668 4.705 4.637 12.303-.068 16.97z" />
                </svg>
                <span className="sib-form-message-panel__inner-text">
                  Je bericht is verzonden!
                </span>
              </div>
            </div>
            <div></div>
            <div
              id="sib-container"
              className={`sib-container--large sib-container--vertical ${styles.formContainer}`}
            >
              <form
                id="sib-form"
                method="POST"
                action="https://sibforms.com/serve/MUIFAO7V3mVBD4JnEZnlsuQ62KDpZXz3epB1W6auzsUj2OToD4Bl7S7pDYz_hQGf_UWVPJQtqbcTFUAx-5CDrENn-C9JIGp3GBkpUsrazzlSxYdt-ZiL8ENKxVMcpl6DdiGysfsEiweCh7Tc9ky-Vg2qQhQcehR-mY9CyTdMd4Uwnlk3Vs7iS-nqVZEWR8wKZTD4GeNIzgKOv4-6"
                data-type="subscription"
                className={styles.form}
              >
                <div>
                  <div className="sib-input sib-form-block">
                    <div className="form__entry entry_block">
                      <div className="form__label-row ">
                        <div className="">
                          <input
                            className="input "
                            maxlength="200"
                            type="text"
                            id="NAME"
                            name="NAME"
                            autocomplete="off"
                            placeholder="NAME"
                            data-required="true"
                            required
                          />
                        </div>
                      </div>

                      <label className="entry__error entry__error--primary"></label>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="sib-input sib-form-block">
                    <div className="form__entry entry_block">
                      <div className="form__label-row ">
                        <div className="">
                          <input
                            className="input "
                            type="text"
                            id="EMAIL"
                            name="EMAIL"
                            autocomplete="off"
                            placeholder="EMAIL"
                            data-required="true"
                            required
                          />
                        </div>
                      </div>

                      <label className="entry__error entry__error--primary"></label>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="sib-input sib-form-block">
                    <div className="form__entry entry_block">
                      <div className="form__label-row ">
                        <div className="">
                          <input
                            className="input "
                            maxlength="200"
                            type="text"
                            id="PHONENUMBER"
                            name="PHONENUMBER"
                            autocomplete="off"
                            placeholder="PHONENUMBER"
                            data-required="true"
                            required
                          />
                        </div>
                      </div>

                      <label className="entry__error entry__error--primary"></label>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="sib-input sib-form-block">
                    <div className="form__entry entry_block">
                      <div className="form__label-row ">
                        <div className="">
                          {/* <input
                            className="input "
                            maxlength="200"
                            type="text"
                            id="TOPIC"
                            name="TOPIC"
                            autocomplete="off"
                            placeholder="TOPIC"
                            data-required="true"
                            required
                          /> */}
                          <select

                            // value={formData.Topic}
                            // onChange={handleChange}
                            className={styles.select}
                            id="TOPIC"
                            name="TOPIC"
                            required
                          >
                            <option value="" disabled selected>
                              onderwerp
                            </option>
                            <option value="groenteabonnement">
                              groenteabonnement
                            </option>
                            <option value="rondleiding">rondleiding</option>
                            <option value="huren">huren</option>
                            <option value="programma-op-maat">
                              programma op maat
                            </option>
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
                        </div>
                      </div>

                      <label className="entry__error entry__error--primary"></label>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="sib-input sib-form-block">
                    <div className="form__entry entry_block">
                      <div className="form__label-row ">
                        <div className="">
                          <input
                            className="input "
                            maxlength="200"
                            type="text"
                            id="MESSAGE"
                            name="MESSAGE"
                            autocomplete="off"
                            placeholder="MESSAGE"
                            data-required="true"
                            required
                          />
                        </div>
                      </div>

                      <label className="entry__error entry__error--primary"></label>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="sib-form-block">
                    <button
                      className="sib-form-block__button sib-form-block__button-with-loader"
                      form="sib-form"
                      type="submit"
                    >
                      <svg
                        className="icon clickable__icon progress-indicator__icon sib-hide-loader-icon"
                        viewBox="0 0 512 512"
                      >
                        <path d="M460.116 373.846l-20.823-12.022c-5.541-3.199-7.54-10.159-4.663-15.874 30.137-59.886 28.343-131.652-5.386-189.946-33.641-58.394-94.896-95.833-161.827-99.676C261.028 55.961 256 50.751 256 44.352V20.309c0-6.904 5.808-12.337 12.703-11.982 83.556 4.306 160.163 50.864 202.11 123.677 42.063 72.696 44.079 162.316 6.031 236.832-3.14 6.148-10.75 8.461-16.728 5.01z" />
                      </svg>
                      Versturen
                    </button>
                  </div>
                </div>

                <input
                  type="text"
                  name="email_address_check"
                  value=""
                  className="input--hidden"
                />
                <input type="hidden" name="locale" value="en" />
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactForm
