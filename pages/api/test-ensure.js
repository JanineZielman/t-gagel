// import ensureBrevoList from "@/utils/ensureBrevoList"
import ensureBrevoList from "../../src/utils/ensureBrevoList"

export default async function handler(req, res) {
  try {
    const formRes = await fetch(
      `${process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL}/wp-json/wp/v2/inschrijfformulier/3857`,
    )
    const form = await formRes.json()
    const listId = await ensureBrevoList(form)
    res.status(200).json({ listId })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}
