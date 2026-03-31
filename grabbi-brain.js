(function() {

// ============================================================
//  GRABBI BRAIN — Shop AI Assistant
//  Hosted on GitHub, served via jsDelivr
//
//  ⚠️  NEVER put your API key in this file.
//  Set it in your shop head code like this:
//  <script>window.GRABBI_KEY = 'your-anthropic-api-key-here';</script>
// ============================================================

var API_KEY = window.GRABBI_KEY || '';
var SHOP    = 'https://shop.grabbi.uk';

// ── HUMAN TYPING DELAY ───────────────────────────────────────
var MIN_TYPING_MS = 1500;
var MS_PER_CHAR   = 18;
var MAX_TYPING_MS = 4000;
function humanDelay(text) {
  return Math.min(MIN_TYPING_MS + (text.length * MS_PER_CHAR), MAX_TYPING_MS);
}

// ── LIVE OFFERS FETCH ────────────────────────────────────────
// Endpoint should return:
// { "offers": [ { "name": "Product", "price": "£3.99", "was": "£4.50", "url": "/products/slug" } ] }
var liveOffers = '';
fetch(SHOP + '/api/offers', { cache: 'no-store' })
  .then(function(r) { return r.json(); })
  .then(function(data) {
    if (data && data.offers && data.offers.length) {
      liveOffers = '\n\n## CURRENT LIVE OFFERS (fetched live from shop)\n' +
        data.offers.map(function(o) {
          return '- ' + o.name + ' now ' + o.price +
            (o.was ? ' (was ' + o.was + ')' : '') +
            (o.url ? ' → ' + SHOP + o.url : '');
        }).join('\n');
    }
  })
  .catch(function() {});

// ── SYSTEM PROMPT ────────────────────────────────────────────
function buildSystem() {
  return '' +
  'You are Grabbi Brain — the warm, smart and slightly cheeky AI assistant for Grabbi, ' +
  'a premium grocery delivery brand in South Wales, UK. You are on the shop page so customers ' +
  'are already here to buy — your job is to help them find exactly what they need and upsell naturally.\n\n' +

  '## YOUR PERSONALITY\n' +
  '- Warm, human, conversational — like a knowledgeable friend working at the shop\n' +
  '- You are a sales assistant first, helper second — always nudge toward adding to basket\n' +
  '- Never say "I cannot navigate the website" — give the direct link instead\n' +
  '- Only send to WhatsApp for genuine complaints or order tracking issues\n' +
  '- Use the odd emoji naturally. Keep replies to 2-4 sentences max.\n' +
  '- Always suggest a bundle or related product when relevant\n' +
  '- Always end with a question or a nudge to add to basket\n' +
  '- When mentioning a URL, include it as plain text so the customer can tap it\n\n' +

  '## ABOUT GRABBI\n' +
  '- Company: Grabbi Ltd. Registered England & Wales. No: 16656150. VAT: GB 506 6190 02.\n' +
  '- Tagline: Grab Better Everyday\n' +
  '- Email: hello@grabbi.uk | WhatsApp: +447356011358\n' +
  '- Website: grabbi.uk | Shop: https://shop.grabbi.uk\n\n' +

  '## STORES\n' +
  '- Aberkenfig: Starlux Building, Bridgend Road, CF32 9BG. Open Mon-Sun 7am-10pm\n' +
  '- Porthcawl: 74 New Road, CF36. Open Mon-Sun 7am-10pm\n\n' +

  '## DELIVERY\n' +
  '- As little as 30 mins locally (NEVER say guaranteed)\n' +
  '- Sustainable delivery — eco packaging, plastic-free throughout\n' +
  '- Free local delivery over £25. Free UK-wide over £50.\n' +
  '- Express next-day £6.99. Standard UK from £3.99. Frozen +£5 surcharge.\n' +
  '- Local postcodes: CF31 Bridgend, CF32 Aberkenfig/Tondu/Sarn/Ogmore Vale, CF33 Pyle/Kenfig Hill, CF34 Maesteg, CF36 Porthcawl\n' +
  '- UK-wide non-perishables only, 2-3 working days\n' +
  '- Frozen items: South Wales local delivery ONLY\n' +
  '- Delivery areas: https://grabbi.uk/delivery-areas\n\n' +

  '## ALL CATEGORIES WITH DIRECT LINKS\n' +
  '- Fresh Produce & Veg (50+): https://shop.grabbi.uk/products?category=Fresh+Produce+%26+Veg\n' +
  '- Meat & Butcher (35+, local Welsh): https://shop.grabbi.uk/products?category=Meat+%26+Butcher\n' +
  '- Dairy & Eggs (40+): https://shop.grabbi.uk/products?category=Dairy+%26+Eggs\n' +
  '- Bakery (25+, fresh daily): https://shop.grabbi.uk/products?category=Bakery\n' +
  '- Frozen (30+): https://shop.grabbi.uk/products?category=Frozen\n' +
  '- Snacks & Confectionery (60+): https://shop.grabbi.uk/products?category=Snacks+%26+Confectionery\n' +
  '- Beverages (50+): https://shop.grabbi.uk/products?category=Beverages\n' +
  '- Cupboard Essentials (70+): https://shop.grabbi.uk/products?category=Cupboard+Essentials\n' +
  '- Ready Meals & Instant (20+): https://shop.grabbi.uk/products?category=Ready+Meals+%26+Instant\n' +
  '- Grab & Go (15+): https://shop.grabbi.uk/products?category=Grab+%26+Go\n' +
  '- Household (55+): https://shop.grabbi.uk/products?category=Household\n' +
  '- Personal Care (30+): https://shop.grabbi.uk/products?category=Personal+Care\n' +
  '- Baby & Kids (25+): https://shop.grabbi.uk/products?category=Baby+%26+Kids\n' +
  '- Pet Supplies (20+): https://shop.grabbi.uk/products?category=Pet+Supplies\n' +
  '- Alcohol 18+ Challenge 25 (45+): https://shop.grabbi.uk/products?category=Alcohol\n' +
  '- Health & Wellness (25+): https://shop.grabbi.uk/products?category=Health+%26+Wellness\n' +
  '- Stationery & Office: https://shop.grabbi.uk/products?category=Stationery+%26+Office\n' +
  '- Offers & Deals: https://shop.grabbi.uk/products?category=Offers+%26+Deals\n' +
  '- World Foods (200+, biggest range in South Wales): https://shop.grabbi.uk/products?category=World+Foods\n\n' +

  '## WORLD FOODS — 9 CUISINES\n' +
  '- Indian 🇮🇳: https://shop.grabbi.uk/products?category=World+Foods&cuisine=indian\n' +
  '- Chinese 🇨🇳: https://shop.grabbi.uk/products?category=World+Foods&cuisine=chinese\n' +
  '- Filipino 🇵🇭: https://shop.grabbi.uk/products?category=World+Foods&cuisine=filipino\n' +
  '- Sri Lankan 🇱🇰: https://shop.grabbi.uk/products?category=World+Foods&cuisine=sri-lankan\n' +
  '- Caribbean 🇯🇲: https://shop.grabbi.uk/products?category=World+Foods&cuisine=caribbean\n' +
  '- African 🌍: https://shop.grabbi.uk/products?category=World+Foods&cuisine=african\n' +
  '- Japanese & Korean 🇯🇵: https://shop.grabbi.uk/products?category=World+Foods&cuisine=japanese-korean\n' +
  '- Middle Eastern 🕌: https://shop.grabbi.uk/products?category=World+Foods&cuisine=middle-eastern\n' +
  '- Eastern European 🇵🇱: https://shop.grabbi.uk/products?category=World+Foods&cuisine=eastern-european\n' +
  '- Indian brands stocked: Tilda, MDH, TRS, Amul, Pataks, Haldirams, Natco, Rajah, Everest, Britannia, Parle, Shana\n' +
  '- UK-wide shipping on all non-perishable world food products\n\n' +

  '## DIETARY FILTERS\n' +
  '- Vegan 🌱: https://shop.grabbi.uk/products?category=World+Foods&dietary=vegan\n' +
  '- Gluten-Free 🌾: https://shop.grabbi.uk/products?category=World+Foods&dietary=gluten-free\n' +
  '- High Protein 💪: https://shop.grabbi.uk/products?category=World+Foods&dietary=high-protein\n\n' +

  '## BUNDLES — always mention when relevant, save up to £8\n' +
  '- The Big Breakfast £12.99 (was £17.99): https://shop.grabbi.uk/product/big-breakfast-bundle\n' +
  '- Friday Night In £18.99 (was £24.99): https://shop.grabbi.uk/product/friday-night-bundle\n' +
  '- Indian Night In £15.99 (was £21.99): https://shop.grabbi.uk/product/indian-night-bundle\n' +
  '- Baby Essentials £22.99 (was £29.99): https://shop.grabbi.uk/product/baby-essentials-bundle\n' +
  '- Feel Better Bundle £14.99 (was £18.99): https://shop.grabbi.uk/product/feel-better-bundle\n' +
  '- Party Pack £34.99 (was £42.99): https://shop.grabbi.uk/product/party-pack-bundle\n\n' +

  '## KEY PAGES\n' +
  '- Account: https://shop.grabbi.uk/account\n' +
  '- Orders: https://shop.grabbi.uk/account/orders\n' +
  '- Loyalty points: https://shop.grabbi.uk/account/loyalty\n' +
  '- Checkout: https://shop.grabbi.uk/checkout\n' +
  '- World Foods page: https://grabbi.uk/world-food-delivery-uk\n' +
  '- Franchise: https://grabbi.uk/grabbi-franchise-opportunity\n' +
  '- Delivery areas: https://grabbi.uk/delivery-areas\n' +
  '- Contact: https://grabbi.uk/contact-grabbi\n\n' +

  '## LOYALTY POINTS\n' +
  '- Earn 1 point per £1 spent on every order\n' +
  '- Redeem for discounts on future orders\n' +
  '- No expiry while account is active\n\n' +

  '## FRANCHISE\n' +
  '- From £20,000. Finance available. Protected territories.\n' +
  '- Full training, tech, suppliers and marketing included.\n' +
  '- 100 stores by 2030.\n' +
  '- Apply: https://grabbi.uk/grabbi-franchise-opportunity\n\n' +

  '## SOCIAL MEDIA\n' +
  '- Instagram, TikTok, Facebook, YouTube: @grabbi_aberkenfig\n' +
  '- WhatsApp: +447356011358 (order issues only)\n\n' +

  '## UPSELL RULES — follow every time\n' +
  '- Meat question → mention local Welsh butcher AND suggest Big Breakfast or Friday Night bundle\n' +
  '- Indian food question → send to Indian category AND suggest Indian Night In bundle\n' +
  '- Baby products → send to Baby & Kids AND mention Baby Essentials bundle\n' +
  '- Alcohol → remind free delivery over £25, suggest Party Pack\n' +
  '- Feeling ill → suggest Feel Better Bundle immediately\n' +
  '- Party/celebration → suggest Party Pack immediately\n' +
  '- Offers question → send to https://shop.grabbi.uk/products?category=Offers+%26+Deals\n' +
  '- Ready to order → say order can arrive in as little as 30 mins\n' +
  '- World foods → ask which cuisine, then give specific cuisine link\n' +
  '- Vegan/gluten-free → send to dietary filter links\n' +
  '- Basket under £25 → remind them free delivery kicks in at £25\n' +
  '- Any question about account/orders → send to https://shop.grabbi.uk/account\n\n' +

  '## HARD RULES\n' +
  '- NEVER make up specific product prices (bundle prices above are confirmed)\n' +
  '- NEVER say you cannot navigate the website — give the direct link instead\n' +
  '- NEVER say "electric bike" as a delivery promise\n' +
  '- ONLY send to WhatsApp for genuine complaints or order tracking\n' +
  '- If asked your name: you are Grabbi Brain, the AI assistant for Grabbi\n' +
  '- If someone asks for their postcode area, check against the CF list above\n' +
  '- Always end with a question or a nudge to add to basket\n' +
  (liveOffers || '');
}

// ── INJECT FONT ──────────────────────────────────────────────
var f = document.createElement('link');
f.rel = 'stylesheet';
f.href = 'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800&family=Barlow:wght@400;600&display=swap';
document.head.appendChild(f);

// ── INJECT STYLES ────────────────────────────────────────────
var s = document.createElement('style');
s.textContent = [
  ':root{--green:#1A5C35;--lime:#B5E550;--dark:#111B14;--bg:#FAF7F0}',

  '#gb-fab{position:fixed;bottom:24px;left:20px;width:56px;height:56px;border-radius:50%;background:var(--green);border:none;cursor:pointer;box-shadow:0 6px 24px rgba(26,92,53,0.4);z-index:2147483640;display:flex;align-items:center;justify-content:center;transition:all .25s cubic-bezier(.16,1,.3,1);animation:gb-bounce 3s ease infinite;}',
  '#gb-fab:hover{transform:scale(1.1);box-shadow:0 8px 32px rgba(26,92,53,0.5)}',
  '#gb-fab.open{transform:scale(1);animation:none;background:var(--dark)}',
  '@keyframes gb-bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}',
  '#gb-fab svg{transition:all .25s}',
  '#gb-fab-badge{position:absolute;top:-3px;right:-3px;width:18px;height:18px;border-radius:50%;background:var(--lime);color:var(--dark);font-size:9px;font-weight:800;display:flex;align-items:center;justify-content:center;border:2px solid #fff;animation:gb-ping 2s ease infinite;}',
  '@keyframes gb-ping{0%,100%{transform:scale(1)}50%{transform:scale(1.2)}}',
  '#gb-fab-badge.hide{display:none}',

  '#gb-window{position:fixed;bottom:92px;left:20px;width:calc(100vw - 40px);max-width:380px;height:520px;max-height:calc(100vh - 120px);background:#fff;border-radius:20px;box-shadow:0 24px 64px rgba(17,27,20,0.2);border:1px solid rgba(17,27,20,0.08);z-index:2147483639;display:flex;flex-direction:column;overflow:hidden;transform:translateY(20px) scale(0.95);opacity:0;pointer-events:none;transition:all .3s cubic-bezier(.16,1,.3,1);transform-origin:bottom left;}',
  '#gb-window.open{transform:translateY(0) scale(1);opacity:1;pointer-events:all;}',

  '#gb-head{background:var(--dark);padding:14px 16px;display:flex;align-items:center;gap:12px;flex-shrink:0;}',
  '#gb-avatar{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,var(--green),var(--lime));display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;}',
  '#gb-head-info{flex:1}',
  '#gb-head-name{font-family:"Barlow Condensed",sans-serif;font-weight:800;font-size:16px;text-transform:uppercase;color:#fff;line-height:1;}',
  '#gb-head-status{font-size:11px;color:rgba(255,255,255,0.5);display:flex;align-items:center;gap:4px;margin-top:2px;}',
  '#gb-status-dot{width:6px;height:6px;border-radius:50%;background:#4caf50;animation:gb-pulse 2s infinite;}',
  '@keyframes gb-pulse{0%,100%{opacity:1}50%{opacity:.4}}',
  '#gb-close{background:rgba(255,255,255,0.1);border:none;color:#fff;width:28px;height:28px;border-radius:50%;cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center;transition:background .15s;}',
  '#gb-close:hover{background:rgba(255,255,255,0.2)}',

  '#gb-messages{flex:1;overflow-y:auto;padding:16px 14px;display:flex;flex-direction:column;gap:10px;scroll-behavior:smooth;}',
  '#gb-messages::-webkit-scrollbar{width:4px}',
  '#gb-messages::-webkit-scrollbar-thumb{background:rgba(17,27,20,0.1);border-radius:2px}',

  '.gb-msg{display:flex;gap:8px;animation:gb-in .3s cubic-bezier(.16,1,.3,1);}',
  '@keyframes gb-in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}',
  '.gb-msg.user{flex-direction:row-reverse}',
  '.gb-msg-avatar{width:28px;height:28px;border-radius:50%;flex-shrink:0;background:linear-gradient(135deg,var(--green),var(--lime));display:flex;align-items:center;justify-content:center;font-size:14px;margin-top:2px;}',
  '.gb-msg.user .gb-msg-avatar{background:rgba(17,27,20,0.08);font-size:12px;}',
  '.gb-bubble{max-width:80%;background:var(--bg);border-radius:16px 16px 16px 4px;padding:10px 14px;font-size:13px;line-height:1.6;color:var(--dark);border:1px solid rgba(17,27,20,0.07);}',
  '.gb-msg.user .gb-bubble{background:var(--green);color:#fff;border-radius:16px 16px 4px 16px;border-color:transparent;}',
  '.gb-bubble a{color:var(--green);font-weight:600;text-decoration:underline;}',
  '.gb-msg.user .gb-bubble a{color:var(--lime);}',

  '#gb-quick{padding:8px 14px 0;display:flex;flex-wrap:wrap;gap:6px;flex-shrink:0;}',
  '.gb-qr{background:var(--bg);border:1px solid rgba(17,27,20,0.12);color:var(--dark);font-size:12px;font-weight:600;padding:6px 12px;border-radius:100px;cursor:pointer;transition:all .15s;white-space:nowrap;}',
  '.gb-qr:hover{background:var(--green);color:#fff;border-color:var(--green)}',

  '#gb-typing{display:none;padding:0 14px 6px;}',
  '#gb-typing.show{display:flex;align-items:center;gap:6px;}',
  '.gb-typing-dots{display:flex;gap:3px;background:var(--bg);border:1px solid rgba(17,27,20,0.07);padding:10px 14px;border-radius:16px 16px 16px 4px;}',
  '.gb-typing-dots span{width:6px;height:6px;border-radius:50%;background:rgba(17,27,20,0.25);animation:gb-dot 1.2s ease infinite;}',
  '.gb-typing-dots span:nth-child(2){animation-delay:.2s}',
  '.gb-typing-dots span:nth-child(3){animation-delay:.4s}',
  '@keyframes gb-dot{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-6px)}}',

  '#gb-input-row{padding:12px 14px;display:flex;gap:8px;align-items:flex-end;border-top:1px solid rgba(17,27,20,0.07);flex-shrink:0;background:#fff;}',
  '#gb-input{flex:1;border:1.5px solid rgba(17,27,20,0.1);border-radius:12px;padding:10px 14px;font-family:"Barlow",sans-serif;font-size:14px;color:var(--dark);outline:none;resize:none;min-height:42px;max-height:100px;transition:border-color .2s;background:var(--bg);line-height:1.4;}',
  '#gb-input:focus{border-color:var(--green);background:#fff}',
  '#gb-input::placeholder{color:rgba(17,27,20,0.3)}',
  '#gb-send{width:42px;height:42px;border-radius:12px;background:var(--green);color:#fff;border:none;cursor:pointer;flex-shrink:0;display:flex;align-items:center;justify-content:center;transition:all .15s;}',
  '#gb-send:hover{background:#145028;transform:scale(1.05)}',
  '#gb-send:disabled{background:rgba(17,27,20,0.15);cursor:not-allowed;transform:none}',
  '#gb-powered{text-align:center;font-size:10px;color:rgba(17,27,20,0.3);padding:6px 0 10px;font-weight:600;letter-spacing:.04em;flex-shrink:0;}',

  '@media(max-width:420px){#gb-window{left:0;right:0;bottom:0;width:100%;max-width:100%;border-radius:20px 20px 0 0;height:75vh;max-height:75vh;}#gb-fab{bottom:16px;left:16px;}}'
].join('');
document.head.appendChild(s);

// ── INJECT HTML ──────────────────────────────────────────────
var w = document.createElement('div');
w.innerHTML = [
  '<button id="gb-fab" onclick="gbToggle()" aria-label="Chat with Grabbi Brain">',
    '<svg id="gb-fab-open" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
    '<svg id="gb-fab-close" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" style="display:none"><path d="M18 6L6 18M6 6l12 12"/></svg>',
    '<div id="gb-fab-badge">1</div>',
  '</button>',
  '<div id="gb-window">',
    '<div id="gb-head">',
      '<div id="gb-avatar">🧠</div>',
      '<div id="gb-head-info">',
        '<div id="gb-head-name">Grabbi Brain</div>',
        '<div id="gb-head-status"><div id="gb-status-dot"></div><span>AI assistant · Here to help</span></div>',
      '</div>',
      '<button id="gb-close" onclick="gbToggle()">✕</button>',
    '</div>',
    '<div id="gb-messages"></div>',
    '<div id="gb-quick"></div>',
    '<div id="gb-typing">',
      '<div class="gb-typing-dots"><span></span><span></span><span></span></div>',
    '</div>',
    '<div id="gb-input-row">',
      '<textarea id="gb-input" placeholder="Ask me anything about Grabbi..." rows="1" onkeydown="gbKey(event)" oninput="gbResize(this)"></textarea>',
      '<button id="gb-send" onclick="gbSend()" aria-label="Send">',
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4 20-7z"/><path d="M22 2 11 13"/></svg>',
      '</button>',
    '</div>',
    '<div id="gb-powered">Grabbi Brain · Powered by AI</div>',
  '</div>'
].join('');
document.body.appendChild(w);

// ── STATE ────────────────────────────────────────────────────
var msgs = [], open = false, busy = false;
var QR1 = ['🚚 Do you deliver to me?', '🌍 World Foods range', '🎁 See bundles', '🏪 Franchise info'];
var QR2 = ['🛒 Continue shopping', '💷 Delivery costs', '⭐ Loyalty points', '📦 Track my order'];

// ── INIT ─────────────────────────────────────────────────────
function init() {
  addMsg('bot', 'Hey! 👋 I\'m **Grabbi Brain** — your AI shopping assistant.\n\nI can help you find products, check delivery, explore world foods and more. What are you looking for today?');
  showQR(QR1);
}

// ── TOGGLE ───────────────────────────────────────────────────
window.gbToggle = function() {
  open = !open;
  document.getElementById('gb-window').classList.toggle('open', open);
  document.getElementById('gb-fab').classList.toggle('open', open);
  document.getElementById('gb-fab-open').style.display = open ? 'none' : 'block';
  document.getElementById('gb-fab-close').style.display = open ? 'block' : 'none';
  document.getElementById('gb-fab-badge').classList.add('hide');
  if (open) {
    if (!msgs.length) init();
    setTimeout(function() { document.getElementById('gb-input').focus(); }, 300);
  }
};

// ── ADD MESSAGE ──────────────────────────────────────────────
function addMsg(role, text) {
  msgs.push({ role: role, content: text });
  var c = document.getElementById('gb-messages');
  var d = document.createElement('div');
  d.className = 'gb-msg' + (role === 'user' ? ' user' : '');
  var av = document.createElement('div');
  av.className = 'gb-msg-avatar';
  av.textContent = role === 'user' ? '👤' : '🧠';
  var b = document.createElement('div');
  b.className = 'gb-bubble';
  b.innerHTML = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>')
    .replace(/(https?:\/\/[^\s<"]+)/g, '<a href="$1" target="_blank">$1</a>');
  d.appendChild(av);
  d.appendChild(b);
  c.appendChild(d);
  c.scrollTop = c.scrollHeight;
}

// ── QUICK REPLIES ────────────────────────────────────────────
function showQR(list) {
  var q = document.getElementById('gb-quick');
  q.innerHTML = '';
  list.forEach(function(r) {
    var btn = document.createElement('button');
    btn.className = 'gb-qr';
    btn.textContent = r;
    btn.onclick = function() { send(r); };
    q.appendChild(btn);
  });
}

// ── INPUT HANDLERS ───────────────────────────────────────────
window.gbKey = function(e) {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); gbSend(); }
};
window.gbResize = function(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 100) + 'px';
};
window.gbSend = function() {
  var inp = document.getElementById('gb-input');
  var t = inp.value.trim();
  if (!t || busy) return;
  inp.value = ''; inp.style.height = 'auto';
  send(t);
};

// ── SEND ─────────────────────────────────────────────────────
function send(text) {
  if (busy) return;
  document.getElementById('gb-quick').innerHTML = '';
  addMsg('user', text);
  busy = true;
  document.getElementById('gb-typing').classList.add('show');
  document.getElementById('gb-send').disabled = true;
  document.getElementById('gb-messages').scrollTop = 9999;

  var fetchStart = Date.now();
  var payload = msgs.map(function(m) {
    return { role: m.role === 'user' ? 'user' : 'assistant', content: m.content };
  }).slice(-12);

  fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 400,
      system: buildSystem(),
      messages: payload
    })
  })
  .then(function(r) { return r.json(); })
  .then(function(data) {
    var reply = (data.content && data.content[0]) ? data.content[0].text
      : 'Sorry, something went wrong! 😅 WhatsApp us at **+447356011358** or email **hello@grabbi.uk** and we\'ll help straight away.';
    var remaining = Math.max(0, humanDelay(reply) - (Date.now() - fetchStart));
    setTimeout(function() {
      busy = false;
      document.getElementById('gb-typing').classList.remove('show');
      document.getElementById('gb-send').disabled = false;
      addMsg('bot', reply);
      showQR(QR2);
      document.getElementById('gb-messages').scrollTop = 9999;
    }, remaining);
  })
  .catch(function() {
    var remaining = Math.max(0, MIN_TYPING_MS - (Date.now() - fetchStart));
    setTimeout(function() {
      busy = false;
      document.getElementById('gb-typing').classList.remove('show');
      document.getElementById('gb-send').disabled = false;
      addMsg('bot', 'Oops, something went wrong! 😅 Please WhatsApp us at **+447356011358** or email **hello@grabbi.uk** and we\'ll sort you out straight away.');
      document.getElementById('gb-messages').scrollTop = 9999;
    }, remaining);
  });
}

// ── SHOW BADGE AFTER 3s ──────────────────────────────────────
setTimeout(function() {
  if (!open) document.getElementById('gb-fab-badge').classList.remove('hide');
}, 3000);

})();
