const products = [
  {id:"chicken",name:{id:"Red Chicken",en:"Red Chicken"},price:12000,levels:10,levelName:{id:"Level kepedasan",en:"Spice level"},desc:{id:"Dua potong ayam crispy dengan bumbu merah khas RED FOOD.",en:"Two pieces of crispy chicken with RED FOOD's signature red seasoning."},image:"https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=900&q=85",alt:"Red crispy chicken"},
  {id:"potato",name:{id:"Red Potato",en:"Red Potato"},price:6000,levels:5,levelName:{id:"Level kepedasan",en:"Spice level"},desc:{id:"Olahan ubi merah dengan sensasi rasa yang bisa dipilih.",en:"Red sweet potato bites with your choice of intensity."},image:"https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=900&q=85",alt:"Potato fries"},
  {id:"cake",name:{id:"Red Cake",en:"Red Cake"},price:10000,levels:5,levelName:{id:"Level topping",en:"Topping level"},desc:{id:"Kue lembut dengan pilihan tingkat topping favoritmu.",en:"Soft cake with your choice of topping level."},image:"https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?auto=format&fit=crop&w=900&q=85",alt:"Red cake"}
];
const translations = {
 id:{navHome:"Beranda",navMenu:"Menu",navLocation:"Lokasi",heroEyebrow:"BERANI PEDAS. BERANI BEDA.",heroTitle:'Saatnya menikmati rasa <span>yang lebih berani.</span>',heroDesc:"Pilihan makanan spesial dengan level yang bisa kamu tentukan sendiri.",heroButton:'Jelajahi Menu <span>↗</span>',heroNote:"Dibuat untuk pecinta rasa",menuEyebrow:"PILIHAN SPESIAL",menuTitle:'Menu <span>favorit.</span>',menuDesc:"Pilih menu, tentukan level, lalu masukkan ke keranjang.",cartEyebrow:"PESANANMU",cartTitle:'Keranjang <span>belanja.</span>',cartDesc:"Periksa pilihanmu sebelum checkout.",subtotal:"Subtotal",extraInfo:"Biaya tambahan level",total:"Total",checkout:'Lanjut Checkout <span>→</span>',checkoutNote:"Checkout ini hanya simulasi untuk tugas sekolah.",locationEyebrow:"TEMUKAN KAMI",locationTitle:'Lokasi <span>RED FOOD.</span>',locationDesc:"Lokasi contoh untuk demonstrasi website.",mapCaption:"📍 Lokasi demo: area Alun-Alun Tulungagung. Bukan alamat toko sungguhan.",footerText:"Rasa berani, pilihanmu sendiri.",checkoutEyebrow:"KONFIRMASI",checkoutTitle:"Pesananmu siap!",confirm:"Konfirmasi Pesanan",choose:"Pilih level",add:"＋ Tambah ke Keranjang",added:"Ditambahkan ke keranjang!",empty:"Keranjangmu masih kosong. Yuk pilih menu dulu!",remove:"Hapus",level:"Level",extra:"Biaya level +Rp3.000",emptyCheckout:"Tambahkan makanan sebelum checkout.",success:"Pesanan berhasil dibuat! Terima kasih.",unit:"item"},
 en:{navHome:"Home",navMenu:"Menu",navLocation:"Location",heroEyebrow:"BOLD FLAVOR. BOLD CHOICE.",heroTitle:'Time to enjoy a <span>bolder flavor.</span>',heroDesc:"Special food with levels you can choose to match your taste.",heroButton:'Explore Menu <span>↗</span>',heroNote:"Made for flavor lovers",menuEyebrow:"SPECIAL PICKS",menuTitle:'Favorite <span>menu.</span>',menuDesc:"Choose your food, select a level, and add it to your cart.",cartEyebrow:"YOUR ORDER",cartTitle:'Shopping <span>cart.</span>',cartDesc:"Review your choices before checkout.",subtotal:"Subtotal",extraInfo:"Level surcharge",total:"Total",checkout:'Continue to Checkout <span>→</span>',checkoutNote:"This checkout is a school project simulation only.",locationEyebrow:"FIND US",locationTitle:'RED FOOD <span>location.</span>',locationDesc:"Sample location for the website demonstration.",mapCaption:"📍 Demo location: Alun-Alun Tulungagung area. Not a real store address.",footerText:"Bold flavor, your choice.",checkoutEyebrow:"CONFIRMATION",checkoutTitle:"Your order is ready!",confirm:"Confirm Order",choose:"Choose a level",add:"＋ Add to Cart",added:"Added to cart!",empty:"Your cart is empty. Pick something from the menu!",remove:"Remove",level:"Level",extra:"Level surcharge +Rp3,000",emptyCheckout:"Add food before checking out.",success:"Order placed successfully! Thank you.",unit:"items"}
};
let language="id", selections={}, cart=JSON.parse(localStorage.getItem("redFoodCart")||"[]");
const money=n=>"Rp"+n.toLocaleString("id-ID");
const t=key=>translations[language][key]||key;
function renderProducts(){
 const grid=document.getElementById("productGrid");
 grid.innerHTML=products.map(p=>{const selected=selections[p.id]||1;return `<article class="product-card reveal"><div class="product-image"><img src="${p.image}" alt="${p.alt}" loading="lazy"></div><div class="product-content"><div class="product-top"><h3>${p.name[language]}</h3><span class="price">${money(p.price)}</span></div><p class="product-desc">${p.desc[language]}</p><label class="level-label">${p.levelName[language]} (${p.levels})</label><div class="level-options">${Array.from({length:p.levels},(_,i)=>i+1).map(n=>`<button class="level-btn ${selected===n?"active":""}" data-product="${p.id}" data-level="${n}" aria-label="${t("level")} ${n}">${n}</button>`).join("")}</div><p class="level-help">${t("extra")}</p><button class="add-btn" data-add="${p.id}">${t("add")}</button></div></article>`}).join("");
 grid.querySelectorAll("[data-level]").forEach(btn=>btn.addEventListener("click",()=>{selections[btn.dataset.product]=Number(btn.dataset.level);renderProducts()}));
 grid.querySelectorAll("[data-add]").forEach(btn=>btn.addEventListener("click",()=>addToCart(btn.dataset.add)));
 observeReveals();
}
function persist(){localStorage.setItem("redFoodCart",JSON.stringify(cart))}
function addToCart(id){
 const p=products.find(x=>x.id===id),level=selections[id]||1;
 const key=id+"-"+level,existing=cart.find(x=>x.key===key);
 if(existing)existing.qty++;else cart.push({key,id,level,qty:1});
 persist();renderCart();showToast(t("added"));
}
function renderCart(){
 const wrap=document.getElementById("cartItems");
 if(!cart.length)wrap.innerHTML=`<div class="cart-empty">🛒<p>${t("empty")}</p></div>`;
 else wrap.innerHTML=cart.map(item=>{const p=products.find(x=>x.id===item.id),unit=p.price+3000;return `<div class="cart-row"><div><div class="cart-name">${p.name[language]}</div><div class="cart-meta">${t("level")} ${item.level} · ${money(p.price)} + Rp3.000</div><div class="cart-controls"><button class="qty-btn" data-qty="${item.key}" data-change="-1">−</button><strong>${item.qty}</strong><button class="qty-btn" data-qty="${item.key}" data-change="1">+</button><button class="remove-btn" data-remove="${item.key}">${t("remove")}</button></div></div><div class="cart-price">${money(unit*item.qty)}</div></div>`}).join("");
 wrap.querySelectorAll("[data-qty]").forEach(b=>b.addEventListener("click",()=>changeQty(b.dataset.qty,Number(b.dataset.change))));
 wrap.querySelectorAll("[data-remove]").forEach(b=>b.addEventListener("click",()=>{cart=cart.filter(x=>x.key!==b.dataset.remove);persist();renderCart()}));
 const subtotal=cart.reduce((s,x)=>s+products.find(p=>p.id===x.id).price*x.qty,0),extra=cart.reduce((s,x)=>s+3000*x.qty,0);
 document.getElementById("subtotal").textContent=money(subtotal);document.getElementById("extraTotal").textContent=money(extra);document.getElementById("total").textContent=money(subtotal+extra);document.getElementById("cartCount").textContent=cart.reduce((s,x)=>s+x.qty,0);
 document.getElementById("checkoutButton").disabled=!cart.length;
}
function changeQty(key,delta){const item=cart.find(x=>x.key===key);if(!item)return;item.qty+=delta;if(item.qty<=0)cart=cart.filter(x=>x.key!==key);persist();renderCart()}
function showToast(message){const toast=document.getElementById("toast");toast.textContent=message;toast.classList.add("show");clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>toast.classList.remove("show"),2300)}
function checkout(){if(!cart.length){showToast(t("emptyCheckout"));return}const summary=document.getElementById("checkoutSummary");summary.innerHTML=cart.map(x=>{const p=products.find(y=>y.id===x.id);return `<div class="checkout-item"><span>${p.name[language]} · ${t("level")} ${x.level} × ${x.qty}</span><strong>${money((p.price+3000)*x.qty)}</strong></div>`}).join("");document.getElementById("dialogTotal").textContent=document.getElementById("total").textContent;document.getElementById("checkoutDialog").showModal()}
function setLanguage(){language=language==="id"?"en":"id";document.documentElement.lang=language;document.getElementById("languageSwitch").textContent=language==="id"?"🇮🇩 ID":"🇬🇧 EN";document.querySelectorAll("[data-i18n]").forEach(el=>el.innerHTML=t(el.dataset.i18n));renderProducts();renderCart()}
function observeReveals(){const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");io.unobserve(e.target)}}),{threshold:.12});document.querySelectorAll(".reveal:not(.visible)").forEach(el=>io.observe(el))}
document.getElementById("cartNav").addEventListener("click",()=>document.getElementById("cart").scrollIntoView({behavior:"smooth"}));
document.getElementById("languageSwitch").addEventListener("click",setLanguage);
document.getElementById("checkoutButton").addEventListener("click",checkout);
document.getElementById("closeDialog").addEventListener("click",()=>document.getElementById("checkoutDialog").close());
document.getElementById("confirmOrder").addEventListener("click",()=>{cart=[];persist();renderCart();document.getElementById("checkoutDialog").close();showToast(t("success"))});
renderProducts();renderCart();observeReveals();
