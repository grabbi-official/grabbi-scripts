// POST {ref, sid} -> check the Stripe session and record the card hold
const { rpc, stripe, secret, pounds, send, body } = require("./_lib");

async function sync(ref, sid) {
  const s = await stripe("checkout/sessions/" + encodeURIComponent(sid), { expand: { 0: "payment_intent" } }, "GET");
  if ((s.metadata && s.metadata.order_ref) !== ref) throw new Error("Payment does not match this order");
  const pi = s.payment_intent;
  if (pi && pi.status === "requires_capture") {
    return rpc("server_meat_payment", { secret: secret(), ref,
      data: { payment_status: "authorised", stripe_pi: pi.id, amount_authorised: pounds(pi.amount_capturable) } });
  }
  if (pi && pi.status === "succeeded") {
    return rpc("server_meat_payment", { secret: secret(), ref,
      data: { payment_status: "captured", stripe_pi: pi.id, amount_captured: pounds(pi.amount_received) } });
  }
  return rpc("server_meat_order", { secret: secret(), ref });
}

module.exports = async (req, res) => {
  if (req.method !== "POST") return send(res, 405, { error: "POST only" });
  try {
    const { ref, sid } = await body(req);
    if (!/^GRB-\d{6}-[A-F0-9]{4}$/.test(ref || "") || !/^cs_[A-Za-z0-9_]+$/.test(sid || "")) return send(res, 400, { error: "Bad request" });
    const o = await sync(ref, sid);
    send(res, 200, { order_ref: o.order_ref, payment_status: o.payment_status, total: o.total, amount_authorised: o.amount_authorised });
  } catch (e) { send(res, 500, { error: e.message }); }
};
module.exports.sync = sync;
