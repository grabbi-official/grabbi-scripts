// POST {pass, ref, action: capture|release|refresh} — staff only (dashboard passcode)
const { rpc, stripe, secret, pennies, pounds, send, body } = require("./_lib");
const { sync } = require("./confirm");

module.exports = async (req, res) => {
  if (req.method !== "POST") return send(res, 405, { error: "POST only" });
  try {
    const { pass, ref, action } = await body(req);
    const err = await rpc("server_meat_admin_check", { secret: secret(), pass });
    if (err) return send(res, 401, { error: err });
    let o = await rpc("server_meat_order", { secret: secret(), ref });

    if (action === "refresh") {
      if (!o.stripe_session_id) return send(res, 200, { order: o, message: "Customer has not opened the card page yet" });
      o = await sync(ref, o.stripe_session_id);
      return send(res, 200, { order: o });
    }
    if (!o.stripe_pi || o.payment_status !== "authorised") return send(res, 400, { error: "No card hold to " + action });

    if (action === "capture") {
      const due = pennies(o.final_total != null ? o.final_total : o.total);
      const held = pennies(o.amount_authorised);
      const take = Math.min(due, held);
      if (take <= 0) return send(res, 400, { error: "Nothing to charge — release the hold instead" });
      const pi = await stripe(`payment_intents/${o.stripe_pi}/capture`, { amount_to_capture: take });
      o = await rpc("server_meat_payment", { secret: secret(), ref, data: { payment_status: "captured", amount_captured: pounds(pi.amount_received) } });
      const short = due - take;
      return send(res, 200, { order: o, message: short > 0
        ? `Charged £${(take/100).toFixed(2)}. £${(short/100).toFixed(2)} is over the hold — collect it on collection/delivery.`
        : `Charged £${(take/100).toFixed(2)}. Rest of the hold released.` });
    }
    if (action === "release") {
      await stripe(`payment_intents/${o.stripe_pi}/cancel`, {});
      o = await rpc("server_meat_payment", { secret: secret(), ref, data: { payment_status: "released" } });
      return send(res, 200, { order: o, message: "Card hold released. Customer was not charged." });
    }
    send(res, 400, { error: "Unknown action" });
  } catch (e) { send(res, e.code === "NO_STRIPE" ? 503 : 500, { error: e.message }); }
};
