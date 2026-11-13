// GET -> is card payment switched on?
const { send } = require("./_lib");
module.exports = (req, res) => send(res, 200, { card: !!process.env.STRIPE_SECRET_KEY });
