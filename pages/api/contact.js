export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end("Method not allowed")

  const { EmailAddress, Name, PhoneNumber, Topic, Message } = req.body

  try {
    const response = await fetch("https://api.emailoctopus.com/lists/7af69d2a-19fc-11f0-a5f1-d5788de4ad95/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.EMAILOCTOPUS_API_KEY}`,
      },
      body: JSON.stringify({
        EmailAddress: EmailAddress,
        tags: ["contact-form"],
        fields: {
          Name,
          PhoneNumber,
          Topic,
          Message,
        },
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return res.status(response.status).json({ error: data })
    }

    return res.status(200).json({ success: true })
  } catch (error) {
    console.error("EmailOctopus API error:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
}
