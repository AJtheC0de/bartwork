import { validateContact } from "@/lib/contact";

/**
 * Contact delivery.
 *
 * Sends via Resend's HTTP API (https://resend.com) when configured:
 *   RESEND_API_KEY      — API key
 *   CONTACT_TO_EMAIL    — where enquiries are delivered (Blerta's inbox)
 *   CONTACT_FROM_EMAIL  — a verified sender, e.g. "Blerta website <hello@your-domain>"
 *
 * If not configured, it responds 503 and the form tells the visitor
 * honestly — it never pretends a message was sent.
 */

// Basic in-memory throttle (per server instance). Swap for a shared store
// (e.g. Upstash) if the site sees abuse.
const hits = new Map<string, { n: number; t: number }>();
const WINDOW = 10 * 60 * 1000;
const MAX = 5;

function throttled(key: string) {
  const now = Date.now();
  const h = hits.get(key);
  if (!h || now - h.t > WINDOW) {
    hits.set(key, { n: 1, t: now });
    return false;
  }
  h.n += 1;
  return h.n > MAX;
}

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "invalid_request" }, { status: 400 });
  }

  // Honeypot: real visitors never fill this hidden field.
  if (typeof body.website === "string" && body.website.length > 0) {
    return Response.json({ ok: false, error: "rejected" }, { status: 400 });
  }

  const { data, errors } = validateContact(body);
  if (!data) return Response.json({ ok: false, error: "validation", errors }, { status: 422 });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (throttled(ip)) {
    return Response.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!key || !to || !from) {
    return Response.json({ ok: false, error: "not_configured" }, { status: 503 });
  }

  const html = `
    <p><strong>From:</strong> ${escape(data.name)} &lt;${escape(data.email)}&gt;</p>
    <p><strong>Subject:</strong> ${escape(data.subject)}</p>
    <hr />
    <p style="white-space:pre-wrap">${escape(data.message)}</p>
  `;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: to.split(",").map((s) => s.trim()),
        reply_to: data.email,
        subject: `Website enquiry — ${data.subject}`,
        text: `From: ${data.name} <${data.email}>\nSubject: ${data.subject}\n\n${data.message}`,
        html,
      }),
    });
    if (!res.ok) {
      console.error("[contact] delivery failed", res.status, await res.text().catch(() => ""));
      return Response.json({ ok: false, error: "delivery_failed" }, { status: 502 });
    }
  } catch (err) {
    console.error("[contact] delivery error", err);
    return Response.json({ ok: false, error: "delivery_failed" }, { status: 502 });
  }

  return Response.json({ ok: true });
}
