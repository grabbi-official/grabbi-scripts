(function() {

  // Inject styles
  var style = document.createElement('style');
  style.textContent = '#grb-fab{position:fixed;bottom:24px;right:20px;z-index:2147483647;display:none;align-items:center;gap:12px;background:#111B14;color:#fff;padding:14px 20px;border-radius:999px;font-family:"Barlow",sans-serif;cursor:pointer;border:none;box-shadow:0 6px 24px rgba(17,27,20,0.35);transition:transform .2s,box-shadow .2s;-webkit-tap-highlight-color:transparent;}#grb-fab:hover{transform:translateY(-3px);box-shadow:0 10px 32px rgba(17,27,20,0.45);}#grb-fab-count{font-size:11px;font-weight:800;color:#B5E550;text-transform:uppercase;letter-spacing:1px;display:block;line-height:1.2;}#grb-fab-total{font-family:"Barlow Condensed",sans-serif;font-weight:900;font-size:22px;line-height:1;color:#fff;}#grb-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:2147483645;display:none;}#grb-overlay.open{display:block;}#grb-drawer{position:fixed;bottom:0;left:0;right:0;background:#fff;border-radius:20px 20px 0 0;z-index:2147483646;transform:translateY(100%);transition:transform .32s cubic-bezier(.16,1,.3,1);max-height:82vh;display:flex;flex-direction:column;}#grb-drawer.open{transform:translateY(0);}#grb-head{background:#111B14;padding:16px 20px;display:flex;align-items:center;justify-content:space-between;border-radius:20px 20px 0 0;}#grb-head-title{font-family:"Barlow Condensed",sans-serif;font-weight:900;font-size:22px;text-transform:uppercase;color:#fff;}#grb-head-close{background:rgba(255,255,255,.1);border:none;color:#fff;width:32px;height:32px;border-radius:50%;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;}#grb-bar{padding:12px 20px;background:#FAF7F0;border-bottom:1px solid rgba(17,27,20,.07);}#grb-bar-track{height:5px;background:rgba(17,27,20,.1);border-radius:3px;overflow:hidden;margin:6px 0;}#grb-bar-fill{height:100%;background:linear-gradient(90deg,#1A5C35,#B5E550);border-radius:3px;transition:width .4s;width:0%;}#grb-bar-msg{font-size:11px;color:rgba(17,27,20,.5);}#grb-items{flex:1;overflow-y:auto;padding:12px 20px;}#grb-empty{text-align:center;padding:32px 0;color:rgba(17,27,20,.3);font-size:13px;line-height:1.6;}.grb-line{display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid rgba(17,27,20,.06);}.grb-line:last-child{border-bottom:none;}.grb-line-info{flex:1;font-size:13px;font-weight:600;color:#111B14;line-height:1.3;}.grb-line-brand{font-size:10px;color:rgba(17,27,20,.35);font-weight:600;display:block;text-transform:uppercase;margin-top:2px;}.grb-qty{display:flex;align-items:center;gap:6px;}.grb-qty-btn{width:28px;height:28px;border-radius:50%;border:1.5px solid rgba(17,27,20,.15);background:#fff;font-size:16px;cursor:pointer;color:#111B14;display:flex;align-items:center;justify-content:center;transition:all .15s;}.grb-qty-btn:hover{border-color:#1A5C35;color:#1A5C35;background:#f0faf0;}.grb-line-price{font-family:"Barlow Condensed",sans-serif;font-weight:900;font-size:16px;color:#1A5C35;min-width:52px;text-align:right;}#grb-foot{padding:16px 20px;border-top:1px solid rgba(17,27,20,.08);}#grb-total-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;}#grb-total-label{font-size:15px;font-weight:700;color:#111B14;}#grb-total-val{font-family:"Barlow Condensed",sans-serif;font-weight:900;font-size:26px;color:#1A5C35;}#grb-checkout{width:100%;background:#1A5C35;color:#fff;font-family:"Barlow Condensed",sans-serif;font-weight:900;font-size:20px;text-transform:uppercase;letter-spacing:1px;padding:16px;border-radius:12px;border:none;cursor:pointer;transition:background .15s;}#grb-checkout:hover{background:#145028;}#grb-loyalty{padding:9px 20px;background:#fff;border-bottom:1px solid rgba(17,27,20,.07);font-size:11px;color:rgba(17,27,20,.6);display:flex;align-items:center;gap:6px;}#grb-loyalty strong{color:#C9A227;font-weight:800;}';
  (document.head || document.body).appendChild(style);

  // Global basket state
  window.grbBasket = window.grbBasket || {};

  // Build FAB button
  var fab = document.createElement('button');
  fab.id = 'grb-fab';
  fab.setAttribute('aria-label', 'View basket');
  fab.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg><div><span id="grb-fab-count">0 ITEMS</span><span id="grb-fab-total">£0.00</span></div>';

  // Build overlay
  var overlay = document.createElement('div');
  overlay.id = 'grb-overlay';

  // Build drawer
  var drawer = document.createElement('div');
  drawer.id = 'grb-drawer';
  drawer.innerHTML = '<div id="grb-head"><div id="grb-head-title">🛒 Your Basket</div><button id="grb-head-close" aria-label="Close basket">✕</button></div><div id="grb-loyalty">⭐ You\'re earning <strong id="grb-pts">0 points</strong> on this order</div><div id="grb-bar"><div id="grb-bar-track"><div id="grb-bar-fill"></div></div><div id="grb-bar-msg">Add items to get started 🛒</div></div><div id="grb-items"><div id="grb-empty">Your basket is empty.<br>Browse our range and add items!</div></div><div id="grb-foot"><div id="grb-total-row"><span id="grb-total-label">Total</span><span id="grb-total-val">£0.00</span></div><button id="grb-checkout">Proceed to Checkout →</button></div>';

  // Append everything to body
  function appendAll() {
    if (!document.body) { setTimeout(appendAll, 50); return; }
    // Remove any existing instances
    ['grb-fab','grb-overlay','grb-drawer'].forEach(function(id){
      var el = document.getElementById(id);
      if (el) el.parentNode.removeChild(el);
    });
    document.body.appendChild(fab);
    document.body.appendChild(overlay);
    document.body.appendChild(drawer);

    // Wire up events
    fab.addEventListener('click', grbOpen);
    overlay.addEventListener('click', grbClose);
    document.getElementById('grb-head-close').addEventListener('click', grbClose);
    document.getElementById('grb-checkout').addEventListener('click', function(){
      window.location.href = 'https://shop.grabbi.uk/checkout';
    });
  }
  appendAll();

  // Open / close
  window.grbOpen = function() {
    grbRender();
    overlay.classList.add('open');
    drawer.classList.add('open');
  };
  window.grbClose = function() {
    overlay.classList.remove('open');
    drawer.classList.remove('open');
  };

  // Add item to global basket
  window.grbAdd = function(name, brand, price) {
    if (!window.grbBasket[name]) window.grbBasket[name] = { brand: brand, price: parseFloat(price), qty: 0 };
    window.grbBasket[name].qty++;
    grbUpdate();
  };

  // Remove / change qty
  window.grbQty = function(name, delta) {
    if (!window.grbBasket[name]) return;
    window.grbBasket[name].qty = Math.max(0, window.grbBasket[name].qty + delta);
    if (window.grbBasket[name].qty === 0) delete window.grbBasket[name];
    grbUpdate();
    grbRender();
  };

  // Update FAB
  function grbUpdate() {
    var items = Object.entries(window.grbBasket).filter(function(e){ return e[1].qty > 0; });
    var total = items.reduce(function(s,e){ return s + e[1].price * e[1].qty; }, 0);
    var count = items.reduce(function(s,e){ return s + e[1].qty; }, 0);

    fab.style.display = count > 0 ? 'inline-flex' : 'none';
    document.getElementById('grb-fab-count').textContent = count + ' ITEM' + (count !== 1 ? 'S' : '');
    document.getElementById('grb-fab-total').textContent = '£' + total.toFixed(2);
  }

  // Render drawer contents
  function grbRender() {
    var items = Object.entries(window.grbBasket).filter(function(e){ return e[1].qty > 0; });
    var total = items.reduce(function(s,e){ return s + e[1].price * e[1].qty; }, 0);
    var count = items.reduce(function(s,e){ return s + e[1].qty; }, 0);

    // Points
    var pts = Math.floor(total);
    document.getElementById('grb-pts').textContent = pts + ' point' + (pts !== 1 ? 's' : '');

    // Total
    document.getElementById('grb-total-val').textContent = '£' + total.toFixed(2);

    // Delivery bar
    var pct = Math.min((total / 25) * 100, 100);
    document.getElementById('grb-bar-fill').style.width = pct + '%';
    var rem = Math.max(0, 25 - total);
    var msg = document.getElementById('grb-bar-msg');
    if (rem <= 0) {
      msg.innerHTML = '🎉 Free local delivery unlocked!';
      msg.style.color = '#1A5C35';
    } else {
      msg.innerHTML = 'Add <strong style="color:#C2440E">£' + rem.toFixed(2) + ' more</strong> for free local delivery 🚚';
      msg.style.color = '';
    }

    // Items list
    var itemsEl = document.getElementById('grb-items');
    if (!items.length) {
      itemsEl.innerHTML = '<div id="grb-empty">Your basket is empty.<br>Browse our range and add items!</div>';
      return;
    }
    itemsEl.innerHTML = items.map(function(e) {
      var n = e[0], v = e[1];
      var safeName = n.replace(/\\/g,'\\\\').replace(/'/g,"\\'");
      return '<div class="grb-line"><div class="grb-line-info">' + n + '<span class="grb-line-brand">' + v.brand + '</span></div><div class="grb-qty"><button class="grb-qty-btn" onclick="grbQty(\'' + safeName + '\',-1)">−</button><span style="font-weight:700;font-size:14px;min-width:16px;text-align:center">' + v.qty + '</span><button class="grb-qty-btn" onclick="grbQty(\'' + safeName + '\',1)">+</button></div><div class="grb-line-price">£' + (v.price * v.qty).toFixed(2) + '</div></div>';
    }).join('');
  }

  // Hook into page addToBasket if present
  function hookPageBasket() {
    var orig = window.addToBasket;
    if (typeof orig === 'function' && !orig._grbHooked) {
      window.addToBasket = function(card, name, brand, price) {
        orig.apply(this, arguments);
        window.grbAdd(name, brand, price);
      };
      window.addToBasket._grbHooked = true;
    } else if (typeof orig !== 'function') {
      setTimeout(hookPageBasket, 300);
    }
  }
  setTimeout(hookPageBasket, 500);

})();
