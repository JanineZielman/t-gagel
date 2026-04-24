// pages/api/inschrijven.js
//
// Handles form submissions:
// 1. Validate input
// 2. Fetch form from WP, ensure Brevo list exists
// 3. Check capacity via Brevo list size
// 4. Save full submission as an Inschrijving post in WP
// 5. Add minimal contact (email + FIRSTNAME + LASTNAME) to Brevo event list
// 6. Optionally add to newsletter list
// 7. Send confirmation email to participant
// 8. Send notification email to organizer

import ensureBrevoList from "../../src/utils/ensureBrevoList"

const BREVO_API = "https://api.brevo.com/v3"
const WP_BASE = process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    const {
      formId,
      voornaam,
      achternaam,
      email,
      nieuwsbrief,
      customFields, // array of { label, type, value }
    } = req.body || {}

    // 1. Validate
    if (!formId || !voornaam || !achternaam || !email) {
      return res.status(400).json({ error: "Verplichte velden ontbreken" })
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "Ongeldig e-mailadres" })
    }

    // 2. Fetch form + ensure list
    const form = await fetchForm(formId)
    if (!form) {
      return res.status(404).json({ error: "Formulier niet gevonden" })
    }
    const listId = await ensureBrevoList(form)

    // 3. Capacity check
    const max = toNumberOrNull(form.acf?.form_max_deelnemers)
    if (max) {
      const count = await getBrevoListCount(listId)
      if (count >= max) {
        return res
          .status(409)
          .json({ vol: true, error: "Dit evenement is vol" })
      }
    }

    // 4. Save full submission to WP
    await createInschrijving({
      formId,
      formTitle: form.title?.rendered || "",
      voornaam,
      achternaam,
      email,
      customFields: customFields || [],
      nieuwsbrief: !!nieuwsbrief,
    })

    // 5. Add minimal contact to Brevo event list
    await addContactToBrevo({
      email,
      attributes: { FIRSTNAME: voornaam, LASTNAME: achternaam },
      listIds: [listId],
    })

    // 6. Newsletter opt-in (non-blocking)
    if (nieuwsbrief === true && process.env.BREVO_NEWSLETTER_LIST_ID) {
      try {
        await addContactToBrevo({
          email,
          attributes: { FIRSTNAME: voornaam, LASTNAME: achternaam },
          listIds: [Number(process.env.BREVO_NEWSLETTER_LIST_ID)],
        })
      } catch (e) {
        console.error("Newsletter subscription failed:", e.message)
      }
    }

    // 7. Confirmation email (non-blocking)
    try {
      await sendConfirmationEmail({ form, voornaam, achternaam, email, customFields })
    } catch (e) {
      console.error("Confirmation email failed:", e.message)
    }

    // 8. Organizer notification (non-blocking)
    try {
      await sendOrganizerNotification({
        form,
        voornaam,
        achternaam,
        email,
        customFields,
        nieuwsbrief,
      })
    } catch (e) {
      console.error("Organizer notification failed:", e.message)
    }

    return res.status(200).json({ success: true })
  } catch (e) {
    console.error("Inschrijving error:", e)
    return res
      .status(500)
      .json({ error: "Er ging iets mis, probeer het later opnieuw" })
  }
}

// ----- WP write -----

async function createInschrijving({
  formId,
  formTitle,
  voornaam,
  achternaam,
  email,
  customFields,
  nieuwsbrief,
}) {
  const auth = Buffer.from(
    `${process.env.WP_USER}:${process.env.WP_APP_PASSWORD}`,
  ).toString("base64")

  // Create the post first (with title + publish status)
  const postTitle = `${voornaam} ${achternaam} - ${email}`
  const createRes = await fetch(`${WP_BASE}/wp-json/wp/v2/inschrijving`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Basic ${auth}`,
    },
    body: JSON.stringify({
      title: postTitle,
      status: "publish",
    }),
  })

  if (!createRes.ok) {
    const body = await createRes.text()
    throw new Error(
      `WP inschrijving create failed (${createRes.status}): ${body}`,
    )
  }
  const created = await createRes.json()
  const postId = created.id

  // Then set the ACF fields via the ACF endpoint
  const acfRes = await fetch(
    `${WP_BASE}/wp-json/acf/v3/inschrijving/${postId}`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({
        fields: {
          form: Number(formId),
          voornaam,
          achternaam,
          email,
          submitted_data: JSON.stringify(customFields),
          nieuwsbrief,
        },
      }),
    },
  )

  if (!acfRes.ok) {
    const body = await acfRes.text()
    throw new Error(
      `WP inschrijving ACF update failed (${acfRes.status}): ${body}`,
    )
  }

  return postId
}

// ----- Brevo -----

async function getBrevoListCount(listId) {
  const res = await fetch(`${BREVO_API}/contacts/lists/${listId}`, {
    headers: {
      "api-key": process.env.BREVO_API_KEY,
      accept: "application/json",
    },
  })
  if (!res.ok) throw new Error(`Brevo list fetch failed (${res.status})`)
  const data = await res.json()
  return data.totalSubscribers || 0
}

async function addContactToBrevo({ email, attributes, listIds }) {
  const res = await fetch(`${BREVO_API}/contacts`, {
    method: "POST",
    headers: {
      "api-key": process.env.BREVO_API_KEY,
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({ email, attributes, listIds, updateEnabled: true }),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Brevo contact add failed (${res.status}): ${body}`)
  }
}

