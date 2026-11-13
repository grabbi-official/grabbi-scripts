// Shared helpers for the butchery Vercel functions (no dependencies).
const SB = "https://qahpwpwncqiwwivmtdyr.supabase.co";
const SB_KEY = "sb_publishable_34SwXJPoxQGgdDkbu9Qx_Q_52UGazxI"; // public key, same as the website

async function rpc(fn, args) {
  const r = await fetch(`${SB}/rest/v1/rpc/${fn}`, {
    method: "POST",
    headers: { apikey: SB_KEY, Authorization: "Bearer " + SB_KEY, "Content-Type": "application/json" },
    body: JSON.stringify(args),
  });
  const j = await r.json().catch(() => null);
  if (!r.ok) throw new Error((j && (j.message || j.hint)) || "Database error");
  return j;
}

function form(obj, prefix, out = []) {
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null) continue;
    const key = prefix ? `${prefix}[${k}]` : k;
    if (typeof v === "object") form(v, key, out);
    else out.push(encodeURIComponent(key) + "=" + encodeURIComponent(String(v)));
  }
  return out.join("&");
}

async function stripe(path, params, method = "POST") {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) { const e = new Error("Card payments are not switched on yet"); e.code = "NO_STRIPE"; throw e; }
  const url = "https://api.stripe.com/v1/" + path + (method === "GET" && params ? "?" + form(params) : "");
  const r = await fetch(url, {
    method,
    headers: { Authorization: "Bearer " + key, "Content-Type": "application/x-www-form-urlencoded" },
    body: method === "GET" ? undefined : form(params || {}),
  });
  const j = await r.json();
  if (!r.ok) throw new Error((j.error && j.error.message) || "Stripe error");
  return j;
}

const secret = () => process.env.MEAT_SERVER_SECRET;
const pennies = (n) => Math.round(Number(n) * 100);
const pounds = (p) => Math.round(p) / 100;

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
}

async function body(req) {
  if (req.body && typeof req.body === "object") return req.body;
  let s = ""; for await (const c of req) s += c;
  try { return JSON.parse(s || "{}"); } catch { return {}; }
}

function origin(req) {
  const h = req.headers["x-forwarded-host"] || req.headers.host || "butchery.grabbi.uk";
  return (h.includes("localhost") ? "http://" : "https://") + h;
}

const HOLD_MARGIN = 1.10; // hold 10% over the estimate to cover heavier cuts

module.exports = { rpc, stripe, secret, pennies, pounds, send, body, origin, HOLD_MARGIN };
