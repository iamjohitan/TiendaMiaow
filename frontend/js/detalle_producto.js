const API_BASE_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.protocol === "file:"
  ? "http://localhost:4000"
  : "https://tienda-miaow-backend.onrender.com";

const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

function renderDetail(producto) {
  const loading = document.getElementById("detail-loading");
  const error = document.getElementById("detail-error");
  const content = document.getElementById("detail-content");

  if (loading) loading.style.display = "none";
  if (error) error.style.display = "none";
  if (content) content.style.display = "block";

  const precio = parseFloat(producto.precio).toFixed(2);
  const specs = producto.especificaciones || {};

  const img = document.getElementById("detail-img");
  if (img) { img.src = producto.imagen; img.alt = producto.nombre; }

  const marca = document.getElementById("detail-marca");
  if (marca) marca.textContent = producto.marca;

  const nombre = document.getElementById("detail-nombre");
  if (nombre) nombre.textContent = producto.nombre;

  const desc = document.getElementById("detail-descripcion");
  if (desc) desc.textContent = producto.descripcion;

  const bread = document.getElementById("breadcrumb-product");
  if (bread) bread.textContent = producto.nombre;

  const cat = document.getElementById("detail-categoria");
  if (cat) {
    const name = cat.querySelector("span") || cat;
    name.textContent = (producto.categoria || "").charAt(0).toUpperCase() + (producto.categoria || "").slice(1);
  }

  const precioEl = document.getElementById("detail-precio");
  if (precioEl) precioEl.textContent = `$${precio}`;

  document.title = `${producto.nombre} | Tienda Miaow`;

  const btnWs = document.getElementById("btn-whatsapp");
  if (btnWs) {
    const mensaje = `Hola Tienda Miaow! 😺\n\nEstoy interesado en este producto:\n\n*${producto.nombre}*\nMarca: ${producto.marca}\nPrecio: $${precio}\n\n¿Tienen disponibilidad?`;
    btnWs.href = `https://wa.me/573175067243?text=${encodeURIComponent(mensaje)}`;
  }

  const addBtn = document.getElementById("btn-add-cart-detail");
  if (addBtn) {
    addBtn.onclick = () => {
      window.addToCart(producto.id, producto.nombre, producto.precio, producto.imagen);
    };
  }

  if (specs && Object.keys(specs).length > 0) {
    renderSpecs(specs);
  }

  const stockBadge = document.getElementById("detail-stock-badge");
  if (stockBadge) {
    if (producto.stock > 0) {
      stockBadge.innerHTML = '<i class="bi bi-check-circle-fill"></i> En Stock';
      stockBadge.className = 'hero-badge';
      stockBadge.style.cssText = 'margin: 0; font-size: .7rem; background: rgba(16,185,129,.15); border-color: rgba(16,185,129,.3); color: var(--green);';
    } else {
      stockBadge.innerHTML = '<i class="bi bi-x-circle-fill"></i> Sin Stock';
      stockBadge.className = 'hero-badge';
      stockBadge.style.cssText = 'margin: 0; font-size: .7rem; background: rgba(236,72,153,.15); border-color: rgba(236,72,153,.3); color: var(--pink);';
    }
  }
}

function renderSpecs(specs) {
  const specContainer = document.getElementById("detail-specs");
  if (!specContainer) return;

  const entries = Object.entries(specs).filter(([k, v]) => v != null && v !== "");
  if (entries.length === 0) return;

  specContainer.innerHTML = `
    <div style="margin: 24px 0; padding: 20px; background: var(--bg-3); border-radius: var(--r-lg); border: 1px solid var(--bdr-2);">
      <h4 style="font-family: var(--f-heading); font-size: .9rem; font-weight: 700; color: var(--txt-1); margin-bottom: 14px; text-transform: uppercase; letter-spacing: .08em;">
        <i class="bi bi-info-circle me-2" style="color: var(--violet-3);"></i>Especificaciones
      </h4>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
        ${entries.map(([key, val]) => `
          <div style="padding: 8px 12px; background: rgba(255,255,255,.02); border-radius: var(--r-sm);">
            <span style="font-size: .7rem; color: var(--txt-3); text-transform: uppercase; letter-spacing: .06em; display: block; margin-bottom: 2px;">${key}</span>
            <span style="font-size: .85rem; color: var(--txt-1); font-weight: 600;">${val}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

async function cargarDetalle() {
  if (!productId) {
    window.location.href = "productos.html";
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/productos/${productId}`);
    if (!response.ok) throw new Error("Producto no encontrado");

    const producto = await response.json();
    renderDetail(producto);
  } catch (error) {
    console.error(error);
    const loading = document.getElementById("detail-loading");
    const errorEl = document.getElementById("detail-error");
    const content = document.getElementById("detail-content");
    if (loading) loading.style.display = "none";
    if (errorEl) errorEl.style.display = "flex";
    if (content) content.style.display = "none";
  }
}

document.addEventListener("DOMContentLoaded", cargarDetalle);
