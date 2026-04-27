export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  const ICAL_URL = "https://www.airbnb.com/calendar/ical/48210576.ics?t=c26f76dc473443738550a706f1205763&locale=es-XL";
  try {
    const response = await fetch(ICAL_URL);
    if (!response.ok) throw new Error("iCal fetch failed: " + response.status);
    const text = await response.text();

    // Parsear eventos del iCal
    const events = [];
    const blocks = text.split("BEGIN:VEVENT");
    blocks.slice(1).forEach(block => {
      const get = (key) => {
        const match = block.match(new RegExp(key + "[^:]*:([^\r\n]+)"));
        return match ? match[1].trim() : "";
      };
      const dtstart = get("DTSTART");
      const dtend   = get("DTEND");
      const summary = get("SUMMARY");
      const desc    = get("DESCRIPTION");
      const uid     = get("UID");

      if (dtstart && dtend) {
        // Convertir YYYYMMDD a YYYY-MM-DD
        const fmt = d => d.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");
        events.push({
          checkin:  fmt(dtstart),
          checkout: fmt(dtend),
          summary,
          desc,
          uid
        });
      }
    });

    // Ordenar por fecha de check-in
    events.sort((a, b) => a.checkin.localeCompare(b.checkin));

    // Encontrar reserva activa (hoy está dentro del período)
    const today = new Date().toISOString().split("T")[0];
    const active = events.find(ev =>
      ev.checkin <= today &&
      ev.checkout > today &&
      !ev.summary.toLowerCase().includes("not available") &&
      !ev.summary.toLowerCase().includes("no disponible")
    );

    // Encontrar próxima reserva futura
    const upcoming = events.find(ev =>
      ev.checkin > today &&
      !ev.summary.toLowerCase().includes("not available") &&
      !ev.summary.toLowerCase().includes("no disponible")
    );

    return res.status(200).json({
      success: true,
      active,
      upcoming,
      all: events
    });

  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
