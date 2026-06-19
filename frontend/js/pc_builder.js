const API_BASE_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.protocol === "file:"
  ? "http://localhost:4000"
  : "https://tiendamiaow-production.up.railway.app";
const API_URL = `${API_BASE_URL}/api/productos`;

let build = { cpu: null, mobo: null, ram: null, gpu: null, storage: null, psu: null, case: null };
let allProducts = [];
let currentSlot = "";

const names = {
  cpu: "Procesador", mobo: "Placa Madre", ram: "Memoria RAM",
  gpu: "Tarjeta Gráfica", storage: "Almacenamiento", psu: "Fuente de Poder", case: "Gabinete",
};

const defaultSlots = {
  cpu: { icon: "bi-cpu", title: "Procesador", desc: "El cerebro de tu computadora" },
  mobo: { icon: "bi-motherboard", title: "Placa Madre", desc: "La base de todo el sistema" },
  ram: { icon: "bi-memory", title: "Memoria RAM", desc: "Velocidad y multitarea" },
  gpu: { icon: "bi-gpu-card", title: "Tarjeta Gráfica", desc: "Potencia visual para juegos" },
  storage: { icon: "bi-device-ssd", title: "Almacenamiento", desc: "SSD o Disco Duro" },
  psu: { icon: "bi-lightning-charge", title: "Fuente de Poder", desc: "Energía para tu PC" },
  case: { icon: "bi-box", title: "Gabinete", desc: "La carcasa de tu estilo" },
};

const categoryOrder = ["cpu", "mobo", "ram", "gpu", "storage", "psu", "case"];

function createSlots() {
  const container = document.getElementById("pc-slots-container");
  if (!container) return;
  container.innerHTML = "";
  categoryOrder.forEach(cat => {
    const s = defaultSlots[cat];
    container.innerHTML += `
      <div class="builder-slot" id="slot-${cat}" onclick="openModal('${cat}')">
        <div class="slot-icon-wrapper"><i class="bi ${s.icon}"></i></div>
        <div class="flex-grow-1">
          <h5 style="font-size:.9rem;font-weight:700;color:var(--txt-1);margin-bottom:2px;">${s.title}</h5>
          <p style="font-size:.8rem;color:var(--txt-3);margin:0;">${s.desc}</p>
        </div>
        <button class="slot-action-btn"><i class="bi bi-plus-lg"></i></button>
      </div>`;
  });
}

function renderSummaryParts() {
  const container = document.getElementById("summary-parts");
  if (!container) return;
  let html = "";
  let hasItems = false;
  categoryOrder.forEach(cat => {
    const product = build[cat];
    if (product) {
      hasItems = true;
      const price = parseFloat(product.precio).toFixed(2);
      html += `
        <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--bdr-2);font-size:.82rem;">
          <div style="flex:1;min-width:0;">
            <span style="color:var(--txt-3);font-size:.7rem;text-transform:uppercase;letter-spacing:.06em;display:block;">${names[cat]}</span>
            <span style="color:var(--txt-1);font-weight:600;display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;overflow:hidden;">${product.nombre}</span>
          </div>
          <span style="color:var(--violet-2);font-weight:700;white-space:nowrap;margin-left:12px;">$${price}</span>
        </div>`;
    }
  });
  if (!hasItems) {
    html = `<p style="color:var(--txt-3);font-size:.875rem;text-align:center;padding:12px 0;">Ningún componente seleccionado aún.</p>`;
  }
  container.innerHTML = html;
}

document.addEventListener("DOMContentLoaded", async () => {
  createSlots();

  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Error en servidor");
    const data = await res.json();
    allProducts = Array.isArray(data) ? data : data.id ? [data] : [];
  } catch (error) {
    console.error("Error cargando DB:", error);
    Swal.fire("Error", "No se pudo conectar a la base de datos", "error");
  }

  restaurarProgreso();

  const modalSearchEl = document.getElementById("modal-search");
  if (modalSearchEl) {
    modalSearchEl.addEventListener("input", (e) => renderModal(e.target.value));
  }

  document.getElementById("btn-cotizar")?.addEventListener("click", () => window.cotizarWhatsApp());
  document.getElementById("btn-limpiar")?.addEventListener("click", () => window.limpiarTodo());
});

