const CART_KEY = "miaow_cart";

function getCart() {
  try {
    const data = localStorage.getItem(CART_KEY);
    return data ? JSON.parse(data) : [];
  } catch { return []; }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

function updateCartBadge() {
  const cart = getCart();
  const total = cart.reduce((s, i) => s + i.qty, 0);
  const badges = document.querySelectorAll("#cart-count");
  badges.forEach(b => {
    b.textContent = total;
    if (total > 0) {
      b.classList.add("pulse");
      setTimeout(() => b.classList.remove("pulse"), 400);
    }
  });
}

window.addToCart = function(id, name, price, image) {
  const cart = getCart();
  const existing = cart.find(i => i.id === id);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id, name, price: parseFloat(price), image, qty: 1 });
  }

  saveCart(cart);
  renderCartOffcanvas();

  const btn = event && event.target ? event.target.closest(".btn-add-cart") : null;
  if (btn) {
    btn.classList.add("added");
    const original = btn.innerHTML;
    btn.innerHTML = '<i class="bi bi-check-lg"></i> Agregado';
    setTimeout(() => {
      btn.classList.remove("added");
      btn.innerHTML = original;
    }, 1500);
  }

  Swal.fire({
    icon: "success",
    title: "Agregado",
    text: `${name} se agregó al carrito`,
    timer: 1500,
    showConfirmButton: false,
    toast: true,
    position: "top-end",
    background: "var(--bg-2)",
    color: "var(--txt-1)",
    iconColor: "var(--green)",
  });
};

window.removeFromCart = function(id) {
  const cart = getCart().filter(i => i.id !== id);
  saveCart(cart);
  renderCartOffcanvas();
};

window.updateCartQty = function(id, delta) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (item) {
    item.qty = Math.max(1, item.qty + delta);
    saveCart(cart);
    renderCartOffcanvas();
  }
};

function renderCartOffcanvas() {
  const body = document.getElementById("cart-offcanvas-body");
  if (!body) return;

  const cart = getCart();

  if (cart.length === 0) {
    body.innerHTML = `
      <div class="cart-empty">
        <i class="bi bi-bag"></i>
        <p>Tu carrito está vacío</p>
        <a href="productos.html" class="btn btn-brand btn-sm">Ver productos</a>
      </div>
    `;
    return;
  }

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  let itemsHtml = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" class="cart-item-img" />
      <div>
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</div>
      </div>
      <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 6px;">
        <button class="cart-item-remove" onclick="removeFromCart(${item.id})" title="Eliminar">
          <i class="bi bi-x-lg"></i>
        </button>
        <div class="cart-item-qty">
          <button class="cart-qty-btn" onclick="updateCartQty(${item.id}, -1)">−</button>
          <span class="cart-qty-value">${item.qty}</span>
          <button class="cart-qty-btn" onclick="updateCartQty(${item.id}, 1)">+</button>
        </div>
      </div>
    </div>
  `).join("");

  const checkoutUrl = window.location.pathname.includes("/pages/")
    ? "checkout.html"
    : "pages/checkout.html";

  body.innerHTML = `
    <div style="flex: 1; overflow-y: auto;">
      ${itemsHtml}
    </div>
    <div class="cart-footer">
      <div class="cart-footer-total">
        <span>Total</span>
        <span class="cart-total-amount">$${total.toFixed(2)}</span>
      </div>
      <a href="${checkoutUrl}" class="btn btn-brand w-100" style="padding: 13px; justify-content: center;">
        Pagar Ahora <i class="bi bi-arrow-right ms-2"></i>
      </a>
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();

  const offcanvas = document.getElementById("cartOffcanvas");
  if (offcanvas) {
    offcanvas.addEventListener("show.bs.offcanvas", renderCartOffcanvas);
  }
});
