export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end("Method not allowed");

  const { email } = req.body;

  try {
    const response = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        email,
        listIds: [8],
        updateEnabled: true,
      }),
    });

    const text = await response.text(); // Get raw response body (can be JSON or not)

    let data;
    try {
      data = text ? JSON.parse(text) : {}; // Try to parse if there's content
    } catch (parseError) {
      console.error("Failed to parse response as JSON:", parseError, "Raw text:", text);
      data = { raw: text };
    }

    if (!response.ok) {
      console.error("Brevo API error:", data);
      return res.status(response.status).json({ error: data });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Fetch failed:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
