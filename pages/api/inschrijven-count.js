// pages/api/inschrijven-count.js
//
// GET /api/inschrijven-count?formId=123
// Returns current count and max for a form.
//
// Used by the form component to display "X/Y plekken bezet"
// and to disable submit if full.

const BREVO_API = "https://api.brevo.com/v3"
const WP_BASE = process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const formId = Number(req.query.formId)
  if (!formId) {
    return res.status(400).json({ error: "formId is required" })
  }

  try {
    // Fetch form to get max and list ID
    const formRes = await fetch(
      `${WP_BASE}/wp-json/wp/v2/inschrijfformulier/${formId}`,
    )
    if (!formRes.ok) {
      return res.status(404).json({ error: "Formulier niet gevonden" })
    }
    const form = await formRes.json()

    const max = toNumberOrNull(form.acf?.form_max_deelnemers)
    const listId = toNumberOrNull(form.acf?.form_brevo_list_id)

    // If no list exists yet (form never loaded via a page, or just created),
    // count is 0 by definition.
    if (!listId) {
      return res.status(200).json({ count: 0, max })
    }

    const listRes = await fetch(`${BREVO_API}/contacts/lists/${listId}`, {
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        accept: "application/json",
      },
    })

    if (!listRes.ok) {
      // If Brevo fails, return 0 rather than breaking the form
      console.error(`Brevo list fetch failed (${listRes.status})`)
      return res.status(200).json({ count: 0, max })
    }

    const data = await listRes.json()
    return res.status(200).json({
      count: data.totalSubscribers || 0,
      max,
    })
  } catch (e) {
    console.error("inschrijven-count error:", e)
    return res.status(500).json({ error: "Something went wrong" })
  }
}

function toNumberOrNull(value) {
  if (value === null || value === undefined || value === "") return null
  const n = Number(value)
  return Number.isFinite(n) && n > 0 ? n : null
}
