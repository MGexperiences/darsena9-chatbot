export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycby9qjupSzJF8eCduOmZPYG5MVI9h5l8RxmRS6Qj61AYN1zeqIoZQEK5CzauoH8udUHD5w/exec";

  try {
    const response = await fetch(SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "getReservation" }),
      redirect: "follow",
    });
    const text = await response.text();
    const data = JSON.parse(text);
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
