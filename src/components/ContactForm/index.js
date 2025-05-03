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

        <div className="sib-form">
          <div id="sib-form-container" className="sib-form-container">
            <div id="error-message" className="sib-form-message-panel">
              <div className="sib-form-message-panel__text sib-form-message-panel__text--center">
                <span className="sib-form-message-panel__inner-text">
                  Je bericht kon niet verzonden worden, probeer het later opnieuw!
                </span>
              </div>
            </div>
            <div></div>
            <div id="success-message" className="sib-form-message-panel">
              <div className="sib-form-message-panel__text sib-form-message-panel__text--center">
                <span className="sib-form-message-panel__inner-text">
                  Je bericht is verzonden!
                </span>
              </div>
            </div>
            <div></div>
            <div
              id="sib-container"
              className="sib-container--large sib-container--vertical"
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
                        <div className="entry__field">
                          <input
                            className="input "
                            maxlength="200"
                            type="text"
                            id="NAME"
                            name="NAME"
                            autocomplete="off"
                            placeholder="Naam"
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
                        <div className="entry__field">
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
                        <div className="entry__field">
                          <input
                            className="input "
                            maxlength="200"
                            type="text"
                            id="PHONENUMBER"
                            name="PHONENUMBER"
                            autocomplete="off"
                            placeholder="Telefoonnummer"
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
                        <div className="entry__field">
                          <select
                            className="input "
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
                        <div className="entry__field">
                          <textarea
                            className="input textarea"
                            // maxlength="200"
                            type="text"
                            id="MESSAGE"
                            name="MESSAGE"
                            autocomplete="off"
                            placeholder="bericht"
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
