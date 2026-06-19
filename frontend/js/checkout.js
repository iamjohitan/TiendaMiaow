const API_BASE_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.protocol === "file:"
  ? "http://localhost:4000"
  : "https://tiendamiaow-production.up.railway.app";

function loadCheckoutCart() {
  const cart = getCart();
  const container = document.getElementById("checkout-items");
  const totalEl = document.getElementById("checkout-total");
  const payBtn = document.getElementById("btn-pay");

  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = '<p style="color: var(--txt-3); font-size: .85rem; text-align: center; padding: 20px 0;">Tu carrito está vacío</p>';
    if (totalEl) totalEl.textContent = "$0.00";
    if (payBtn) payBtn.disabled = true;
    return;
  }

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  let html = "";
  cart.forEach(item => {
    html += `
      <div class="checkout-summary-item">
        <span class="checkout-summary-item-name">${item.name}</span>
        <span class="checkout-summary-item-qty">x${item.qty}</span>
        <span class="checkout-summary-item-price">$${(item.price * item.qty).toFixed(2)}</span>
      </div>
    `;
  });

  container.innerHTML = html;
  if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
  if (payBtn) payBtn.disabled = false;
}

function getCart() {
  try {
    const data = localStorage.getItem("miaow_cart");
    return data ? JSON.parse(data) : [];
  } catch { return []; }
}

function clearCart() {
  localStorage.removeItem("miaow_cart");
  const badges = document.querySelectorAll("#cart-count");
  badges.forEach(b => b.textContent = "0");
}

function showSuccess(orderId, total, email) {
  const overlay = document.createElement("div");
  overlay.className = "success-overlay";
  overlay.id = "success-overlay";

  const orderIdStr = `MIAOW-${String(orderId).padStart(6, "0")}`;

  const confettiColors = ["#7c3aed", "#06b6d4", "#ec4899", "#10b981", "#f59e0b", "#6366f1"];
  let confettiHtml = "";
  for (let i = 0; i < 60; i++) {
    const color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
    const left = Math.random() * 100;
    const delay = Math.random() * 2;
    const size = 4 + Math.random() * 6;
    const duration = 2 + Math.random() * 2;
    confettiHtml += `<div class="confetti-piece" style="left: ${left}%; width: ${size}px; height: ${size}px; background: ${color}; animation-duration: ${duration}s; animation-delay: ${delay}s;"></div>`;
  }

  overlay.innerHTML = `
    <div class="success-confetti">${confettiHtml}</div>
    <div class="success-card">
      <div class="success-check">
        <i class="bi bi-check-lg"></i>
      </div>
      <p class="success-order-id">Orden <span>${orderIdStr}</span></p>
      <h2 class="success-title">¡Compra Confirmada!</h2>
      <p class="success-text">Recibirás los detalles de tu pedido en <strong>${email}</strong>. Te contactaremos para coordinar la entrega.</p>
      <div class="success-details">
        <div class="success-detail-row">
          <span class="label">Orden</span>
          <span class="value">${orderIdStr}</span>
        </div>
        <div class="success-detail-row">
          <span class="label">Total</span>
          <span class="value">$${total.toFixed(2)}</span>
        </div>
        <div class="success-detail-row">
          <span class="label">Estado</span>
          <span class="value" style="color: var(--green);">Confirmado</span>
        </div>
      </div>
      <div class="d-flex gap-2">
        <a href="../index.html" class="btn btn-brand flex-1" style="justify-content: center; padding: 13px;">
          Volver al inicio
        </a>
        <a href="productos.html" class="btn btn-outline-brand flex-1" style="justify-content: center; padding: 13px;">
          Seguir comprando
        </a>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.style.overflow = "hidden";
}

document.addEventListener("DOMContentLoaded", () => {
  loadCheckoutCart();

  const payBtn = document.getElementById("btn-pay");
  if (!payBtn) return;

  payBtn.addEventListener("click", async () => {
    const name = document.getElementById("cf-name");
    const lastname = document.getElementById("cf-lastname");
    const email = document.getElementById("cf-email");
    const address = document.getElementById("cf-address");

    let valid = true;
    [name, lastname, email, address].forEach(el => {
      el.classList.remove("is-invalid");
      if (!el.value.trim()) { el.classList.add("is-invalid"); valid = false; }
    });

    if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      email.classList.add("is-invalid");
      valid = false;
    }

    if (!valid) {
      Swal.fire({ title: "Campos requeridos", text: "Completa todos los campos obligatorios.", icon: "warning", confirmButtonColor: "#7c3aed" });
      return;
    }

    const cart = getCart();
    if (cart.length === 0) {
      Swal.fire({ title: "Carrito vacío", text: "Agrega productos antes de pagar.", icon: "warning", confirmButtonColor: "#7c3aed" });
      return;
    }

    payBtn.disabled = true;
    payBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> Procesando...';

    try {
      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_name: `${name.value.trim()} ${lastname.value.trim()}`,
          user_email: email.value.trim(),
          shipping_address: address.value.trim(),
          items: cart.map(i => ({
            product_id: i.id,
            quantity: i.qty,
            unit_price: i.price,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Error al procesar");

      clearCart();
      const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
      showSuccess(data.order.id, total, email.value.trim());
    } catch (error) {
      console.error(error);
      payBtn.disabled = false;
      payBtn.innerHTML = '<i class="bi bi-shield-check me-2"></i>Pagar Ahora';
      Swal.fire({ title: "Error", text: error.message || "No se pudo procesar el pago.", icon: "error", confirmButtonColor: "#7c3aed" });
    }
  });
});
