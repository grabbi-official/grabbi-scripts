(function() {

// Only run on grabbi.uk — not on shop.grabbi.uk
if (window.location.hostname === 'shop.grabbi.uk') return;

// Reads API key set in Hostinger custom code box
var API_KEY = window.GABBI_KEY || '';

var AVATAR = 'https://assets.zyrosite.com/WKfW2bGIcRiklr5N/grabbi-social-logo-oyFn4hYcgDf7RjjB.webp';

var SYSTEM = 'You are Gabbi — the friendly, warm customer representative for Grabbi, a premium grocery delivery brand in South Wales, UK. You speak like a real helpful person, not a bot. Keep answers short and conversational — 2 to 4 sentences max. Use the odd emoji naturally.\n\nSTORES: Aberkenfig (Starlux Building, Bridgend Road, CF32 9BG) and Porthcawl (74 New Road, CF36). Both open Mon-Sun 7am-10pm.\n\nDELIVERY: As little as 30 mins locally. Never say guaranteed. Sustainable delivery. Free over £25 local, £50 UK-wide. Local areas: CF31 Bridgend, CF32 Aberkenfig/Tondu/Sarn/Ogmore Vale, CF33 Pyle/Kenfig Hill, CF34 Maesteg, CF36 Porthcawl. UK-wide non-perishables only 2-3 days. Frozen local only +£5 surcharge.\n\nPRODUCTS: Milk & Dairy, Bread & Bakery, Butcher & Meat, Fruit & Veg, Drinks & Snacks, Indian & World Foods (200+ products, biggest range in South Wales), Frozen, Alcohol (18+ Challenge 25), Household Essentials, Bundles (save up to £8).\n\nWORLD FOODS: Indian, Chinese, Filipino, Sri Lankan, Caribbean, African, Japanese & Korean, Middle Eastern, Eastern European.\n\nPRICING: Free local delivery over £25. Free UK delivery over £50. Express next-day £6.99. Standard UK from £3.99. Frozen surcharge +£5.\n\nLOYALTY: Earn 1 point per £1 spent. Redeem for discounts. No expiry.\n\nFRANCHISE: Open your own Grabbi store from £20K. Finance available. 100 stores by 2030. Apply at grabbi.uk/grabbi-franchise-opportunity.\n\nCONTACT: hello@grabbi.uk. WhatsApp +447356011358.\n\nRULES: Never make up product prices. For order issues send to WhatsApp. If asked your name say you are Gabbi. Be warm and human always.';

// Inject font
var f = document.createElement('link');
f.rel = 'stylesheet';
f.href = 'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800&family=Barlow:wght@400;600&display=swap';
document.head.appendChild(f);

// Inject styles
var s = document.createElement('style');
s.textContent = [
  ':root{--gg:#1A5C35;--gl:#B5E550;--gd:#111B14;--gb:#FAF7F0}',

  '#gabbi-btn{position:fixed;bottom:96px;left:20px;width:56px;height:56px;border-radius:50%;border:none;cursor:pointer;padding:0;',
    'background:#fff;',
    'box-shadow:0 4px 20px rgba(26,92,53,0.35);z-index:2147483640;overflow:visible;',
    'transition:transform .25s,box-shadow .25s;}',
  '#gabbi-btn:hover{transform:scale(1.08);box-shadow:0 8px 32px rgba(26,92,53,0.5)}',
  '#gabbi-btn-inner{width:56px;height:56px;border-radius:50%;overflow:hidden;',
    'border:2.5px solid var(--gg);background:#fff;',
    'display:flex;align-items:center;justify-content:center;}',
  '#gabbi-btn-inner img{width:78%;height:78%;object-fit:contain;display:block;}',

  '#gabbi-badge{position:absolute;top:-3px;right:-3px;width:20px;height:20px;border-radius:50%;',
    'background:var(--gl);color:var(--gd);font-size:10px;font-weight:800;',
    'display:flex;align-items:center;justify-content:center;border:2px solid #fff;',
    'animation:gabbi-ping 2s ease infinite;z-index:1;}',
  '#gabbi-badge.hide{display:none}',
  '@keyframes gabbi-ping{0%,100%{transform:scale(1)}50%{transform:scale(1.25)}}',

  '#gabbi-win{position:fixed;bottom:164px;left:20px;width:calc(100vw - 40px);max-width:370px;',
    'height:500px;max-height:calc(100vh - 200px);background:#fff;border-radius:20px;',
    'box-shadow:0 24px 64px rgba(17,27,20,0.18);z-index:2147483639;',
    'display:flex;flex-direction:column;overflow:hidden;',
    'transform:translateY(16px) scale(0.96);opacity:0;pointer-events:none;',
    'transition:all .28s cubic-bezier(.16,1,.3,1);transform-origin:bottom left}',
  '#gabbi-win.open{transform:translateY(0) scale(1);opacity:1;pointer-events:all}',

  '#gabbi-head{background:var(--gd);padding:12px 16px;display:flex;align-items:center;gap:10px;flex-shrink:0}',
  '#gabbi-himg{width:38px;height:38px;border-radius:50%;object-fit:contain;border:2px solid var(--gl);flex-shrink:0;background:#fff;padding:3px;}',
  '#gabbi-hinfo{flex:1}',
  '#gabbi-hname{font-family:"Barlow Condensed",sans-serif;font-weight:800;font-size:17px;text-transform:uppercase;color:#fff;line-height:1}',
  '#gabbi-hsub{font-size:11px;color:rgba(255,255,255,0.5);margin-top:2px;display:flex;align-items:center;gap:4px}',
  '#gabbi-dot{width:6px;height:6px;border-radius:50%;background:#4caf50}',
  '#gabbi-x{background:rgba(255,255,255,0.1);border:none;color:#fff;width:28px;height:28px;border-radius:50%;cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center}',

  '#gabbi-msgs{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:8px}',
  '#gabbi-msgs::-webkit-scrollbar{width:3px}',
  '#gabbi-msgs::-webkit-scrollbar-thumb{background:rgba(17,27,20,0.1);border-radius:2px}',
  '.gm{display:flex;gap:8px;animation:gm-in .25s ease}',
  '@keyframes gm-in{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}',
  '.gm.u{flex-direction:row-reverse}',
  '.gm-av{width:30px;height:30px;border-radius:50%;flex-shrink:0;overflow:hidden;margin-top:2px;background:#fff;display:flex;align-items:center;justify-content:center;}',
  '.gm-av img{width:80%;height:80%;object-fit:contain;}',
  '.gm.u .gm-av{background:rgba(17,27,20,0.08);font-size:14px}',
  '.gm-bub{max-width:82%;background:var(--gb);border-radius:16px 16px 16px 4px;padding:9px 13px;font-size:13px;line-height:1.6;color:var(--gd)}',
  '.gm.u .gm-bub{background:var(--gg);color:#fff;border-radius:16px 16px 4px 16px}',

  '#gabbi-qr{padding:6px 14px 0;display:flex;flex-wrap:wrap;gap:5px;flex-shrink:0}',
  '.gqr{background:var(--gb);border:1px solid rgba(17,27,20,0.12);color:var(--gd);font-size:11px;font-weight:600;',
    'padding:5px 11px;border-radius:100px;cursor:pointer;white-space:nowrap;transition:all .15s}',
  '.gqr:hover{background:var(--gg);color:#fff;border-color:var(--gg)}',

  '#gabbi-typing{display:none;padding:0 14px 4px}',
  '#gabbi-typing.show{display:flex;align-items:center;gap:8px}',
  '#gabbi-typing .gm-av{width:30px;height:30px;border-radius:50%;overflow:hidden;flex-shrink:0;background:#fff;}',
  '#gabbi-typing .gm-av img{width:80%;height:80%;object-fit:contain;}',
  '.gdots{display:flex;gap:3px;background:var(--gb);padding:10px 14px;border-radius:16px 16px 16px 4px}',
  '.gdots span{width:6px;height:6px;border-radius:50%;background:rgba(17,27,20,0.3);animation:gd 1.2s ease infinite}',
  '.gdots span:nth-child(2){animation-delay:.2s}.gdots span:nth-child(3){animation-delay:.4s}',
  '@keyframes gd{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-6px)}}',

  '#gabbi-inp-row{padding:10px 12px;display:flex;gap:8px;align-items:flex-end;border-top:1px solid rgba(17,27,20,0.07);flex-shrink:0;background:#fff}',
  '#gabbi-inp{flex:1;border:1.5px solid rgba(17,27,20,0.1);border-radius:12px;padding:9px 13px;',
    'font-family:"Barlow",sans-serif;font-size:14px;color:var(--gd);outline:none;resize:none;',
    'min-height:40px;max-height:90px;background:var(--gb);line-height:1.4}',
  '#gabbi-inp:focus{border-color:var(--gg);background:#fff}',
  '#gabbi-inp::placeholder{color:rgba(17,27,20,0.3)}',
  '#gabbi-send{width:40px;height:40px;border-radius:11px;background:var(--gg);color:#fff;border:none;cursor:pointer;flex-shrink:0;display:flex;align-items:center;justify-content:center;transition:background .15s}',
  '#gabbi-send:hover{background:#145028}',
  '#gabbi-send:disabled{background:rgba(17,27,20,0.15);cursor:not-allowed}',
  '#gabbi-foot{text-align:center;font-size:10px;color:rgba(17,27,20,0.25);padding:5px 0 8px;flex-shrink:0}',

  '@media(max-width:420px){',
    '#gabbi-win{left:0;right:0;bottom:0;width:100%;max-width:100%;border-radius:20px 20px 0 0;height:72vh;max-height:72vh}',
    '#gabbi-btn{bottom:88px;left:16px;width:50px;height:50px;}',
    '#gabbi-btn-inner{width:50px;height:50px;}',
  '}',

  '@media(min-width:1024px){',
    '#gabbi-btn{bottom:24px;}',
    '#gabbi-win{bottom:92px;}',
  '}'
].join('');
document.head.appendChild(s);

// Inject HTML
var w = document.createElement('div');
w.innerHTML = [
  '<button id="gabbi-btn" onclick="gabbiToggle()" aria-label="Chat with Gabbi">',
    '<div id="gabbi-btn-inner">',
      '<img src="' + AVATAR + '" alt="Gabbi">',
    '</div>',
    '<div id="gabbi-badge" class="hide">!</div>',
  '</button>',
  '<div id="gabbi-win">',
    '<div id="gabbi-head">',
      '<img id="gabbi-himg" src="' + AVATAR + '" alt="Gabbi">',
      '<div id="gabbi-hinfo">',
        '<div id="gabbi-hname">Gabbi</div>',
        '<div id="gabbi-hsub"><div id="gabbi-dot"></div><span>Ask Gabbi</span></div>',
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
    '<div id="gabbi-foot">Powered by Gabbi · Grabbi\'s AI assistant</div>',
  '</div>'
].join('');
document.body.appendChild(w);

// State
var msgs = [], open = false, busy = false;
var QR1 = ['🚚 Do you deliver to me?','🕐 What are your hours?','🌍 World Foods','🏪 Franchise info'];
var QR2 = ['📞 Contact team','🛒 Shop now','💷 Delivery costs','⭐ Loyalty points'];

// ── HUMAN TYPING DELAY ──────────────────────────────────────────
// Minimum time the typing dots show (ms) — feels natural, not instant
var MIN_TYPING_MS = 1500;
// Extra ms per character in the reply — longer replies = longer pause
var MS_PER_CHAR = 18;
// Maximum cap so very long replies don't wait too long
var MAX_TYPING_MS = 4000;

function humanDelay(replyText) {
  var calculated = MIN_TYPING_MS + (replyText.length * MS_PER_CHAR);
  return Math.min(calculated, MAX_TYPING_MS);
}
// ────────────────────────────────────────────────────────────────

function init() {
  addMsg('bot', 'Hey there! 👋 I\'m **Gabbi**, Grabbi\'s customer representative.\n\nI\'m here to help with anything — delivery, products, orders, world foods and more. What can I do for you today?');
  showQR(QR1);
}

window.gabbiToggle = function() {
  open = !open;
  document.getElementById('gabbi-win').classList.toggle('open', open);
  document.getElementById('gabbi-btn').classList.toggle('open', open);
  document.getElementById('gabbi-badge').classList.add('hide');
  if (open) {
    if (!msgs.length) init();
    setTimeout(function(){ document.getElementById('gabbi-inp').focus(); }, 300);
  }
};

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
    img.src = AVATAR;
    img.alt = 'Gabbi';
    av.appendChild(img);
  }
  var b = document.createElement('div');
  b.className = 'gm-bub';
  b.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
  d.appendChild(av);
  d.appendChild(b);
  c.appendChild(d);
  c.scrollTop = c.scrollHeight;
}

