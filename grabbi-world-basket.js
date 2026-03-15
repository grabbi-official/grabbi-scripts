// Grabbi World Foods Floating Basket
// Injected via Hostinger custom code box - appends to body like Nacre button
(function() {

  // Inject CSS
  var style = document.createElement('style');
  style.textContent = '#gwf-fab{position:fixed;bottom:24px;right:20px;z-index:2147483647;display:none;align-items:center;gap:12px;background:#111B14;color:#fff;padding:14px 20px;border-radius:999px;font-family:"Barlow",sans-serif;cursor:pointer;border:none;box-shadow:0 6px 24px rgba(17,27,20,0.35);transition:transform .2s,box-shadow .2s;}#gwf-fab:hover{transform:translateY(-3px);box-shadow:0 10px 32px rgba(17,27,20,0.45);}#gwf-fab-count{font-size:11px;font-weight:800;color:#B5E550;text-transform:uppercase;letter-spacing:1px;display:block;}#gwf-fab-total{font-family:"Barlow Condensed",sans-serif;font-weight:900;font-size:22px;line-height:1;color:#fff;}#gwf-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:2147483645;display:none;}#gwf-overlay.open{display:block;}#gwf-drawer{position:fixed;bottom:0;left:0;right:0;background:#fff;border-radius:20px 20px 0 0;z-index:2147483646;transform:translateY(100%);transition:transform .32s cubic-bezier(.16,1,.3,1);max-height:82vh;display:flex;flex-direction:column;}#gwf-drawer.open{transform:translateY(0);}#gwf-drawer-head{background:#111B14;padding:16px 20px;display:flex;align-items:center;justify-content:space-between;border-radius:20px 20px 0 0;}#gwf-drawer-title{font-family:"Barlow Condensed",sans-serif;font-weight:900;font-size:22px;text-transform:uppercase;color:#fff;}#gwf-drawer-close{background:rgba(255,255,255,.1);border:none;color:#fff;width:28px;height:28px;border-radius:50%;cursor:pointer;font-size:14px;}#gwf-bar-wrap{padding:12px 20px;background:#FAF7F0;border-bottom:1px solid rgba(17,27,20,.07);}#gwf-bar-track{height:5px;background:rgba(17,27,20,.1);border-radius:3px;overflow:hidden;margin:6px 0;}#gwf-bar-fill{height:100%;background:linear-gradient(90deg,#1A5C35,#B5E550);border-radius:3px;transition:width .4s;width:0%;}#gwf-bar-msg{font-size:11px;color:rgba(17,27,20,.5);}#gwf-items{flex:1;overflow-y:auto;padding:12px 20px;}#gwf-empty{text-align:center;padding:32px 0;color:rgba(17,27,20,.3);font-size:13px;}.gwf-line{display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid rgba(17,27,20,.06);}.gwf-line-name{flex:1;font-size:13px;font-weight:600;color:#111B14;}.gwf-line-brand{font-size:10px;color:rgba(17,27,20,.35);font-weight:600;display:block;text-transform:uppercase;}.gwf-qty{display:flex;align-items:center;gap:6px;}.gwf-qty-btn{width:26px;height:26px;border-radius:50%;border:1.5px solid rgba(17,27,20,.15);background:#fff;font-size:15px;cursor:pointer;color:#111B14;display:flex;align-items:center;justify-content:center;}.gwf-qty-btn:hover{border-color:#1A5C35;color:#1A5C35;}.gwf-line-price{font-family:"Barlow Condensed",sans-serif;font-weight:900;font-size:16px;color:#1A5C35;min-width:52px;text-align:right;}#gwf-foot{padding:16px 20px;border-top:1px solid rgba(17,27,20,.08);}#gwf-total-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;}#gwf-total-label{font-size:14px;font-weight:700;}#gwf-total-val{font-family:"Barlow Condensed",sans-serif;font-weight:900;font-size:22px;color:#1A5C35;}#gwf-checkout-btn{width:100%;background:#1A5C35;color:#fff;font-family:"Barlow Condensed",sans-serif;font-weight:900;font-size:20px;text-transform:uppercase;letter-spacing:1px;padding:16px;border-radius:12px;border:none;cursor:pointer;transition:background .15s;}#gwf-checkout-btn:hover{background:#145028;}';
  (document.head || document.body).appendChild(style);

  // Build FAB
  var fab = document.createElement('button');
  fab.id = 'gwf-fab';
  fab.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg><div><span id="gwf-fab-count">0 ITEMS</span><span id="gwf-fab-total">£0.00</span></div>';
  fab.onclick = function(){ openGWFBasket(); };

  // Build overlay
  var overlay = document.createElement('div');
  overlay.id = 'gwf-overlay';
  overlay.onclick = function(){ closeGWFBasket(); };

  // Build drawer
  var drawer = document.createElement('div');
  drawer.id = 'gwf-drawer';
  drawer.innerHTML = '<div id="gwf-drawer-head"><div id="gwf-drawer-title">🛒 Your Basket</div><button id="gwf-drawer-close" onclick="closeGWFBasket()">✕</button></div><div id="gwf-bar-wrap"><div id="gwf-bar-track"><div id="gwf-bar-fill"></div></div><div id="gwf-bar-msg">Add items to get started</div></div><div id="gwf-items"><div id="gwf-empty">Your basket is empty.<br>Add items above!</div></div><div id="gwf-foot"><div id="gwf-total-row"><span id="gwf-total-label">Total</span><span id="gwf-total-val">£0.00</span></div><button id="gwf-checkout-btn">Proceed to Checkout →</button></div>';

  // Append all to body
  function appendBasket() {
    if (!document.body) { setTimeout(appendBasket, 50); return; }
    document.body.appendChild(fab);
    document.body.appendChild(overlay);
    document.body.appendChild(drawer);
    document.getElementById('gwf-checkout-btn').addEventListener('click', function(){
      window.location.href = 'https://shop.grabbi.uk/checkout';
    });
  }
  appendBasket();

  // Global basket state
  window.gwfBasket = {};

  // Override addToBasket from page
  function setupHook() {
    var origAdd = window.addToBasket;
    if (typeof origAdd === 'function') {
      window.addToBasket = function(card, name, brand, price) {
        // Call original
        origAdd.apply(this, arguments);
        // Also update our floating basket
        if (!window.gwfBasket[name]) window.gwfBasket[name] = { price: price, brand: brand, qty: 0 };
        window.gwfBasket[name].qty++;
        updateGWFBasket();
      };
    } else {
      setTimeout(setupHook, 200);
    }
  }
  setTimeout(setupHook, 300);

  function updateGWFBasket() {
    var items = Object.entries(window.gwfBasket).filter(function(e){ return e[1].qty > 0; });
    var total = items.reduce(function(s,e){ return s + e[1].price * e[1].qty; }, 0);
    var count = items.reduce(function(s,e){ return s + e[1].qty; }, 0);

    // Update FAB
    fab.style.display = count > 0 ? 'inline-flex' : 'none';
    document.getElementById('gwf-fab-count').textContent = count + ' ITEM' + (count !== 1 ? 'S' : '');
    document.getElementById('gwf-fab-total').textContent = '£' + total.toFixed(2);

    // Update total
    document.getElementById('gwf-total-val').textContent = '£' + total.toFixed(2);

    // Update bar
    var pct = Math.min((total / 25) * 100, 100);
    document.getElementById('gwf-bar-fill').style.width = pct + '%';
    var rem = Math.max(0, 25 - total);
    var msg = document.getElementById('gwf-bar-msg');
    if (rem <= 0) { msg.innerHTML = '🎉 Free local delivery unlocked!'; msg.style.color = '#1A5C35'; }
    else { msg.innerHTML = 'Add <strong>£' + rem.toFixed(2) + ' more</strong> for free delivery 🚚'; msg.style.color = ''; }

    // Update items list
    var itemsEl = document.getElementById('gwf-items');
    if (!items.length) {
      itemsEl.innerHTML = '<div id="gwf-empty">Your basket is empty.<br>Add items above!</div>';
      return;
    }
    itemsEl.innerHTML = items.map(function(e) {
      var name = e[0], v = e[1];
      return '<div class="gwf-line"><div class="gwf-line-name">' + name + '<span class="gwf-line-brand">' + v.brand + '</span></div><div class="gwf-qty"><button class="gwf-qty-btn" onclick="gwfQty(\'' + name.replace(/'/g,"\\'") + '\',-1)">−</button><span>' + v.qty + '</span><button class="gwf-qty-btn" onclick="gwfQty(\'' + name.replace(/'/g,"\\'") + '\',1)">+</button></div><div class="gwf-line-price">£' + (v.price * v.qty).toFixed(2) + '</div></div>';
    }).join('');
  }

  window.gwfQty = function(name, delta) {
    if (!window.gwfBasket[name]) return;
    window.gwfBasket[name].qty = Math.max(0, window.gwfBasket[name].qty + delta);
    if (window.gwfBasket[name].qty === 0) delete window.gwfBasket[name];
    updateGWFBasket();
  };

  window.openGWFBasket = function() {
    overlay.classList.add('open');
    drawer.classList.add('open');
  };

  window.closeGWFBasket = function() {
    overlay.classList.remove('open');
    drawer.classList.remove('open');
  };

})();
