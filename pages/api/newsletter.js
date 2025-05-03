export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end("Method not allowed");

  const { email } = req.body;

  try {
    const response = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY, // Use your Brevo API key here
      },
      body: JSON.stringify({
        email: email,
        listIds: [8],
        updateEnabled: true, // Updates contact if they already exist
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
