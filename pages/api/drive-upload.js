export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzz3yaqNPRAJQvt7dohZPX91zcMasBvZ5ebNarsI0L8oPFmkWDXtGaR9ZPgcxhz0ApiNw/exec";

  try {
    const response = await fetch(SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
      redirect: "follow",
    });
    const text = await response.text();
    return res.status(200).send(text);
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