window.openModal = (category) => {
  currentSlot = category;
  const titulo = names[category] || "Componente";
  const titleEl = document.getElementById("modalSelectorLabel");
  if (titleEl) titleEl.textContent = `Seleccionar ${titulo}`;

  const inputSearch = document.getElementById("modal-search");
  if (inputSearch) inputSearch.value = "";

  renderModal();

  const modalEl = document.getElementById("modalSelector");
  if (modalEl) new bootstrap.Modal(modalEl).show();
};

function renderModal(searchTerm = "") {
  const container = document.getElementById("modal-products");
  if (!container) return;
  container.innerHTML = "";

  const term = searchTerm.toLowerCase();
  const filtered = allProducts.filter(p =>
    p.categoria === currentSlot &&
    (p.nombre.toLowerCase().includes(term) || p.marca.toLowerCase().includes(term))
  );

  if (filtered.length === 0) {
    container.innerHTML = `<div class="col-12 text-center" style="color:var(--txt-3);padding:40px 0;">No hay componentes disponibles para esta categoría.</div>`;
    return;
  }

  filtered.forEach(p => {
    const price = parseFloat(p.precio).toFixed(2);
    const specs = p.especificaciones || {};
    let specStr = "";
    if (specs.núcleos) specStr += `${specs.núcleos} núcleos, `;
    if (specs.frecuencia || specs.frecuencia_base) specStr += `${specs.frecuencia || specs.frecuencia_base}, `;
    if (specs.capacidad || specs.vram) specStr += `${specs.capacidad || specs.vram}, `;
    if (specs.almacenamiento) specStr += `${specs.almacenamiento}, `;
    if (specs.potencia) specStr += `${specs.potencia}, `;
    if (specs.tipo) specStr += `${specs.tipo}, `;
    if (specStr) specStr = specStr.slice(0, -2);

    const stockBadge = p.stock > 0
      ? `<span style="font-size:.65rem;color:var(--green);background:rgba(16,185,129,.12);padding:2px 8px;border-radius:var(--r-full);">En Stock</span>`
      : `<span style="font-size:.65rem;color:var(--pink);background:rgba(236,72,153,.12);padding:2px 8px;border-radius:var(--r-full);">Sin Stock</span>`;

    container.innerHTML += `
      <div class="col-md-6">
        <div class="modal-card" onclick="selectItem(${p.id})">
          <div class="d-flex align-items-center">
            <img src="${p.imagen}" class="rounded" style="width:72px;height:72px;object-fit:contain;background:var(--bg-3);padding:4px;">
            <div class="ms-3" style="flex:1;min-width:0;">
              <h6 style="font-size:.85rem;font-weight:700;color:var(--txt-1);margin-bottom:2px;line-height:1.3;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${p.nombre}</h6>
              <p style="font-size:.75rem;color:var(--txt-3);margin-bottom:4px;">${p.marca}</p>
              ${specStr ? `<p style="font-size:.7rem;color:var(--txt-3);margin-bottom:4px;opacity:.7;">${specStr}</p>` : ''}
              <div style="display:flex;align-items:center;justify-content:space-between;">
                <span style="font-size:.9rem;font-weight:800;color:var(--violet-2);">$${price}</span>
                ${stockBadge}
              </div>
            </div>
          </div>
        </div>
      </div>`;
  });
}

window.selectItem = (id) => {
  const product = allProducts.find(p => p.id === id);
  if (!product) return;
  build[currentSlot] = product;
  actualizarSlotVisual(currentSlot, product);
  guardarProgreso();
  updateTotal();

  const modalEl = document.getElementById("modalSelector");
  if (modalEl) bootstrap.Modal.getInstance(modalEl)?.hide();
};

window.removeItem = (event, category) => {
  event.stopPropagation();
  build[category] = null;
  guardarProgreso();
  updateTotal();
  actualizarSlotVacio(category);
};