async function sendConfirmationEmail({
  form,
  voornaam,
  achternaam,
  email,
  customFields,
}) {
  const templateId = toNumberOrNull(
    form.acf?.form_brevo_confirmation_template_id,
  )

  if (templateId) {
    const formName = form.title?.rendered || ""
    const inhoud = wpToPlainText(
      replacePlaceholders(form.acf?.form_mail_tekst || "", {
        voornaam,
        achternaam,
        email,
        form_naam: formName,
        inschrijving_datum: formatDate(new Date()),
      })
    )
    const inhoud_paragrafen = inhoud.split(/\n+/).filter(Boolean)
    await sendBrevoEmail({
      to: [{ email, name: `${voornaam} ${achternaam}` }],
      templateId,
      params: {
        voornaam,
        achternaam,
        email,
        form_naam: formName,
        inhoud,
        inhoud_paragrafen,
        inschrijving_datum: formatDate(new Date()),
        custom_fields: (customFields || []).map((f) => ({
          label: f.label || "",
          value: String(formatValue(f.value) ?? ""),
        })),
      },
    })
  } else {
    // Fallback: raw HTML from WP fields
    const subjectTemplate =
      form.acf?.form_mail_onderwerp || "Bevestiging inschrijving"
    const bodyTemplate =
      form.acf?.form_mail_tekst || "<p>Bedankt voor je inschrijving.</p>"
    const formName = form.title?.rendered || ""

    const subject = replacePlaceholders(subjectTemplate, {
      voornaam,
      achternaam,
      form_naam: formName,
    })
    const htmlContent = replacePlaceholders(bodyTemplate, {
      voornaam,
      achternaam,
      form_naam: formName,
    })

    await sendBrevoEmail({
      to: [{ email, name: `${voornaam} ${achternaam}` }],
      sender: { email: process.env.FORM_SENDER_EMAIL, name: "'t Gagel" },
      subject,
      htmlContent,
    })
  }
}

async function sendOrganizerNotification({
  form,
  voornaam,
  achternaam,
  email,
  customFields,
  nieuwsbrief,
}) {
  // Per-form organizer email, or fall back to env default
  const to =
    form.acf?.form_notification_email || process.env.FORM_NOTIFICATION_EMAIL
  if (!to) return

  const formName = form.title?.rendered || "Formulier"
  const templateId = toNumberOrNull(
    form.acf?.form_brevo_notification_template_id,
  )

  if (templateId) {
    // Send via Brevo template
    await sendBrevoEmail({
      to: [{ email: to }],
      templateId,
      params: {
        voornaam,
        achternaam,
        email,
        form_naam: formName,
        nieuwsbrief: nieuwsbrief ? "ja" : "nee",
        inschrijving_datum: formatDate(new Date()),
        custom_fields: (customFields || []).map((f) => ({
          label: f.label || "",
          value: String(formatValue(f.value) ?? ""),
        })),
        wp_admin_url: `${process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL}/wp-admin/edit.php?post_type=inschrijving`,
      },
    })
  } else {
    // Fallback: raw HTML table
    const rows = [
      row("Formulier", formName),
      row("Voornaam", voornaam),
      row("Achternaam", achternaam),
      row("Email", email),
      ...(customFields || []).map((f) => row(f.label, formatValue(f.value))),
      row("Nieuwsbrief", nieuwsbrief ? "ja" : "nee"),
    ].join("")

    const htmlContent = `
      <p>Nieuwe inschrijving voor <strong>${escapeHtml(formName)}</strong>:</p>
      <table cellpadding="6" style="border-collapse:collapse">${rows}</table>
    `

    await sendBrevoEmail({
      to: [{ email: to }],
      sender: {
        email: process.env.FORM_SENDER_EMAIL,
        name: "Gagel Inschrijvingen",
      },
      subject: `Nieuwe inschrijving: ${formName}`,
      htmlContent,
    })
  }
}

async function sendBrevoEmail(payload) {
  const res = await fetch(`${BREVO_API}/smtp/email`, {
    method: "POST",
    headers: {
      "api-key": process.env.BREVO_API_KEY,
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Brevo email send failed (${res.status}): ${body}`)
  }
}

// ----- utils -----

function isValidEmail(email) {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function toNumberOrNull(value) {
  if (value === null || value === undefined || value === "") return null
  const n = Number(value)
  return Number.isFinite(n) && n > 0 ? n : null
}

async function fetchForm(formId) {
  const res = await fetch(
    `${WP_BASE}/wp-json/wp/v2/inschrijfformulier/${formId}`,
  )
  if (!res.ok) return null
  return res.json()
}

function replacePlaceholders(template, values) {
  return Object.entries(values).reduce((acc, [key, val]) => {
    return acc.replaceAll(`{{${key}}}`, String(val ?? ""))
  }, template || "")
}

function row(label, value) {
  return `<tr><td style="border:1px solid #ddd"><strong>${escapeHtml(
    label,
  )}</strong></td><td style="border:1px solid #ddd">${escapeHtml(
    String(value ?? ""),
  )}</td></tr>`
}

function formatValue(v) {
  if (v === true) return "ja"
  if (v === false) return "nee"
  return v
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

function wpToPlainText(html) {
  return (html || "")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<p[^>]*>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&#8217;/g, "’")
    .replace(/&#8220;/g, "“")
    .replace(/&#8221;/g, "”")
    .replace(/&#8216;/g, "‘")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

function formatDate(date) {
  const months = [
    "januari", "februari", "maart", "april", "mei", "juni",
    "juli", "augustus", "september", "oktober", "november", "december",
  ]
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
}
