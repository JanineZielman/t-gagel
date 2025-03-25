export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).send("Missing image URL");

  try {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();

    res.setHeader("Content-Type", "image/png");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.send(Buffer.from(buffer));
  } catch (error) {
    res.status(500).send("Error fetching image");
  }
}
