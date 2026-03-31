(function() {

// ============================================================
//  GABBI — Brain of Grabbi
//  Hosted on GitHub, served via jsDelivr
//
//  ⚠️  NEVER put your API key in this file.
//  Set it in Hostinger Custom Code (Head section) like this:
//  <script>window.GABBI_KEY = 'your-anthropic-api-key-here';</script>
// ============================================================

// Only run on grabbi.uk — not on shop.grabbi.uk
if (window.location.hostname === 'shop.grabbi.uk') return;

var API_KEY = window.GABBI_KEY || '';
var AVATAR  = 'https://assets.zyrosite.com/WKfW2bGIcRiklr5N/grabbi-social-logo-oyFn4hYcgDf7RjjB.webp';
var SHOP    = 'https://shop.grabbi.uk';

// ── HUMAN TYPING DELAY ───────────────────────────────────────
var MIN_TYPING_MS = 1500;
var MS_PER_CHAR   = 18;
var MAX_TYPING_MS = 4000;
function humanDelay(text) {
  return Math.min(MIN_TYPING_MS + (text.length * MS_PER_CHAR), MAX_TYPING_MS);
}

// ── LIVE OFFERS FETCH ────────────────────────────────────────
// Developer task: ensure https://shop.grabbi.uk/api/offers returns JSON:
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
  'You are Gabbi — the warm, smart and slightly cheeky customer representative for Grabbi, ' +
  'a premium grocery delivery brand in South Wales, UK. You are NOT a generic chatbot. ' +
  'You are the brain of Grabbi and a sales assistant.\n\n' +

  '## YOUR PERSONALITY\n' +
  '- Warm, human, conversational — like a helpful friend who works at Grabbi\n' +
  '- Always nudge people toward ordering. You are a sales assistant as much as a helper.\n' +
  '- Never say "I cannot navigate the website" — always give the direct link instead\n' +
  '- Never deflect to WhatsApp unless it is a genuine complaint or order issue\n' +
  '- Use the odd emoji naturally. Keep replies to 2-4 sentences max.\n' +
  '- If someone asks about a product, upsell a related one or suggest a bundle\n' +
  '- Always end with a question or a nudge to order\n' +
  '- When you mention a URL, include it as plain text so the customer can tap it\n\n' +

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
  '- Delivery areas page: https://grabbi.uk/delivery-areas\n\n' +

  '## ALL CATEGORIES WITH DIRECT SHOP LINKS\n' +
  '- Fresh Produce & Veg (50+ products): https://shop.grabbi.uk/products?category=Fresh+Produce+%26+Veg\n' +
  '- Meat & Butcher (35+ local Welsh products): https://shop.grabbi.uk/products?category=Meat+%26+Butcher\n' +
  '- Dairy & Eggs (40+ products): https://shop.grabbi.uk/products?category=Dairy+%26+Eggs\n' +
  '- Bakery (25+ fresh daily): https://shop.grabbi.uk/products?category=Bakery\n' +
  '- Frozen (30+ products): https://shop.grabbi.uk/products?category=Frozen\n' +
  '- Snacks & Confectionery (60+ products): https://shop.grabbi.uk/products?category=Snacks+%26+Confectionery\n' +
  '- Beverages (50+ products): https://shop.grabbi.uk/products?category=Beverages\n' +
  '- Cupboard Essentials (70+ products): https://shop.grabbi.uk/products?category=Cupboard+Essentials\n' +
  '- Ready Meals & Instant (20+ products): https://shop.grabbi.uk/products?category=Ready+Meals+%26+Instant\n' +
  '- Grab & Go (15+ products): https://shop.grabbi.uk/products?category=Grab+%26+Go\n' +
  '- Household (55+ products): https://shop.grabbi.uk/products?category=Household\n' +
  '- Personal Care (30+ products): https://shop.grabbi.uk/products?category=Personal+Care\n' +
  '- Baby & Kids (25+ products): https://shop.grabbi.uk/products?category=Baby+%26+Kids\n' +
  '- Pet Supplies (20+ products): https://shop.grabbi.uk/products?category=Pet+Supplies\n' +
  '- Alcohol 18+ Challenge 25 (45+ products): https://shop.grabbi.uk/products?category=Alcohol\n' +
  '- Health & Wellness (25+ products): https://shop.grabbi.uk/products?category=Health+%26+Wellness\n' +
  '- Stationery & Office: https://shop.grabbi.uk/products?category=Stationery+%26+Office\n' +
  '- Offers & Deals: https://shop.grabbi.uk/products?category=Offers+%26+Deals\n' +
  '- World Foods (200+ products, biggest range in South Wales): https://shop.grabbi.uk/products?category=World+Foods\n\n' +

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

  '## DIETARY\n' +
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

  '## KEY WEBSITE PAGES\n' +
  '- World Foods: https://grabbi.uk/world-food-delivery-uk\n' +
  '- Franchise: https://grabbi.uk/grabbi-franchise-opportunity\n' +
  '- Sustainability: https://grabbi.uk/grabbi-sustainable-grocery-delivery\n' +
  '- Delivery areas: https://grabbi.uk/delivery-areas\n' +
  '- About: https://grabbi.uk/about-grabbi\n' +
  '- Stories: https://grabbi.uk/grabbi-stories\n' +
  '- Contact: https://grabbi.uk/contact-grabbi\n' +
  '- Healthy food: https://grabbi.uk/healthy-grocery-delivery-uk\n\n' +

  '## LOYALTY POINTS\n' +
  '- Earn 1 point per £1 spent. Redeem for discounts. No expiry while account is active.\n\n' +

  '## FRANCHISE\n' +
  '- From £20,000. Finance available. Protected territories.\n' +
  '- Full training, tech, suppliers and marketing all included.\n' +
  '- Target: 100 stores by 2030.\n' +
  '- Apply: https://grabbi.uk/grabbi-franchise-opportunity\n\n' +

  '## SOCIAL MEDIA\n' +
  '- Instagram, TikTok, Facebook, YouTube: @grabbi_aberkenfig\n' +
  '- WhatsApp: +447356011358 (order issues only)\n\n' +

  '## UPSELL RULES — follow every time\n' +
  '- Meat question → mention local Welsh butcher AND suggest Big Breakfast or Friday Night bundle\n' +
  '- Indian food question → send to Indian category AND suggest Indian Night In bundle\n' +
  '- Baby products question → send to Baby & Kids AND mention Baby Essentials bundle\n' +
  '- Alcohol question → remind free delivery over £25, suggest Party Pack\n' +
  '- Feeling ill → suggest Feel Better Bundle immediately\n' +
  '- Party/celebration → suggest Party Pack immediately\n' +
  '- Offers question → send to https://shop.grabbi.uk/products?category=Offers+%26+Deals\n' +
  '- Ready to order → give https://shop.grabbi.uk and say order can arrive in as little as 30 mins\n' +
  '- World foods question → ask which cuisine, then give the specific cuisine link\n' +
  '- Vegan/gluten-free → send to dietary filter links above\n\n' +

  '## HARD RULES\n' +
  '- NEVER make up specific product prices (bundle prices listed above are confirmed)\n' +
  '- NEVER say you cannot navigate the website — give the direct link instead\n' +
  '- NEVER say "electric bike" as a delivery promise\n' +
  '- ONLY send to WhatsApp for genuine complaints or order tracking\n' +
  '- If asked your name: you are Gabbi, the brain of Grabbi\n' +
  '- If someone asks for postcode area, check against the CF list above\n' +
  '- Always end with a question or a nudge to order\n' +
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
  ':root{--gg:#1A5C35;--gl:#B5E550;--gd:#111B14;--gb:#FAF7F0}',
  '#gabbi-btn{position:fixed;bottom:96px;left:20px;width:56px;height:56px;border-radius:50%;border:none;cursor:pointer;padding:0;background:#fff;box-shadow:0 4px 20px rgba(26,92,53,0.35);z-index:2147483640;overflow:visible;transition:transform .25s,box-shadow .25s;}',
  '#gabbi-btn:hover{transform:scale(1.08);box-shadow:0 8px 32px rgba(26,92,53,0.5)}',
  '#gabbi-btn-inner{width:56px;height:56px;border-radius:50%;overflow:hidden;border:2.5px solid var(--gg);background:#fff;display:flex;align-items:center;justify-content:center;}',
  '#gabbi-btn-inner img{width:78%;height:78%;object-fit:contain;display:block;}',
  '#gabbi-badge{position:absolute;top:-3px;right:-3px;width:20px;height:20px;border-radius:50%;background:var(--gl);color:var(--gd);font-size:10px;font-weight:800;display:flex;align-items:center;justify-content:center;border:2px solid #fff;animation:gabbi-ping 2s ease infinite;z-index:1;}',
  '#gabbi-badge.hide{display:none}',
  '@keyframes gabbi-ping{0%,100%{transform:scale(1)}50%{transform:scale(1.25)}}',
  '#gabbi-win{position:fixed;bottom:164px;left:20px;width:calc(100vw - 40px);max-width:370px;height:500px;max-height:calc(100vh - 200px);background:#fff;border-radius:20px;box-shadow:0 24px 64px rgba(17,27,20,0.18);z-index:2147483639;display:flex;flex-direction:column;overflow:hidden;transform:translateY(16px) scale(0.96);opacity:0;pointer-events:none;transition:all .28s cubic-bezier(.16,1,.3,1);transform-origin:bottom left}',
  '#gabbi-win.open{transform:translateY(0) scale(1);opacity:1;pointer-events:all}',
  '#gabbi-head{background:var(--gd);padding:12px 16px;display:flex;align-items:center;gap:10px;flex-shrink:0}',
  '#gabbi-himg{width:38px;height:38px;border-radius:50%;object-fit:contain;border:2px solid var(--gl);flex-shrink:0;background:#fff;padding:3px;}',
  '#gabbi-hinfo{flex:1}',
  '#gabbi-hname{font-family:"Barlow Condensed",sans-serif;font-weight:800;font-size:17px;text-transform:uppercase;color:#fff;line-height:1}',
  '#gabbi-hsub{font-size:11px;color:rgba(255,255,255,0.5);margin-top:2px;display:flex;align-items:center;gap:4px}',
  '#gabbi-dot{width:6px;height:6px;border-radius:50%;background:#4caf50;animation:gb-pulse 2s infinite;}',
  '@keyframes gb-pulse{0%,100%{opacity:1}50%{opacity:.4}}',
  '#gabbi-x{background:rgba(255,255,255,0.1);border:none;color:#fff;width:28px;height:28px;border-radius:50%;cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center;}',
  '#gabbi-msgs{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:8px;scroll-behavior:smooth;}',
  '#gabbi-msgs::-webkit-scrollbar{width:3px}',
  '#gabbi-msgs::-webkit-scrollbar-thumb{background:rgba(17,27,20,0.1);border-radius:2px}',
  '.gm{display:flex;gap:8px;animation:gm-in .25s ease}',
  '@keyframes gm-in{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}',
  '.gm.u{flex-direction:row-reverse}',
  '.gm-av{width:30px;height:30px;border-radius:50%;flex-shrink:0;overflow:hidden;margin-top:2px;background:#fff;display:flex;align-items:center;justify-content:center;}',
  '.gm-av img{width:80%;height:80%;object-fit:contain;}',
  '.gm.u .gm-av{background:rgba(17,27,20,0.08);font-size:14px}',
  '.gm-bub{max-width:82%;background:var(--gb);border-radius:16px 16px 16px 4px;padding:9px 13px;font-size:13px;line-height:1.6;color:var(--gd);border:1px solid rgba(17,27,20,0.07);}',
  '.gm.u .gm-bub{background:var(--gg);color:#fff;border-radius:16px 16px 4px 16px;border-color:transparent;}',
  '.gm-bub a{color:var(--gg);font-weight:600;text-decoration:underline;}',
  '.gm.u .gm-bub a{color:var(--gl);}',
  '#gabbi-qr{padding:6px 14px 0;display:flex;flex-wrap:wrap;gap:5px;flex-shrink:0}',
  '.gqr{background:var(--gb);border:1px solid rgba(17,27,20,0.12);color:var(--gd);font-size:11px;font-weight:600;padding:5px 11px;border-radius:100px;cursor:pointer;white-space:nowrap;transition:all .15s}',
  '.gqr:hover{background:var(--gg);color:#fff;border-color:var(--gg)}',
  '#gabbi-typing{display:none;padding:0 14px 4px}',
  '#gabbi-typing.show{display:flex;align-items:center;gap:8px}',
  '#gabbi-typing .gm-av{width:30px;height:30px;border-radius:50%;overflow:hidden;flex-shrink:0;background:#fff;}',
  '#gabbi-typing .gm-av img{width:80%;height:80%;object-fit:contain;}',
  '.gdots{display:flex;gap:3px;background:var(--gb);border:1px solid rgba(17,27,20,0.07);padding:10px 14px;border-radius:16px 16px 16px 4px}',
  '.gdots span{width:6px;height:6px;border-radius:50%;background:rgba(17,27,20,0.3);animation:gd 1.2s ease infinite}',
  '.gdots span:nth-child(2){animation-delay:.2s}.gdots span:nth-child(3){animation-delay:.4s}',
  '@keyframes gd{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-6px)}}',
  '#gabbi-inp-row{padding:10px 12px;display:flex;gap:8px;align-items:flex-end;border-top:1px solid rgba(17,27,20,0.07);flex-shrink:0;background:#fff}',
  '#gabbi-inp{flex:1;border:1.5px solid rgba(17,27,20,0.1);border-radius:12px;padding:9px 13px;font-family:"Barlow",sans-serif;font-size:14px;color:var(--gd);outline:none;resize:none;min-height:40px;max-height:90px;background:var(--gb);line-height:1.4}',
  '#gabbi-inp:focus{border-color:var(--gg);background:#fff}',
  '#gabbi-inp::placeholder{color:rgba(17,27,20,0.3)}',
  '#gabbi-send{width:40px;height:40px;border-radius:11px;background:var(--gg);color:#fff;border:none;cursor:pointer;flex-shrink:0;display:flex;align-items:center;justify-content:center;transition:all .15s}',
  '#gabbi-send:hover{background:#145028;transform:scale(1.05)}',
  '#gabbi-send:disabled{background:rgba(17,27,20,0.15);cursor:not-allowed;transform:none}',
  '#gabbi-foot{text-align:center;font-size:10px;color:rgba(17,27,20,0.25);padding:5px 0 8px;flex-shrink:0;font-weight:600;letter-spacing:.04em}',
  '@media(max-width:420px){#gabbi-win{left:0;right:0;bottom:0;width:100%;max-width:100%;border-radius:20px 20px 0 0;height:75vh;max-height:75vh}#gabbi-btn{bottom:88px;left:16px;width:50px;height:50px;}#gabbi-btn-inner{width:50px;height:50px;}}',
  '@media(min-width:1024px){#gabbi-btn{bottom:24px;}#gabbi-win{bottom:92px;}}'
].join('');
document.head.appendChild(s);

// ── INJECT HTML ──────────────────────────────────────────────
var w = document.createElement('div');
w.innerHTML = [
  '<button id="gabbi-btn" onclick="gabbiToggle()" aria-label="Chat with Gabbi">',
    '<div id="gabbi-btn-inner"><img src="' + AVATAR + '" alt="Gabbi"></div>',
    '<div id="gabbi-badge" class="hide">!</div>',
  '</button>',
  '<div id="gabbi-win">',
    '<div id="gabbi-head">',
      '<img id="gabbi-himg" src="' + AVATAR + '" alt="Gabbi">',
      '<div id="gabbi-hinfo">',
        '<div id="gabbi-hname">Gabbi</div>',
        '<div id="gabbi-hsub"><div id="gabbi-dot"></div><span>Brain of Grabbi · Always here</span></div>',
      '</div>',
      '<button id="gabbi-x" onclick="gabbiToggle()">✕</button>',
    '</div>',
    '<div id="gabbi-msgs"></div>',
    '<div id="gabbi-qr"></div>',
    '<div id="gabbi-typing">',
      '<div class="gm-av"><img src="' + AVATAR + '" alt="Gabbi"></div>',
      '<div class="gdots"><span></span><span></span><span></span></div>',
    '</div>',
    '<div id="gabbi-inp-row">',
      '<textarea id="gabbi-inp" placeholder="Ask Gabbi anything..." rows="1" onkeydown="gabbiKey(event)" oninput="gabbiResize(this)"></textarea>',
      '<button id="gabbi-send" onclick="gabbiSend()">',
        '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4 20-7z"/><path d="M22 2 11 13"/></svg>',
      '</button>',
    '</div>',
    '<div id="gabbi-foot">Gabbi · Brain of Grabbi · Powered by AI</div>',
  '</div>'
].join('');
document.body.appendChild(w);

// ── STATE ────────────────────────────────────────────────────
var msgs = [], open = false, busy = false;
var QR1 = ['🚚 Do you deliver to me?', '🕐 What are your hours?', '🌍 World Foods', '🏪 Franchise info'];
var QR2 = ['🛒 Shop now', '🎁 See bundles', '💷 Delivery costs', '⭐ Loyalty points'];

// ── INIT ─────────────────────────────────────────────────────
function init() {
  addMsg('bot', 'Hey there! 👋 I\'m **Gabbi** — the brain of Grabbi.\n\nI can help with delivery, products, world foods, offers, bundles and more. What can I do for you today?');
  showQR(QR1);
}

// ── TOGGLE ───────────────────────────────────────────────────
window.gabbiToggle = function() {
  open = !open;
  document.getElementById('gabbi-win').classList.toggle('open', open);
  document.getElementById('gabbi-badge').classList.add('hide');
  if (open) {
    if (!msgs.length) init();
    setTimeout(function() { document.getElementById('gabbi-inp').focus(); }, 300);
  }
};

// ── ADD MESSAGE ──────────────────────────────────────────────
function addMsg(role, text) {
  msgs.push({ role: role, content: text });
  var c = document.getElementById('gabbi-msgs');
  var d = document.createElement('div');
  d.className = 'gm' + (role === 'user' ? ' u' : '');
  var av = document.createElement('div');
  av.className = 'gm-av';
  if (role === 'user') {
    av.textContent = '👤';
  } else {
    var img = document.createElement('img');
    img.src = AVATAR; img.alt = 'Gabbi';
    av.appendChild(img);
  }
  var b = document.createElement('div');
  b.className = 'gm-bub';
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
  var q = document.getElementById('gabbi-qr');
  q.innerHTML = '';
  list.forEach(function(r) {
    var btn = document.createElement('button');
    btn.className = 'gqr';
    btn.textContent = r;
    btn.onclick = function() { send(r); };
    q.appendChild(btn);
  });
}

// ── INPUT HANDLERS ───────────────────────────────────────────
window.gabbiKey = function(e) {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); gabbiSend(); }
};
window.gabbiResize = function(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 90) + 'px';
};
window.gabbiSend = function() {
  var inp = document.getElementById('gabbi-inp');
  var t = inp.value.trim();
  if (!t || busy) return;
  inp.value = ''; inp.style.height = 'auto';
  send(t);
};

