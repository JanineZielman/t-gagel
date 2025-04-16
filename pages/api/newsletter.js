export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end("Method not allowed")

  const { email } = req.body

  try {
    const response = await fetch("https://api.emailoctopus.com/lists/769e13c0-19fc-11f0-bc0a-d5788de4ad95/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.EMAILOCTOPUS_API_KEY}`,
      },
      body: JSON.stringify({
        EmailAddress: email,
        tags: ["newsletter"],
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return res.status(response.status).json({ error: data })
    }

    return res.status(200).json({ success: true })
  } catch (error) {
    console.error("API error:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
}