function showQR(list) {
  var q = document.getElementById('gabbi-qr');
  q.innerHTML = '';
  list.forEach(function(r) {
    var btn = document.createElement('button');
    btn.className = 'gqr';
    btn.textContent = r;
    btn.onclick = function(){ send(r); };
    q.appendChild(btn);
  });
}

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
  inp.value = '';
  inp.style.height = 'auto';
  send(t);
};

function send(text) {
  if (busy) return;
  document.getElementById('gabbi-qr').innerHTML = '';
  addMsg('user', text);
  busy = true;
  document.getElementById('gabbi-typing').classList.add('show');
  document.getElementById('gabbi-send').disabled = true;
  document.getElementById('gabbi-msgs').scrollTop = 9999;

  var payload = msgs.map(function(m) {
    return { role: m.role === 'user' ? 'user' : 'assistant', content: m.content };
  }).slice(-12);

  // Track when the API call started
  var fetchStart = Date.now();

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
      max_tokens: 350,
      system: SYSTEM,
      messages: payload
    })
  })
  .then(function(r) { return r.json(); })
  .then(function(data) {
    var reply = (data.content && data.content[0]) ? data.content[0].text : null;
    var replyText = reply || 'Sorry, something went wrong on my end! 😅 You can reach the team directly on WhatsApp at **+447356011358** or email **hello@grabbi.uk**';

    // Calculate how long we've already been showing the typing indicator
    var elapsed = Date.now() - fetchStart;
    // Calculate the human-feeling delay based on reply length
    var targetDelay = humanDelay(replyText);
    // Only wait the remaining time needed — if API was slow, show immediately
    var remaining = Math.max(0, targetDelay - elapsed);

    setTimeout(function() {
      busy = false;
      document.getElementById('gabbi-typing').classList.remove('show');
      document.getElementById('gabbi-send').disabled = false;
      addMsg('bot', replyText);
      showQR(QR2);
      document.getElementById('gabbi-msgs').scrollTop = 9999;
    }, remaining);
  })
  .catch(function() {
    var elapsed = Date.now() - fetchStart;
    var remaining = Math.max(0, MIN_TYPING_MS - elapsed);

    setTimeout(function() {
      busy = false;
      document.getElementById('gabbi-typing').classList.remove('show');
      document.getElementById('gabbi-send').disabled = false;
      addMsg('bot', 'Oops, something went wrong! 😅 Please WhatsApp us at **+447356011358** or email **hello@grabbi.uk** and we\'ll help you straight away.');
      document.getElementById('gabbi-msgs').scrollTop = 9999;
    }, remaining);
  });
}

// Show badge after 4 seconds if chat not yet opened
setTimeout(function() {
  if (!open) document.getElementById('gabbi-badge').classList.remove('hide');
}, 4000);

})();
