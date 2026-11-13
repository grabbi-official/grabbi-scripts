// POST {ref} -> Stripe Checkout (card is held, charged later for the actual weight)
const { rpc, stripe, secret, pennies, send, body, origin, HOLD_MARGIN } = require("./_lib");

module.exports = async (req, res) => {
  if (req.method !== "POST") return send(res, 405, { error: "POST only" });
  try {
    const { ref } = await body(req);
    if (!/^GRB-\d{6}-[A-F0-9]{4}$/.test(ref || "")) return send(res, 400, { error: "Bad order reference" });
    const o = await rpc("server_meat_order", { secret: secret(), ref });
    if (o.payment_method !== "card") return send(res, 400, { error: "This order is set to pay on collection" });
    if (!["awaiting_card", "failed"].includes(o.payment_status)) return send(res, 400, { error: "This order is already paid" });

    const hold = Math.ceil(pennies(o.total) * HOLD_MARGIN);
    const base = origin(req);
    const s = await stripe("checkout/sessions", {
      mode: "payment",
      customer_email: o.email || undefined,
      client_reference_id: ref,
      metadata: { order_ref: ref },
      line_items: { 0: { quantity: 1, price_data: { currency: "gbp", unit_amount: hold,
        product_data: { name: `Grabbi Butchery trade order ${ref}`,
          description: `Estimate £${Number(o.total).toFixed(2)} + 10% weight allowance. You pay only for the final weighed amount.` } } } },
      payment_intent_data: { capture_method: "manual", description: `Grabbi Butchery ${ref} — ${o.business_name || o.customer_name}`, metadata: { order_ref: ref } },
      custom_text: { submit: { message: "Your card is held, not charged. We charge only the final weighed amount when your order is cut." } },
      success_url: `${base}/?paid=${ref}&sid={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/?unpaid=${ref}`,
      expires_at: Math.floor(Date.now() / 1000) + 60 * 60,
    });
    await rpc("server_meat_payment", { secret: secret(), ref, data: { stripe_session_id: s.id, payment_status: "awaiting_card" } });
    send(res, 200, { url: s.url });
  } catch (e) {
    send(res, e.code === "NO_STRIPE" ? 503 : 500, { error: e.message });
  }
};
