/**
 * ==========================================
 * 🛒 SHOPKART - CART TOTAL CALCULATOR
 * (Amazon / Flipkart style)
 * Features: Array methods, Object handling,
 * Tiered Discount logic
 * ==========================================
 */

// ------------------------------------------
// 1. DATA MODELS
// ------------------------------------------

// Products available in the store (image URLs from Unsplash)
const products = [
  { id: 1, name: "Smart TV 55\"", price: 45000, category: "electronics", image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=200" },
  { id: 2, name: "Refrigerator 320L", price: 28000, category: "appliance", image: "https://images.unsplash.com/photo-1571175443880-49e7d25b0b0a?w=200" },
  { id: 3, name: "Smartphone 5G", price: 19999, category: "electronics", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200" },
  { id: 4, name: "Webcam 4K", price: 4999, category: "electronics", image: "https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=200" },
  { id: 5, name: "Mechanical Keyboard", price: 3499, category: "electronics", image: "https://images.unsplash.com/photo-1587829750337-1bf590cdc786?w=200" },
  { id: 6, name: "Laptop Stand", price: 1499, category: "accessories", image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200" },
  { id: 7, name: "Wireless Mouse", price: 999, category: "accessories", image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200" },
{ id: 8, name: "Mouse Pad", price: 399, category: "accessories", image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200" },
  { id: 9, name: "USB-C Cable", price: 299, category: "accessories", image: "https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=200" },
  { id: 10, name: "Basmati Rice 5kg", price: 549, category: "grocery", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200" },
  { id: 11, name: "Olive Oil 1L", price: 899, category: "grocery", image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=200" },
  { id: 12, name: "Green Tea Box", price: 299, category: "grocery", image: "https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=200" },
  { id: 13, name: "Sports Shoes", price: 2499, category: "fashion", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200" },
  { id: 14, name: "Casual T-Shirt", price: 599, category: "fashion", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200" },
  { id: 15, name: "Denim Jacket", price: 1999, category: "fashion", image: "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=200" }
];

// Cart - starts empty
let cart = [];

// Tiered discount rules based on total amount
// 1000+   -> 10%
// 5000+   -> 15%
// 10000+  -> 20%
const discountSlabs = [
  { min: 10000, rate: 0.20 },
  { min: 5000,  rate: 0.15 },
  { min: 1000,  rate: 0.10 }
];

// Coupon codes (extra discount on top of slab)
const couponRules = {
  SAVE10: { value: 0.10, minOrder: 500 },
  FLAT200: { value: 200, minOrder: 1000 },
  BOSS: { value: 0.25, minOrder: 0 } // 25% off any order — the BOSS deal!
};

const FREE_DELIVERY_THRESHOLD = 5000;
const DELIVERY_CHARGE = 40;

// ------------------------------------------
// 2. DOM REFERENCES
// ------------------------------------------
const productGrid = document.getElementById("productGrid");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const couponInput = document.getElementById("couponInput");
const applyCouponBtn = document.getElementById("applyCouponBtn");
const couponMsg = document.getElementById("couponMsg");
const priceItems = document.getElementById("priceItems");
const discountVal = document.getElementById("discountVal");
const couponVal = document.getElementById("couponVal");
const deliveryVal = document.getElementById("deliveryVal");
const grandTotal = document.getElementById("grandTotal");
const savingsMsg = document.getElementById("savingsMsg");
const placeOrderBtn = document.getElementById("placeOrderBtn");

// Current coupon code
let appliedCoupon = null;
let currentCategory = "all"; // current selected category

// ------------------------------------------
// 3. CORE FUNCTIONS
// ------------------------------------------

// Render the product grid using map() + join()
// Filter by the selected category
function renderProducts() {
  const list = currentCategory === "all"
    ? products
    : products.filter(p => p.category === currentCategory);

  productGrid.innerHTML = list.map(p => `
    <div class="product-card">
      <div class="product-image"><img src="${p.image}" alt="${p.name}" loading="lazy" /></div>
      <div class="product-name">${p.name}</div>
      <div class="product-price">₹${p.price.toLocaleString('en-IN')}</div>
      <button class="add-to-cart" data-id="${p.id}">ADD TO CART</button>
    </div>`).join("");
}

// Calculate subtotal using reduce
function getSubtotal() {
  return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// Get total item count using reduce
function getItemCount() {
  return cart.reduce((count, item) => count + item.quantity, 0);
}

// Calculate tiered discount based on subtotal
function getTierDiscount(subtotal) {
  for (const slab of discountSlabs) {
    if (subtotal >= slab.min) {
      return { rate: slab.rate, amount: subtotal * slab.rate };
    }
  }
  return { rate: 0, amount: 0 };
}

// Calculate coupon discount
function getCouponDiscount(subtotal) {
  if (!appliedCoupon || !couponRules[appliedCoupon]) return 0;
  const rule = couponRules[appliedCoupon];
  if (subtotal < rule.minOrder) return 0;
  if (rule.value >= 1) return rule.value; // fixed amount
  return subtotal * rule.value; // percentage
}

// Render the cart items into #cartItems
function renderCart() {
  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="empty-cart">
        <span class="big">🛒</span>
        Your cart is empty!<br>Add some products above.
      </div>`;
    return;
  }
cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-image"><img src="${item.image}" alt="${item.name}" /></div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">₹${(item.price * item.quantity).toLocaleString('en-IN')}</div>
        <div class="qty-controls">
          <button class="qty-btn" data-id="${item.id}" data-delta="-1">−</button>
          <span class="qty-value">${item.quantity}</span>
          <button class="qty-btn" data-id="${item.id}" data-delta="1">+</button>
        </div>
      </div>
      <button class="remove-item" data-id="${item.id}" title="Remove">✕</button>
    </div>`).join("");
}

// Render the full price summary
function renderSummary() {
  const subtotal = getSubtotal();
  const itemCount = getItemCount();
  const tier = getTierDiscount(subtotal);
  const couponDiscount = getCouponDiscount(subtotal);

  // Delivery charges
  const delivery = subtotal >= FREE_DELIVERY_THRESHOLD || subtotal === 0 ? 0 : DELIVERY_CHARGE;

  const totalDiscount = tier.amount + couponDiscount;
  const total = subtotal - totalDiscount + delivery;

  // Update DOM
  cartCount.textContent = itemCount;
  priceItems.textContent = `₹${subtotal.toLocaleString('en-IN')} (${itemCount} item${itemCount === 1 ? '' : 's'})`;
  discountVal.textContent = tier.amount > 0 ? `- ₹${tier.amount.toLocaleString('en-IN')} (${tier.rate * 100}%)` : "- ₹0";
  couponVal.textContent = couponDiscount > 0 ? `- ₹${couponDiscount.toLocaleString('en-IN')}` : "- ₹0";
  deliveryVal.textContent = delivery === 0 ? "FREE" : `₹${delivery}`;
  grandTotal.textContent = `₹${total.toLocaleString('en-IN')}`;
  savingsMsg.textContent = `You will save ₹${totalDiscount.toLocaleString('en-IN')} on this order`;

  // Coupon validity message
  if (appliedCoupon) {
    if (couponDiscount > 0) {
      couponMsg.textContent = `✅ Coupon ${appliedCoupon} applied!`;
      couponMsg.classList.remove("error");
    } else {
      couponMsg.textContent = `❌ Invalid or below minimum order for ${appliedCoupon}`;
      couponMsg.classList.add("error");
    }
  }
}

// Add a product to cart by id
function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;

  const existing = cart.find(item => item.id === id);
  if (existing) {
    cart = cart.map(item =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
  } else {
    cart = [...cart, { ...product, quantity: 1 }];
  }
  renderCart();
  renderSummary();
}

// Update quantity for a given id
function updateQuantity(id, delta) {
  cart = cart
    .map(item =>
      item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
    )
    .filter(item => item.quantity > 0);
  renderCart();
  renderSummary();
}

// Remove an item by id
function removeItem(id) {
  cart = cart.filter(item => item.id !== id);
  renderCart();
  renderSummary();
}

// ------------------------------------------
// 4. EVENT LISTENERS
// ------------------------------------------

// Category filter buttons
document.querySelectorAll(".cat-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    currentCategory = btn.dataset.cat;
    // Update active state
    document.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    // Update section title
    const titleText = btn.textContent.trim().replace(/^\S+\s+/, ""); // remove emoji
    document.getElementById("sectionTitle").textContent = titleText || "Deals of the Day";
    renderProducts();
  });
});

// Add to cart buttons (event delegation)
productGrid.addEventListener("click", (e) => {
  if (e.target.classList.contains("add-to-cart")) {
    addToCart(Number(e.target.dataset.id));
  }
});

// Quantity +/- and remove buttons (event delegation)
cartItems.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const id = Number(btn.dataset.id);
  if (btn.classList.contains("qty-btn")) {
    updateQuantity(id, Number(btn.dataset.delta));
  } else if (btn.classList.contains("remove-item")) {
    removeItem(id);
  }
});

// Apply coupon
applyCouponBtn.addEventListener("click", () => {
  appliedCoupon = couponInput.value.trim().toUpperCase();
  renderSummary();
});

// Place order
placeOrderBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Your cart is empty! Add some products first.");
    return;
  }
  const subtotal = getSubtotal();
  const tier = getTierDiscount(subtotal);
  const couponDiscount = getCouponDiscount(subtotal);
  const total = subtotal - tier.amount - couponDiscount;
  alert(`🎉 Order Placed Successfully!\n\nTotal: ₹${total.toLocaleString('en-IN')}\nYou saved: ₹${(tier.amount + couponDiscount).toLocaleString('en-IN')}\n\nThank you for shopping with ShopKart!`);
  // Reset cart
  cart = [];
  appliedCoupon = null;
  couponInput.value = "";
  couponMsg.textContent = "";
  renderCart();
  renderSummary();
});

// ------------------------------------------
// 5. INITIAL RENDER
// ------------------------------------------
renderProducts();
renderCart();
renderSummary();