// ── SEND ─────────────────────────────────────────────────────
function send(text) {
  if (busy) return;
  document.getElementById('gabbi-qr').innerHTML = '';
  addMsg('user', text);
  busy = true;
  document.getElementById('gabbi-typing').classList.add('show');
  document.getElementById('gabbi-send').disabled = true;
  document.getElementById('gabbi-msgs').scrollTop = 9999;

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
      document.getElementById('gabbi-typing').classList.remove('show');
      document.getElementById('gabbi-send').disabled = false;
      addMsg('bot', reply);
      showQR(QR2);
      document.getElementById('gabbi-msgs').scrollTop = 9999;
    }, remaining);
  })
  .catch(function() {
    var remaining = Math.max(0, MIN_TYPING_MS - (Date.now() - fetchStart));
    setTimeout(function() {
      busy = false;
      document.getElementById('gabbi-typing').classList.remove('show');
      document.getElementById('gabbi-send').disabled = false;
      addMsg('bot', 'Oops, something went wrong! 😅 Please WhatsApp us at **+447356011358** or email **hello@grabbi.uk** and we\'ll sort you out straight away.');
      document.getElementById('gabbi-msgs').scrollTop = 9999;
    }, remaining);
  });
}

// ── SHOW BADGE AFTER 4s ──────────────────────────────────────
setTimeout(function() {
  if (!open) document.getElementById('gabbi-badge').classList.remove('hide');
}, 4000);

})();
