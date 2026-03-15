// ============================================================
//  GRABBI BRAIN — AI Chat Widget
//  Hosted on GitHub, served via jsDelivr
//
//  ⚠️  ADD YOUR API KEY BELOW before uploading to GitHub:
//  Find: const GRABBI_API_KEY = 'YOUR_API_KEY_HERE';
//  Replace YOUR_API_KEY_HERE with your Anthropic API key
// ============================================================

(function() {

// ── INJECT FONT ──
var fontLink = document.createElement('link');
fontLink.rel = 'stylesheet';
fontLink.href = 'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800&family=Barlow:wght@400;600&display=swap';
document.head.appendChild(fontLink);

// ── INJECT STYLES ──
var style = document.createElement('style');
style.textContent = ":root{--green:#1A5C35;--lime:#B5E550;--dark:#111B14;--bg:#FAF7F0}\n\n/* FAB BUTTON */\n#gb-fab{\n  position:fixed;bottom:24px;left:20px;\n  width:56px;height:56px;border-radius:50%;\n  background:var(--green);\n  border:none;cursor:pointer;\n  box-shadow:0 6px 24px rgba(26,92,53,0.4);\n  z-index:2147483640;\n  display:flex;align-items:center;justify-content:center;\n  transition:all .25s cubic-bezier(.16,1,.3,1);\n  animation:gb-bounce 3s ease infinite;\n}\n#gb-fab:hover{transform:scale(1.1);box-shadow:0 8px 32px rgba(26,92,53,0.5)}\n#gb-fab.open{transform:scale(1);animation:none;background:var(--dark)}\n@keyframes gb-bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}\n#gb-fab svg{transition:all .25s}\n#gb-fab-badge{\n  position:absolute;top:-3px;right:-3px;\n  width:18px;height:18px;border-radius:50%;\n  background:var(--lime);color:var(--dark);\n  font-size:9px;font-weight:800;\n  display:flex;align-items:center;justify-content:center;\n  border:2px solid #fff;\n  animation:gb-ping 2s ease infinite;\n}\n@keyframes gb-ping{0%,100%{transform:scale(1)}50%{transform:scale(1.2)}}\n#gb-fab-badge.hide{display:none}\n\n/* CHAT WINDOW */\n#gb-window{\n  position:fixed;\n  bottom:92px;left:20px;\n  width:calc(100vw - 40px);\n  max-width:380px;\n  height:520px;\n  max-height:calc(100vh - 120px);\n  background:#fff;\n  border-radius:20px;\n  box-shadow:0 24px 64px rgba(17,27,20,0.2);\n  border:1px solid rgba(17,27,20,0.08);\n  z-index:2147483639;\n  display:flex;flex-direction:column;\n  overflow:hidden;\n  transform:translateY(20px) scale(0.95);\n  opacity:0;pointer-events:none;\n  transition:all .3s cubic-bezier(.16,1,.3,1);\n  transform-origin:bottom left;\n}\n#gb-window.open{\n  transform:translateY(0) scale(1);\n  opacity:1;pointer-events:all;\n}\n\n/* HEADER */\n#gb-head{\n  background:var(--dark);\n  padding:14px 16px;\n  display:flex;align-items:center;gap:12px;\n  flex-shrink:0;\n}\n#gb-avatar{\n  width:36px;height:36px;border-radius:50%;\n  background:linear-gradient(135deg,var(--green),var(--lime));\n  display:flex;align-items:center;justify-content:center;\n  font-size:18px;flex-shrink:0;\n}\n#gb-head-info{flex:1}\n#gb-head-name{\n  font-family:'Barlow Condensed',sans-serif;\n  font-weight:800;font-size:16px;text-transform:uppercase;\n  color:#fff;line-height:1;\n}\n#gb-head-status{\n  font-size:11px;color:rgba(255,255,255,0.5);\n  display:flex;align-items:center;gap:4px;margin-top:2px;\n}\n#gb-status-dot{\n  width:6px;height:6px;border-radius:50%;\n  background:#4caf50;\n  animation:gb-pulse 2s infinite;\n}\n@keyframes gb-pulse{0%,100%{opacity:1}50%{opacity:.4}}\n#gb-close{\n  background:rgba(255,255,255,0.1);border:none;\n  color:#fff;width:28px;height:28px;border-radius:50%;\n  cursor:pointer;font-size:14px;\n  display:flex;align-items:center;justify-content:center;\n  transition:background .15s;\n}\n#gb-close:hover{background:rgba(255,255,255,0.2)}\n\n/* MESSAGES */\n#gb-messages{\n  flex:1;overflow-y:auto;\n  padding:16px 14px;\n  display:flex;flex-direction:column;gap:10px;\n  scroll-behavior:smooth;\n}\n#gb-messages::-webkit-scrollbar{width:4px}\n#gb-messages::-webkit-scrollbar-track{background:transparent}\n#gb-messages::-webkit-scrollbar-thumb{background:rgba(17,27,20,0.1);border-radius:2px}\n\n.gb-msg{\n  display:flex;gap:8px;\n  animation:gb-in .3s cubic-bezier(.16,1,.3,1);\n}\n@keyframes gb-in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}\n.gb-msg.user{flex-direction:row-reverse}\n.gb-msg-avatar{\n  width:28px;height:28px;border-radius:50%;flex-shrink:0;\n  background:linear-gradient(135deg,var(--green),var(--lime));\n  display:flex;align-items:center;justify-content:center;\n  font-size:14px;margin-top:2px;\n}\n.gb-msg.user .gb-msg-avatar{\n  background:rgba(17,27,20,0.08);\n  font-size:12px;\n}\n.gb-bubble{\n  max-width:80%;\n  background:var(--bg);\n  border-radius:16px 16px 16px 4px;\n  padding:10px 14px;\n  font-size:13px;line-height:1.6;\n  color:var(--dark);\n  border:1px solid rgba(17,27,20,0.07);\n}\n.gb-msg.user .gb-bubble{\n  background:var(--green);color:#fff;\n  border-radius:16px 16px 4px 16px;\n  border-color:transparent;\n}\n.gb-bubble a{color:var(--lime);text-decoration:underline}\n.gb-msg.user .gb-bubble a{color:var(--lime)}\n\n/* QUICK REPLIES */\n#gb-quick{\n  padding:8px 14px 0;\n  display:flex;flex-wrap:wrap;gap:6px;\n  flex-shrink:0;\n}\n.gb-qr{\n  background:var(--bg);border:1px solid rgba(17,27,20,0.12);\n  color:var(--dark);font-size:12px;font-weight:600;\n  padding:6px 12px;border-radius:100px;\n  cursor:pointer;transition:all .15s;white-space:nowrap;\n}\n.gb-qr:hover{background:var(--green);color:#fff;border-color:var(--green)}\n\n/* TYPING INDICATOR */\n#gb-typing{\n  display:none;\n  padding:0 14px 6px;\n}\n#gb-typing.show{display:flex;align-items:center;gap:6px}\n.gb-typing-dots{\n  display:flex;gap:3px;\n  background:var(--bg);border:1px solid rgba(17,27,20,0.07);\n  padding:10px 14px;border-radius:16px 16px 16px 4px;\n}\n.gb-typing-dots span{\n  width:6px;height:6px;border-radius:50%;\n  background:rgba(17,27,20,0.25);\n  animation:gb-dot 1.2s ease infinite;\n}\n.gb-typing-dots span:nth-child(2){animation-delay:.2s}\n.gb-typing-dots span:nth-child(3){animation-delay:.4s}\n@keyframes gb-dot{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-6px)}}\n\n/* INPUT */\n#gb-input-row{\n  padding:12px 14px;\n  display:flex;gap:8px;align-items:flex-end;\n  border-top:1px solid rgba(17,27,20,0.07);\n  flex-shrink:0;\n  background:#fff;\n}\n#gb-input{\n  flex:1;\n  border:1.5px solid rgba(17,27,20,0.1);\n  border-radius:12px;\n  padding:10px 14px;\n  font-family:'Barlow',sans-serif;\n  font-size:14px;color:var(--dark);\n  outline:none;resize:none;\n  min-height:42px;max-height:100px;\n  transition:border-color .2s;\n  background:var(--bg);\n  line-height:1.4;\n}\n#gb-input:focus{border-color:var(--green);background:#fff}\n#gb-input::placeholder{color:rgba(17,27,20,0.3)}\n#gb-send{\n  width:42px;height:42px;border-radius:12px;\n  background:var(--green);color:#fff;\n  border:none;cursor:pointer;flex-shrink:0;\n  display:flex;align-items:center;justify-content:center;\n  transition:all .15s;\n}\n#gb-send:hover{background:#145028;transform:scale(1.05)}\n#gb-send:disabled{background:rgba(17,27,20,0.15);cursor:not-allowed;transform:none}\n\n/* POWERED BY */\n#gb-powered{\n  text-align:center;\n  font-size:10px;color:rgba(17,27,20,0.3);\n  padding:6px 0 10px;\n  font-weight:600;letter-spacing:.04em;\n  flex-shrink:0;\n}\n\n@media(max-width:420px){\n  #gb-window{\n    left:0;right:0;bottom:0;\n    width:100%;max-width:100%;\n    border-radius:20px 20px 0 0;\n    height:75vh;\n    max-height:75vh;\n  }\n  #gb-fab{bottom:16px;left:16px}\n}";
document.head.appendChild(style);

// ── INJECT HTML ──
var div = document.createElement('div');
div.innerHTML = '<!-- FAB BUTTON -->\n<button id="gb-fab" onclick="gbToggle()" aria-label="Chat with Grabbi Brain">\n  <svg id="gb-fab-open" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\n    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>\n  </svg>\n  <svg id="gb-fab-close" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" style="display:none">\n    <path d="M18 6L6 18M6 6l12 12"/>\n  </svg>\n  <div id="gb-fab-badge">1</div>\n</button>\n\n<!-- CHAT WINDOW -->\n<div id="gb-window">\n\n  <!-- HEAD -->\n  <div id="gb-head">\n    <div id="gb-avatar">🧠</div>\n    <div id="gb-head-info">\n      <div id="gb-head-name">Grabbi Brain</div>\n      <div id="gb-head-status">\n        <div id="gb-status-dot"></div>\n        <span>AI assistant · Knows everything about Grabbi</span>\n      </div>\n    </div>\n    <button id="gb-close" onclick="gbToggle()">✕</button>\n  </div>\n\n  <!-- MESSAGES -->\n  <div id="gb-messages">\n    <!-- Welcome message injected by JS -->\n  </div>\n\n  <!-- QUICK REPLIES -->\n  <div id="gb-quick"></div>\n\n  <!-- TYPING -->\n  <div id="gb-typing">\n    <div class="gb-typing-dots">\n      <span></span><span></span><span></span>\n    </div>\n  </div>\n\n  <!-- INPUT -->\n  <div id="gb-input-row">\n    <textarea id="gb-input" placeholder="Ask me anything about Grabbi..." rows="1" onkeydown="gbKey(event)" oninput="gbResize(this)"></textarea>\n    <button id="gb-send" onclick="gbSend()" aria-label="Send">\n      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">\n        <path d="m22 2-7 20-4-9-9-4 20-7z"/>\n        <path d="M22 2 11 13"/>\n      </svg>\n    </button>\n  </div>\n\n  <div id="gb-powered">Powered by Grabbi Brain · Claude AI</div>\n\n</div>\n\n<script>\n// ============================================================\n//  REPLACE YOUR_API_KEY_HERE with your Anthropic API key\n// ============================================================\nconst GRABBI_API_KEY = \'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\';\n\n// ============================================================\n//  GRABBI KNOWLEDGE BASE — system prompt\n// ============================================================\nconst SYSTEM_PROMPT = `You are Grabbi Brain — the friendly, knowledgeable AI assistant for Grabbi, a premium hyperlocal grocery delivery brand based in South Wales, UK. You speak like a real, warm, helpful team member — not a corporate bot. Keep answers concise, helpful and conversational. Use the odd emoji where natural 🛒.\n\n## ABOUT GRABBI\n- Company: Grabbi Ltd. Registered England & Wales. Company No: 16656150. VAT: GB 506 6190 02. ICO: ZC056258\n- Mission: 100 franchise stores UK by 2030. Acquisition-ready in 5 years.\n- Tagline: Grab Better Everyday\n- Email: hello@grabbi.uk | WhatsApp: +447356011358\n- Website: grabbi.uk | Shop: shop.grabbi.uk\n\n## STORES\nStore 1 — Aberkenfig: Starlux Building, Bridgend Road, Aberkenfig, CF32 9BG\nStore 2 — Porthcawl: 74 New Road, Porthcawl, CF36\nBoth open: Monday–Sunday, 7:00am–10:00pm\n\n## DELIVERY\n- Local delivery: as little as 30 minutes (NOT guaranteed, we say "as little as")\n- Delivery method: sustainable delivery (electric vehicles, cargo bikes, eco packaging) — NEVER say "electric bike" specifically as a promise\n- Free local delivery: orders over £25\n- Local delivery radius: 5 miles from each store\n- Local delivery areas: CF31 (Bridgend), CF32 (Aberkenfig, Tondu, Sarn, Ogmore Vale), CF33 (Pyle, Kenfig Hill), CF34 (Maesteg), CF36 (Porthcawl)\n- UK-wide shipping: non-perishable items only, 2–3 working days, free over £50, express next-day available at £6.99\n- Frozen items: South Wales local delivery ONLY, +£5 frozen surcharge\n- Plastic-free delivery throughout\n\n## PRODUCTS & CATEGORIES\n- Milk & Dairy (40+ products)\n- Bread & Bakery (25+ products, fresh daily)\n- Butcher & Meat (35+ products, local Welsh meat)\n- Fruit & Veg (50+ products)\n- Drinks & Snacks (60+ products)\n- Indian & World Foods (200+ products — biggest range in South Wales)\n- Frozen (30+ products)\n- Alcohol (45+ products, 18+ Challenge 25, licensed)\n- Household Essentials (55+ products)\n- Bundles (6 curated bundles, save up to £8)\n\n## WORLD FOODS — 9 CUISINES\nIndian, Chinese, Filipino, Sri Lankan, Caribbean, African, Japanese & Korean, Middle Eastern, Eastern European\nIndian brands: Tilda, MDH, TRS, Amul, Patak\'s, Haldiram\'s, Natco, Rajah, Everest, Britannia, Parle, Shana\nUK-wide shipping available on all non-perishable world food products\n\n## PRICING\n- Free delivery threshold: £25 local, £50 UK-wide\n- Frozen surcharge: +£5 on all orders containing frozen items\n- Express next-day delivery: £6.99\n- Standard UK delivery: from £3.99\n\n## LOYALTY POINTS\n- Earn 1 point per £1 spent on every order\n- Points can be redeemed for discounts on future orders\n- No expiry on points while account is active\n\n## FRANCHISE\n- Opening from as little as £20,000\n- Finance options available for the right candidates\n- Full training, technology, supplier access, marketing all included\n- Protected territories — one franchise per area\n- Target: 100 stores by 2030\n- Apply at: grabbi.uk/grabbi-franchise-opportunity\n- Enquiries: hello@grabbi.uk\n\n## SOCIAL MEDIA\n- Instagram: @grabbi_aberkenfig\n- TikTok: @grabbi_aberkenfig\n- Facebook: @grabbiaberkenfig\n- X/Twitter: @Grabbi_Aberkenf\n- YouTube: @Grabbi_Aberkenfig\n- WhatsApp: +447356011358\n\n## HOW TO ANSWER\n- If someone asks about delivery to their area, ask for their postcode and check against the CF postcode list\n- If someone has an order issue, direct them to WhatsApp (+447356011358) for the fastest help\n- If someone asks about a specific product, give a helpful answer based on category knowledge\n- If someone wants to franchise, direct them to the franchise page and offer to answer questions\n- If you don\'t know something specific (like exact live stock levels), be honest and direct to the team\n- NEVER make up prices for specific products you don\'t know the exact price of — say "prices vary, check shop.grabbi.uk"\n- Always be warm, human and helpful — you represent the Grabbi brand\n- Keep responses SHORT — 2-4 sentences max unless a detailed answer is genuinely needed`;\n\n// ============================================================\n//  STATE\n// ============================================================\nlet gbMessages = [];\nlet gbOpen = false;\nlet gbTyping = false;\n\nconst QUICK_REPLIES_INITIAL = [\n  \'🚚 Do you deliver to me?\',\n  \'🕐 What are your hours?\',\n  \'🌍 World Foods range\',\n  \'🏪 Franchise info\',\n];\n\nconst QUICK_REPLIES_FOLLOWUP = [\n  \'📞 Contact the team\',\n  \'🛒 Shop now\',\n  \'💷 Delivery costs\',\n  \'⭐ Loyalty points\',\n];\n\n// ============================================================\n//  INIT\n// ============================================================\nfunction gbInit() {\n  gbAddMessage(\'bot\', `Hey! 👋 I\'m **Grabbi Brain** — your AI assistant. I know everything about our stores, delivery areas, world foods range and more.\\n\\nWhat can I help you with today?`);\n  gbShowQuickReplies(QUICK_REPLIES_INITIAL);\n}\n\n// ============================================================\n//  TOGGLE\n// ============================================================\nwindow.gbToggle = function gbToggle() {\n  gbOpen = !gbOpen;\n  document.getElementById(\'gb-window\').classList.toggle(\'open\', gbOpen);\n  document.getElementById(\'gb-fab\').classList.toggle(\'open\', gbOpen);\n  document.getElementById(\'gb-fab-open\').style.display = gbOpen ? \'none\' : \'block\';\n  document.getElementById(\'gb-fab-close\').style.display = gbOpen ? \'block\' : \'none\';\n  document.getElementById(\'gb-fab-badge\').classList.add(\'hide\');\n  if (gbOpen) {\n    if (gbMessages.length === 0) gbInit();\n    setTimeout(() => document.getElementById(\'gb-input\').focus(), 300);\n  }\n}\n\n// ============================================================\n//  MESSAGES\n// ============================================================\nfunction gbAddMessage(role, text) {\n  gbMessages.push({ role, content: text });\n  const container = document.getElementById(\'gb-messages\');\n  const div = document.createElement(\'div\');\n  div.className = \'gb-msg \' + (role === \'user\' ? \'user\' : \'\');\n  const avatar = document.createElement(\'div\');\n  avatar.className = \'gb-msg-avatar\';\n  avatar.textContent = role === \'user\' ? \'👤\' : \'🧠\';\n  const bubble = document.createElement(\'div\');\n  bubble.className = \'gb-bubble\';\n  bubble.innerHTML = gbFormat(text);\n  div.appendChild(avatar);\n  div.appendChild(bubble);\n  container.appendChild(div);\n  container.scrollTop = container.scrollHeight;\n}\n\nfunction gbFormat(text) {\n  return text\n    .replace(/\\*\\*(.*?)\\*\\*/g, \'<strong>$1</strong>\')\n    .replace(/\\n/g, \'<br>\');\n}\n\n// ============================================================\n//  QUICK REPLIES\n// ============================================================\nfunction gbShowQuickReplies(replies) {\n  const qr = document.getElementById(\'gb-quick\');\n  qr.innerHTML = \'\';\n  replies.forEach(r => {\n    const btn = document.createElement(\'button\');\n    btn.className = \'gb-qr\';\n    btn.textContent = r;\n    btn.onclick = () => { gbSendText(r); };\n    qr.appendChild(btn);\n  });\n}\n\nfunction gbClearQuickReplies() {\n  document.getElementById(\'gb-quick\').innerHTML = \'\';\n}\n\n// ============================================================\n//  SEND\n// ============================================================\nwindow.gbKey = function gbKey(e) {\n  if (e.key === \'Enter\' && !e.shiftKey) {\n    e.preventDefault();\n    gbSend();\n  }\n}\n\nwindow.gbResize = function gbResize(el) {\n  el.style.height = \'auto\';\n  el.style.height = Math.min(el.scrollHeight, 100) + \'px\';\n}\n\nwindow.gbSend = function gbSend() {\n  const input = document.getElementById(\'gb-input\');\n  const text = input.value.trim();\n  if (!text || gbTyping) return;\n  input.value = \'\';\n  input.style.height = \'auto\';\n  gbSendText(text);\n}\n\nasync function gbSendText(text) {\n  if (gbTyping) return;\n  gbClearQuickReplies();\n  gbAddMessage(\'user\', text);\n  gbSetTyping(true);\n\n  try {\n    const messages = gbMessages\n      .filter(m => m.role !== \'bot\' || gbMessages.indexOf(m) > 0)\n      .map(m => ({\n        role: m.role === \'user\' ? \'user\' : \'assistant\',\n        content: m.content\n      }));\n\n    const response = await fetch(\'https://api.anthropic.com/v1/messages\', {\n      method: \'POST\',\n      headers: {\n        \'Content-Type\': \'application/json\',\n        \'x-api-key\': GRABBI_API_KEY,\n        \'anthropic-version\': \'2023-06-01\',\n        \'anthropic-dangerous-direct-browser-access\': \'true\'\n      },\n      body: JSON.stringify({\n        model: \'claude-haiku-4-5-20251001\',\n        max_tokens: 400,\n        system: SYSTEM_PROMPT,\n        messages: messages.slice(-10)\n      })\n    });\n\n    if (!response.ok) {\n      throw new Error(\'API error \' + response.status);\n    }\n\n    const data = await response.json();\n    const reply = data.content[0].text;\n    gbSetTyping(false);\n    gbAddMessage(\'bot\', reply);\n    gbShowQuickReplies(QUICK_REPLIES_FOLLOWUP);\n\n  } catch (err) {\n    gbSetTyping(false);\n    gbAddMessage(\'bot\', `Sorry, I\'m having a moment 😅 For immediate help, WhatsApp us at **+447356011358** or email **hello@grabbi.uk** — the team will get back to you fast!`);\n    console.error(\'Grabbi Brain error:\', err);\n  }\n}\n\n// ============================================================\n//  TYPING\n// ============================================================\nfunction gbSetTyping(show) {\n  gbTyping = show;\n  document.getElementById(\'gb-typing\').classList.toggle(\'show\', show);\n  document.getElementById(\'gb-send\').disabled = show;\n  const container = document.getElementById(\'gb-messages\');\n  container.scrollTop = container.scrollHeight;\n}\n\n// ============================================================\n//  INIT ON LOAD\n// ============================================================\nwindow.addEventListener(\'load\', function() {\n  // Show badge after 3 seconds to grab attention\n  setTimeout(() => {\n    if (!gbOpen) {\n      document.getElementById(\'gb-fab-badge\').classList.remove(\'hide\');\n    }\n  }, 3000);\n});';
document.body.appendChild(div);

// ── GRABBI BRAIN JS ──
// ============================================================
//  REPLACE YOUR_API_KEY_HERE with your Anthropic API key
// ============================================================
const GRABBI_API_KEY = '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';

// ============================================================
//  GRABBI KNOWLEDGE BASE — system prompt
// ============================================================
const SYSTEM_PROMPT = `You are Grabbi Brain — the friendly, knowledgeable AI assistant for Grabbi, a premium hyperlocal grocery delivery brand based in South Wales, UK. You speak like a real, warm, helpful team member — not a corporate bot. Keep answers concise, helpful and conversational. Use the odd emoji where natural 🛒.

## ABOUT GRABBI
- Company: Grabbi Ltd. Registered England & Wales. Company No: 16656150. VAT: GB 506 6190 02. ICO: ZC056258
- Mission: 100 franchise stores UK by 2030. Acquisition-ready in 5 years.
- Tagline: Grab Better Everyday
- Email: hello@grabbi.uk | WhatsApp: +447356011358
- Website: grabbi.uk | Shop: shop.grabbi.uk

## STORES
Store 1 — Aberkenfig: Starlux Building, Bridgend Road, Aberkenfig, CF32 9BG
Store 2 — Porthcawl: 74 New Road, Porthcawl, CF36
Both open: Monday–Sunday, 7:00am–10:00pm

## DELIVERY
- Local delivery: as little as 30 minutes (NOT guaranteed, we say "as little as")
- Delivery method: sustainable delivery (electric vehicles, cargo bikes, eco packaging) — NEVER say "electric bike" specifically as a promise
- Free local delivery: orders over £25
- Local delivery radius: 5 miles from each store
- Local delivery areas: CF31 (Bridgend), CF32 (Aberkenfig, Tondu, Sarn, Ogmore Vale), CF33 (Pyle, Kenfig Hill), CF34 (Maesteg), CF36 (Porthcawl)
- UK-wide shipping: non-perishable items only, 2–3 working days, free over £50, express next-day available at £6.99
- Frozen items: South Wales local delivery ONLY, +£5 frozen surcharge
- Plastic-free delivery throughout

## PRODUCTS & CATEGORIES
- Milk & Dairy (40+ products)
- Bread & Bakery (25+ products, fresh daily)
- Butcher & Meat (35+ products, local Welsh meat)
- Fruit & Veg (50+ products)
- Drinks & Snacks (60+ products)
- Indian & World Foods (200+ products — biggest range in South Wales)
- Frozen (30+ products)
- Alcohol (45+ products, 18+ Challenge 25, licensed)
- Household Essentials (55+ products)
- Bundles (6 curated bundles, save up to £8)

## WORLD FOODS — 9 CUISINES
Indian, Chinese, Filipino, Sri Lankan, Caribbean, African, Japanese & Korean, Middle Eastern, Eastern European
Indian brands: Tilda, MDH, TRS, Amul, Patak's, Haldiram's, Natco, Rajah, Everest, Britannia, Parle, Shana
UK-wide shipping available on all non-perishable world food products

## PRICING
- Free delivery threshold: £25 local, £50 UK-wide
- Frozen surcharge: +£5 on all orders containing frozen items
- Express next-day delivery: £6.99
- Standard UK delivery: from £3.99

## LOYALTY POINTS
- Earn 1 point per £1 spent on every order
- Points can be redeemed for discounts on future orders
- No expiry on points while account is active

## FRANCHISE
- Opening from as little as £20,000
- Finance options available for the right candidates
- Full training, technology, supplier access, marketing all included
- Protected territories — one franchise per area
- Target: 100 stores by 2030
- Apply at: grabbi.uk/grabbi-franchise-opportunity
- Enquiries: hello@grabbi.uk

## SOCIAL MEDIA
- Instagram: @grabbi_aberkenfig
- TikTok: @grabbi_aberkenfig
- Facebook: @grabbiaberkenfig
- X/Twitter: @Grabbi_Aberkenf
- YouTube: @Grabbi_Aberkenfig
- WhatsApp: +447356011358

## HOW TO ANSWER
- If someone asks about delivery to their area, ask for their postcode and check against the CF postcode list
- If someone has an order issue, direct them to WhatsApp (+447356011358) for the fastest help
- If someone asks about a specific product, give a helpful answer based on category knowledge
- If someone wants to franchise, direct them to the franchise page and offer to answer questions
- If you don't know something specific (like exact live stock levels), be honest and direct to the team
- NEVER make up prices for specific products you don't know the exact price of — say "prices vary, check shop.grabbi.uk"
- Always be warm, human and helpful — you represent the Grabbi brand
- Keep responses SHORT — 2-4 sentences max unless a detailed answer is genuinely needed`;

// ============================================================
//  STATE
// ============================================================
let gbMessages = [];
let gbOpen = false;
let gbTyping = false;

const QUICK_REPLIES_INITIAL = [
  '🚚 Do you deliver to me?',
  '🕐 What are your hours?',
  '🌍 World Foods range',
  '🏪 Franchise info',
];

const QUICK_REPLIES_FOLLOWUP = [
  '📞 Contact the team',
  '🛒 Shop now',
  '💷 Delivery costs',
  '⭐ Loyalty points',
];

// ============================================================
//  INIT
// ============================================================
function gbInit() {
  gbAddMessage('bot', `Hey! 👋 I'm **Grabbi Brain** — your AI assistant. I know everything about our stores, delivery areas, world foods range and more.\n\nWhat can I help you with today?`);
  gbShowQuickReplies(QUICK_REPLIES_INITIAL);
}

// ============================================================
//  TOGGLE
// ============================================================
window.gbToggle = function gbToggle() {
  gbOpen = !gbOpen;
  document.getElementById('gb-window').classList.toggle('open', gbOpen);
  document.getElementById('gb-fab').classList.toggle('open', gbOpen);
  document.getElementById('gb-fab-open').style.display = gbOpen ? 'none' : 'block';
  document.getElementById('gb-fab-close').style.display = gbOpen ? 'block' : 'none';
  document.getElementById('gb-fab-badge').classList.add('hide');
  if (gbOpen) {
    if (gbMessages.length === 0) gbInit();
    setTimeout(() => document.getElementById('gb-input').focus(), 300);
  }
}

// ============================================================
//  MESSAGES
// ============================================================
function gbAddMessage(role, text) {
  gbMessages.push({ role, content: text });
  const container = document.getElementById('gb-messages');
  const div = document.createElement('div');
  div.className = 'gb-msg ' + (role === 'user' ? 'user' : '');
  const avatar = document.createElement('div');
  avatar.className = 'gb-msg-avatar';
  avatar.textContent = role === 'user' ? '👤' : '🧠';
  const bubble = document.createElement('div');
  bubble.className = 'gb-bubble';
  bubble.innerHTML = gbFormat(text);
  div.appendChild(avatar);
  div.appendChild(bubble);
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function gbFormat(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');
}

// ============================================================
//  QUICK REPLIES
// ============================================================
function gbShowQuickReplies(replies) {
  const qr = document.getElementById('gb-quick');
  qr.innerHTML = '';
  replies.forEach(r => {
    const btn = document.createElement('button');
    btn.className = 'gb-qr';
    btn.textContent = r;
    btn.onclick = () => { gbSendText(r); };
    qr.appendChild(btn);
  });
}

function gbClearQuickReplies() {
  document.getElementById('gb-quick').innerHTML = '';
}

// ============================================================
//  SEND
// ============================================================
window.gbKey = function gbKey(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    gbSend();
  }
}

window.gbResize = function gbResize(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 100) + 'px';
}

window.gbSend = function gbSend() {
  const input = document.getElementById('gb-input');
  const text = input.value.trim();
  if (!text || gbTyping) return;
  input.value = '';
  input.style.height = 'auto';
  gbSendText(text);
}

async function gbSendText(text) {
  if (gbTyping) return;
  gbClearQuickReplies();
  gbAddMessage('user', text);
  gbSetTyping(true);

  try {
    const messages = gbMessages
      .filter(m => m.role !== 'bot' || gbMessages.indexOf(m) > 0)
      .map(m => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content
      }));

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': GRABBI_API_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 400,
        system: SYSTEM_PROMPT,
        messages: messages.slice(-10)
      })
    });

    if (!response.ok) {
      throw new Error('API error ' + response.status);
    }

    const data = await response.json();
    const reply = data.content[0].text;
    gbSetTyping(false);
    gbAddMessage('bot', reply);
    gbShowQuickReplies(QUICK_REPLIES_FOLLOWUP);

  } catch (err) {
    gbSetTyping(false);
    gbAddMessage('bot', `Sorry, I'm having a moment 😅 For immediate help, WhatsApp us at **+447356011358** or email **hello@grabbi.uk** — the team will get back to you fast!`);
    console.error('Grabbi Brain error:', err);
  }
}

// ============================================================
//  TYPING
// ============================================================
function gbSetTyping(show) {
  gbTyping = show;
  document.getElementById('gb-typing').classList.toggle('show', show);
  document.getElementById('gb-send').disabled = show;
  const container = document.getElementById('gb-messages');
  container.scrollTop = container.scrollHeight;
}

// ============================================================
//  INIT ON LOAD
// ============================================================
window.addEventListener('load', function() {
  // Show badge after 3 seconds to grab attention
  setTimeout(() => {
    if (!gbOpen) {
      document.getElementById('gb-fab-badge').classList.remove('hide');
    }
  }, 3000);
});

})();