function actualizarSlotVacio(category) {
  const slot = document.getElementById(`slot-${category}`);
  if (!slot) return;
  slot.classList.remove("selected");
  const data = defaultSlots[category];
  slot.innerHTML = `
    <div class="slot-icon-wrapper"><i class="bi ${data.icon}"></i></div>
    <div class="flex-grow-1">
      <h5 style="font-size:.9rem;font-weight:700;color:var(--txt-1);margin-bottom:2px;">${data.title}</h5>
      <p style="font-size:.8rem;color:var(--txt-3);margin:0;">${data.desc}</p>
    </div>
    <button class="slot-action-btn"><i class="bi bi-plus-lg"></i></button>`;
}

function actualizarSlotVisual(category, product) {
  const slot = document.getElementById(`slot-${category}`);
  if (!slot) return;
  slot.classList.add("selected");
  const price = parseFloat(product.precio).toFixed(2);
  slot.innerHTML = `
    <div class="slot-selected-detail animate-fade-in w-100">
      <img src="${product.imagen}" class="slot-selected-img" alt="${product.nombre}">
      <div class="flex-grow-1">
        <small style="font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--txt-3);">${names[category] || category}</small>
        <h5 style="font-size:.9rem;font-weight:700;color:var(--txt-1);margin-bottom:2px;">${product.nombre}</h5>
        <span style="font-size:.8rem;font-weight:700;color:var(--green);background:rgba(16,185,129,.12);padding:2px 10px;border-radius:var(--r-full);">$${price}</span>
      </div>
      <button class="slot-remove-btn" onclick="removeItem(event,'${category}')" title="Quitar"><i class="bi bi-trash3-fill"></i></button>
    </div>`;
}

function updateTotal() {
  let total = 0;
  let selectedCount = 0;

  Object.values(build).forEach(p => {
    if (p && p.precio) {
      total += Number(p.precio);
      selectedCount++;
    }
  });

  const formatted = `$${total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const totalEl = document.getElementById("total-price");
  if (totalEl) totalEl.textContent = formatted;

  const btnCotizar = document.getElementById("btn-cotizar");
  if (btnCotizar) btnCotizar.disabled = selectedCount === 0;

  const labelEl = document.getElementById("progress-label");
  const labelMobile = document.getElementById("progress-label-mobile");
  const fillEl = document.getElementById("pc-builder-progress-fill");
  const fillMobile = document.getElementById("pc-builder-progress-fill-mobile");

  const text = `${selectedCount} / 7`;
  if (labelEl) labelEl.textContent = text;
  if (labelMobile) labelMobile.textContent = text;

  const percent = Math.round((selectedCount / 7) * 100);
  if (fillEl) fillEl.style.width = `${percent}%`;
  if (fillMobile) fillMobile.style.width = `${percent}%`;

  renderSummaryParts();
}

function guardarProgreso() {
  localStorage.setItem("miaow_pc_build", JSON.stringify(build));
}

function restaurarProgreso() {
  const guardado = localStorage.getItem("miaow_pc_build");
  if (guardado) {
    try {
      const datos = JSON.parse(guardado);
      build = datos;
      Object.keys(build).forEach(key => {
        if (build[key]) actualizarSlotVisual(key, build[key]);
      });
      updateTotal();
    } catch (e) { console.error("Error restaurando:", e); }
  }
}

window.limpiarTodo = () => {
  Swal.fire({
    title: "¿Reiniciar ensamble?",
    text: "Se borrará tu selección actual.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#7c3aed",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, borrar",
  }).then(result => {
    if (result.isConfirmed) {
      localStorage.removeItem("miaow_pc_build");
      location.reload();
    }
  });
};

window.cotizarWhatsApp = () => {
  let total = 0;
  let msg = "Hola Tienda Miaow! 😺%0A%0AQuiero cotizar esta PC que armé en su web:%0A%0A";
  let itemsCount = 0;

  for (const [key, val] of Object.entries(build)) {
    if (val) {
      const catName = names[key] || key;
      const price = parseFloat(val.precio).toFixed(2);
      msg += `✅ *${catName}:* ${val.nombre} - $${price}%0A`;
      total += parseFloat(val.precio);
      itemsCount++;
    }
  }

  if (itemsCount === 0) {
    Swal.fire("Carrito Vacío", "Selecciona al menos un componente para cotizar.", "warning");
    return;
  }

  const totalFormatted = total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  msg += `%0A💰 *Total Estimado: $${totalFormatted}*`;
  window.open(`https://wa.me/573175067243?text=${msg}`, "_blank");
};
