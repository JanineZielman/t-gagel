const BREVO_API = "https://api.brevo.com/v3"

const TOPIC_ROUTES = {
  boomkwekerij: { customerTemplateId: 15, organizerTemplateId: 5, organizerEmail: "daan@gagel.nl" },
  overnachten:  { customerTemplateId: 32, organizerTemplateId: 5, organizerEmail: "camping@gagel.nl" },
  residenties:  { customerTemplateId: 15, organizerTemplateId: 5, organizerEmail: "erf@gagel.nl" },
}

const DEFAULT_ROUTE = { customerTemplateId: 15, organizerTemplateId: 5, organizerEmail: "info@gagel.nl" }

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    const { naam, email, telefoonnummer, topic, message, website_url, formLoadTime } = req.body || {}

    // Honeypot check
    if (website_url) {
      return res.status(400).json({ error: "Ongeldige inzending" })
    }

    // Timing check
    if (!formLoadTime || Date.now() - Number(formLoadTime) < 3000) {
      return res.status(400).json({ error: "Ongeldige inzending" })
    }

    // Field validation
    if (!naam || !email || !telefoonnummer || !topic || !message) {
      return res.status(400).json({ error: "Verplichte velden ontbreken" })
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "Ongeldig e-mailadres" })
    }

    const route = TOPIC_ROUTES[topic] || DEFAULT_ROUTE
    const params = {
      contact: {
        NAME: naam,
        EMAIL: email,
        PHONENUMBER: telefoonnummer,
        TOPIC: topic,
        MESSAGE: message,
      },
    }

    // Customer confirmation
    await sendBrevoEmail({
      to: [{ email, name: naam }],
      templateId: route.customerTemplateId,
      params,
    })

    // Organizer notification (non-blocking)
    try {
      await sendBrevoEmail({
        to: [{ email: route.organizerEmail }],
        templateId: route.organizerTemplateId,
        params,
      })
    } catch (e) {
      console.error("Organizer notification failed:", e.message)
    }

    return res.status(200).json({ success: true })
  } catch (e) {
    console.error("Contact form error:", e)
    return res.status(500).json({ error: "Er ging iets mis, probeer het later opnieuw" })
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

function isValidEmail(email) {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}
