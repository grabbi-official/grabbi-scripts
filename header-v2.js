(function(){
 var STORES = [
 { id:'aberkenfig', name:'Aberkenfig', lat:51.5469, lng:-3.6024,
 areas:['Aberkenfig','Bridgend','Maesteg','Tondu','Sarn','Pyle','Ogmore Vale'] },
 { id:'porthcawl', name:'Porthcawl', lat:51.4826, lng:-3.6981,
 areas:['Porthcawl'] }
 ];
 var nearestStore = STORES[0]; 
 function distKm(a1,o1,a2,o2){
 var R=6371,dA=(a2-a1)*Math.PI/180,dO=(o2-o1)*Math.PI/180;
 var a=Math.sin(dA/2)*Math.sin(dA/2)+Math.cos(a1*Math.PI/180)*Math.cos(a2*Math.PI/180)*Math.sin(dO/2)*Math.sin(dO/2);
 return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
 }
 function pickNearest(lat,lng){
 var best=STORES[0],min=Infinity;
 STORES.forEach(function(s){ var d=distKm(lat,lng,s.lat,s.lng); if(d<min){min=d;best=s;} });
 return best;
 }
 fetch('https://ipapi.co/json/',{cache:'force-cache'})
 .then(function(r){return r.json();})
 .then(function(d){
 if(d&&typeof d.latitude==='number'){
 nearestStore=pickNearest(d.latitude,d.longitude);
 var ann=document.getElementById('g-ann-full');
 var anns=document.getElementById('g-ann-short');
 if(ann&&nearestStore.id==='porthcawl'){
 ann.innerHTML='🚴 <span class="hl">Delivering Porthcawl</span> · Free delivery over £25 · Open 7am–10pm';
 if(anns) anns.innerHTML='🚴 <span class="hl">Porthcawl delivery</span> · Free over £25';
 }
 }
 })
 .catch(function(){});
 var LOGO = 'https://assets.zyrosite.com/WKfW2bGIcRiklr5N/grabbi-website-logo-y92jzvNAH3hunt99.webp';
 var SHOP = 'https://shop.grabbi.uk';
 var headerHTML =
 '<div id="g-announce">'+
 '<span id="g-ann-full">🚴 <span class="hl">Free delivery</span> on orders over £25 · Open 7am–10pm · 7 days a week</span>'+
 '<span id="g-ann-short">🚴 <span class="hl">Free delivery</span> over £25 · Open 7am–10pm</span>'+
 '</div>'+
 '<header id="g-header">'+
 '<div id="g-hi">'+
 '<a href="/" id="g-logo"><img src="'+LOGO+'" alt="Grabbi" width="160" height="40" loading="eager"></a>'+
 '<nav><ul id="g-nav">'+
 '<li class="gni"><a href="'+SHOP+'" class="gnl" target="_blank">Shop <span class="gbg gbg-g">Order Now</span></a></li>'+
 '<li class="gni">'+
 '<a href="/grocery-delivery-areas" class="gnl">Delivery Areas <span class="garr">▾</span></a>'+
 '<ul class="gdrop">'+
 '<li><a href="/grocery-delivery-aberkenfig" class="gdl">Aberkenfig</a></li>'+
 '<li><a href="/grocery-delivery-porthcawl" class="gdl">Porthcawl</a></li>'+
 '<li><a href="/grocery-delivery-bridgend-town-centre" class="gdl">Bridgend Town Centre</a></li>'+
 '<li><a href="/grocery-delivery-bridgend" class="gdl">Bridgend</a></li>'+
 '<li><a href="/grocery-delivery-maesteg" class="gdl">Maesteg</a></li>'+
 '<li><a href="/grocery-delivery-tondu" class="gdl">Tondu</a></li>'+
 '<li><a href="/grocery-delivery-sarn" class="gdl">Sarn</a></li>'+
 '<li><a href="/grocery-delivery-pyle" class="gdl">Pyle</a></li>'+
 '<li><a href="/grocery-delivery-ogmore-vale" class="gdl">Ogmore Vale</a></li>'+
 '<li><a href="/grocery-delivery-pencoed" class="gdl">Pencoed <span class="gdb">Soon</span></a></li>'+
 '</ul>'+
 '</li>'+
 '<li class="gni">'+
 '<a href="/world-food-delivery" class="gnl">World Foods 🌍 <span class="garr">▾</span></a>'+
 '<ul class="gdrop">'+
 '<li><a href="/indian-grocery-delivery" class="gdl">🇮🇳 Indian</a></li>'+
 '<li><a href="https://shop.grabbi.uk/category/chinese" class="gdl">🇨🇳 Chinese</a></li>'+
 '<li><a href="https://shop.grabbi.uk/category/filipino" class="gdl">🇵🇭 Filipino</a></li>'+
 '<li><a href="https://shop.grabbi.uk/category/sri-lankan" class="gdl">🇱🇰 Sri Lankan</a></li>'+
 '<li><a href="https://shop.grabbi.uk/category/caribbean" class="gdl">🇯🇲 Caribbean</a></li>'+
 '<li><a href="https://shop.grabbi.uk/category/african" class="gdl">🌍 African</a></li>'+
 '<li><a href="https://shop.grabbi.uk/category/japanese-korean" class="gdl">🇯🇵 Japanese & Korean</a></li>'+
 '<li><a href="https://shop.grabbi.uk/category/middle-eastern" class="gdl">🇱🇧 Middle Eastern</a></li>'+
 '<li><a href="https://shop.grabbi.uk/category/eastern-european" class="gdl">🇵🇱 Eastern European</a></li>'+
 '<li><a href="/world-food-delivery" class="gdl" style="color:var(--gg);font-weight:700">All World Foods →</a></li>'+
 '</ul>'+
 '</li>'+
 '<li class="gni"><a href="/about-grabbi" class="gnl">About</a></li>'+
 '<li class="gni"><a href="/grabbi-sustainable-grocery-delivery" class="gnl">Sustainability</a></li>'+
 '<li class="gni"><a href="/grabbi-franchise-opportunity" class="gnl">Franchise <span class="gbg gbg-l">Join Us</span></a></li>'+
 '<li class="gni"><a href="/grabbi-stories" class="gnl">Blog</a></li>'+
 '<li class="gni"><a href="/contact-grabbi" class="gnl">Contact</a></li>'+
 '</ul></nav>'+
 '<div id="g-act">'+
 '<div id="g-sw"><input id="g-si" type="search" placeholder="Search groceries…" autocomplete="off"><button class="gib" id="g-sb"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg></button></div>'+
 '<button class="gib" id="g-vb"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg></button>'+
 '<div id="g-aw"><button class="gib" id="g-ab"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></button>'+
 '<ul id="g-ad">'+
 '<li class="gah"><div class="gag">Welcome back 👋</div><div class="gas">Manage your account</div></li>'+
 '<li><a href="/account/orders" class="gal">📦 My Orders</a></li>'+
 '<li><a href="/account" class="gal">👤 My Account</a></li>'+
 '<li><a href="/account/points" class="gal">⭐ Loyalty Points</a></li>'+
 '<li><a href="/account/addresses" class="gal">📍 Saved Addresses</a></li>'+
 '<li><a href="/signout" class="gal">🚪 Sign Out</a></li>'+
 '</ul>'+
 '</div>'+
 '<a href="'+SHOP+'/cart" class="gib" id="g-cb"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg><span class="gcb" id="g-cbadge" style="display:none">0</span></a>'+
 '<a href="'+SHOP+'" target="_blank" id="g-ob">🛒 Order Now</a>'+
 '<button id="g-hb"><span></span><span></span><span></span></button>'+
 '</div>'+
 '</div>'+
 '</header>'+
 '<div id="g-header-spacer"></div>'+
 '<div id="g-mm">'+
 '<div id="g-mt">'+
 '<a href="/" id="g-ml"><img src="'+LOGO+'" alt="Grabbi" height="34"></a>'+
 '<button id="g-mc">✕</button>'+
 '</div>'+
 '<div id="g-mn">'+
 '<a href="'+SHOP+'" class="gmr" target="_blank">Shop <span class="gbg gbg-g">Order Now</span></a>'+
 '<div class="gmd"></div>'+
 '<div class="gmr" id="g-at">Delivery Areas <span id="g-aa" style="font-size:11px;color:rgba(17,27,20,0.3)">▾</span></div>'+
 '<div class="gms" id="g-as">'+
 '<a href="/grocery-delivery-aberkenfig" class="gmsl">Aberkenfig</a>'+
 '<a href="/grocery-delivery-porthcawl" class="gmsl">Porthcawl</a>'+
 '<a href="/grocery-delivery-bridgend" class="gmsl">Bridgend</a>'+
 '<a href="/grocery-delivery-maesteg" class="gmsl">Maesteg</a>'+
 '<a href="/grocery-delivery-tondu" class="gmsl">Tondu</a>'+
 '<a href="/grocery-delivery-sarn" class="gmsl">Sarn</a>'+
 '<a href="/grocery-delivery-pyle" class="gmsl">Pyle</a>'+
 '<a href="/grocery-delivery-ogmore-vale" class="gmsl">Ogmore Vale</a>'+
 '<a href="/grocery-delivery-pencoed" class="gmsl">Pencoed <span class="gbg gbg-l" style="margin-left:6px">Soon</span></a>'+
 '</div>'+
 '<div class="gmd"></div>'+
 '<div class="gmr" id="g-wft">🌍 World Foods <span id="g-wfa" style="font-size:11px;color:rgba(17,27,20,0.3)">▾</span></div>'+
'<div class="gms" id="g-wfs">'+
'<a href="/indian-grocery-delivery" class="gmsl">🇮🇳 Indian</a>'+
'<a href="https://shop.grabbi.uk/category/chinese" class="gmsl">🇨🇳 Chinese</a>'+
'<a href="https://shop.grabbi.uk/category/filipino" class="gmsl">🇵🇭 Filipino</a>'+
'<a href="https://shop.grabbi.uk/category/sri-lankan" class="gmsl">🇱🇰 Sri Lankan</a>'+
'<a href="https://shop.grabbi.uk/category/caribbean" class="gmsl">🇯🇲 Caribbean</a>'+
'<a href="https://shop.grabbi.uk/category/african" class="gmsl">🌍 African</a>'+
'<a href="https://shop.grabbi.uk/category/japanese-korean" class="gmsl">🇯🇵 Japanese & Korean</a>'+
'<a href="https://shop.grabbi.uk/category/middle-eastern" class="gmsl">🇱🇧 Middle Eastern</a>'+
'<a href="https://shop.grabbi.uk/category/eastern-european" class="gmsl">🇵🇱 Eastern European</a>'+
'<a href="/world-food-delivery" class="gmsl" style="color:var(--gg);font-weight:700">All World Foods →</a>'+
'</div>'+
 '<div class="gmd"></div>'+
 '<a href="/about-grabbi" class="gmr">About</a>'+
 '<div class="gmd"></div>'+
 '<a href="/grabbi-sustainable-grocery-delivery" class="gmr">Sustainability</a>'+
 '<div class="gmd"></div>'+
 '<a href="/grabbi-franchise-opportunity" class="gmr">Franchise <span class="gbg gbg-l">Join Us</span></a>'+
 '<div class="gmd"></div>'+
 '<a href="/grabbi-stories" class="gmr">Blog</a>'+
 '<div class="gmd"></div>'+
 '<a href="/contact-grabbi" class="gmr">Contact</a>'+
 '<div class="gmd"></div>'+
 '<a href="/account" class="gmr">👤 My Account</a>'+
 '<a href="'+SHOP+'" target="_blank" class="gmcta">🛒 Order Now</a>'+
 '</div>'+
 '</div>'+
 '<div id="g-vt"><div class="gvd"></div><span id="g-vtx">Listening…</span></div>';
 function inject(){
 if(!document.body) return setTimeout(inject,50);
 ['g-announce','g-header','g-header-spacer','g-mm','g-vt'].forEach(function(id){
 var el=document.getElementById(id);
 if(el) el.parentNode.removeChild(el);
 });
 var wrap=document.createElement('div');
 wrap.innerHTML=headerHTML;
 var ref=document.body.firstChild;
 while(wrap.firstChild){ document.body.insertBefore(wrap.firstChild,ref); }
 initHeader();
 }
 function isOpen(s){var now=new Date();var ukHour=parseInt(now.toLocaleString('en-GB',{timeZone:'Europe/London',hour:'numeric',hour12:false}));var ukMin=parseInt(now.toLocaleString('en-GB',{timeZone:'Europe/London',minute:'numeric'}));var ukTime=ukHour+ukMin/60;return ukTime>=s.open&&ukTime<s.close;}
 function initHeader(){
 var ann=34,hh=64,hs=52;
 var hdr=document.getElementById('g-header');
 var anc=document.getElementById('g-announce');
 var spc=document.getElementById('g-header-spacer');
 var SHOP='https://shop.grabbi.uk';
 spc.style.height=(ann+hh)+'px';
 window.addEventListener('scroll',function(){
 var s=window.scrollY>50;
 hdr.classList.toggle('scrolled',s);
 anc.classList.toggle('hidden',s);
 spc.style.height=(s?hs:ann+hh)+'px';
 },{passive:true});
 var sw=document.getElementById('g-sw'),si=document.getElementById('g-si');
 document.getElementById('g-sb').addEventListener('click',function(){var o=sw.classList.toggle('open');if(o)si.focus();else si.value='';});
 si.addEventListener('keydown',function(e){if(e.key==='Enter'&&si.value.trim())location.href=SHOP+'/search?q='+encodeURIComponent(si.value.trim());if(e.key==='Escape'){sw.classList.remove('open');si.value='';}});
 var aw=document.getElementById('g-aw');
 document.getElementById('g-ab').addEventListener('click',function(e){e.stopPropagation();aw.classList.toggle('open');});
 document.addEventListener('click',function(){aw.classList.remove('open');});
 function uc(){
 try{
 var n=parseInt(localStorage.getItem('grabbi_cart_count')||'0');
 var b=document.getElementById('g-cbadge');
 b.style.display=n>0?'flex':'none';
 if(n>0)b.textContent=n>99?'99+':n;
 }catch(e){}
 }
 uc();
 window.addEventListener('storage',uc);
 var vb=document.getElementById('g-vb'),vt=document.getElementById('g-vt'),vtx=document.getElementById('g-vtx'),rec=null,lis=false;
 if('webkitSpeechRecognition'in window||'SpeechRecognition'in window){
 var SR=window.SpeechRecognition||window.webkitSpeechRecognition;
 rec=new SR();rec.lang='en-GB';rec.interimResults=true;
 rec.onstart=function(){lis=true;vb.classList.add('listening');vtx.textContent='Listening…';vt.classList.add('show');};
 rec.onresult=function(e){
 var t=Array.from(e.results).map(function(r){return r[0].transcript;}).join('');
 vtx.textContent='"'+t+'"';
 if(e.results[0].isFinal)setTimeout(function(){vt.classList.remove('show');location.href=SHOP+'/search?q='+encodeURIComponent(t);},600);
 };
 rec.onerror=rec.onend=function(){lis=false;vb.classList.remove('listening');setTimeout(function(){vt.classList.remove('show');},800);};
 vb.addEventListener('click',function(){lis?rec.stop():rec.start();});
 }else{vb.style.display='none';}
 var hbtn=document.getElementById('g-hb'),mm=document.getElementById('g-mm');
 hbtn.addEventListener('click',function(){hbtn.classList.add('open');mm.classList.add('open');document.body.style.overflow='hidden';});
 document.getElementById('g-mc').addEventListener('click',function(){
    hbtn.classList.remove('open');mm.classList.remove('open');document.body.style.overflow='';
    // Reset all accordions when closing menu
    var wfs=document.getElementById('g-wfs');
    var wfa=document.getElementById('g-wfa');
    var gas=document.getElementById('g-as');
    var gaa=document.getElementById('g-aa');
    if(wfs)wfs.classList.remove('open');
    if(wfa)wfa.textContent='▾';
    if(gas)gas.classList.remove('open');
    if(gaa)gaa.textContent='▾';
  });
 document.getElementById('g-wft').addEventListener('click',function(){
    var s=document.getElementById('g-wfs'),a=document.getElementById('g-wfa');
    s.classList.toggle('open');a.textContent=s.classList.contains('open')?'▴':'▾';
  });
  document.getElementById('g-at').addEventListener('click',function(){
 var s=document.getElementById('g-as'),a=document.getElementById('g-aa');
 s.classList.toggle('open');a.textContent=s.classList.contains('open')?'▴':'▾';
 });
 }
 function initAppBtn(){
 if(!document.body) return setTimeout(initAppBtn,50);
 var DAYS=7,BID='grabbi-app-btn';
 try{ var d=localStorage.getItem('grabbi_app_dismissed'); if(d&&(Date.now()-parseInt(d))<DAYS*86400000)return; }catch(e){}
 var btn=document.createElement('a');
 btn.id=BID;btn.href='https://shop.grabbi.uk';
 btn.setAttribute('aria-label','Order on Grabbi');
 btn.innerHTML=
 '<span class="gab-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1A5C35" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg></span>'+
 '<span class="gab-text"><span class="gab-sub">Order on</span><span class="gab-main">Grabbi App</span></span>'+
 '<button class="gab-x" id="grabbi-app-x">✕</button>';
 var old=document.getElementById(BID);
 if(old)old.parentNode.removeChild(old);
 document.body.appendChild(btn);
 setTimeout(function(){btn.classList.add('show');},800);
 document.getElementById('grabbi-app-x').addEventListener('click',function(e){
 e.preventDefault();e.stopPropagation();
 try{localStorage.setItem('grabbi_app_dismissed',Date.now());}catch(e){}
 btn.style.transform='translateX(-50%) translateY(100px)';btn.style.opacity='0';
 setTimeout(function(){btn.parentNode&&btn.parentNode.removeChild(btn);},400);
 });
 }
 function injectSchema(){
 var schema={
 '@context':'https://schema.org','@graph':[
 {'@type':'GroceryStore','@id':'https://www.grabbi.uk/locations/aberkenfig',
 'name':'Grabbi — Aberkenfig',
 'description':'Fast eco-friendly grocery delivery in South Wales. Free delivery over £25. Open 7am–10pm 7 days.',
 'url':'https://www.grabbi.uk','telephone':'+447356011358','email':'hello@grabbi.uk',
 'image':'https://assets.zyrosite.com/WKfW2bGIcRiklr5N/grabbi-website-logo-y92jzvNAH3hunt99.webp',
 'address':{'@type':'PostalAddress','streetAddress':'Starlux Building, Bridgend Road','addressLocality':'Aberkenfig','addressRegion':'Bridgend, Wales','postalCode':'CF32 9BG','addressCountry':'GB'},
 'geo':{'@type':'GeoCoordinates','latitude':'51.5469','longitude':'-3.6024'},
 'openingHoursSpecification':[{'@type':'OpeningHoursSpecification','dayOfWeek':['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],'opens':'07:00','closes':'22:00'}],
 'priceRange':'£','areaServed':[{'@type':'City','name':'Aberkenfig'},{'@type':'City','name':'Bridgend'},{'@type':'City','name':'Porthcawl'},{'@type':'City','name':'Maesteg'}],
 'sameAs':['https://www.instagram.com/grabbiuk','https://www.facebook.com/grabbiuk','https://www.tiktok.com/@grabbiuk']
 }
 ]
 };
 var s=document.createElement('script');
 s.type='application/ld+json';
 s.text=JSON.stringify(schema);
 document.head.appendChild(s);
 }
 if(document.readyState==='loading'){
 document.addEventListener('DOMContentLoaded',function(){ inject(); initAppBtn(); injectSchema(); });
 } else {
 inject(); initAppBtn(); injectSchema();
 }
})();
