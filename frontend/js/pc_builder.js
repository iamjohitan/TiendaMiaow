const API_URL = "https://tiendamiaow-production.up.railway.app/api/productos";

// 1. ESTADO DEL ENSAMBLE (Las 7 categorías)
let build = {
  cpu: null,
  mobo: null,
  ram: null,
  gpu: null,
  storage: null, // Nuevo
  psu: null, // Nuevo
  case: null, // Nuevo
};

let allProducts = [];
let currentSlot = "";

// 2. NOMBRES PARA TITULOS Y WHATSAPP (Mapeo de las 7 categorías)
const names = {
  cpu: "Procesador",
  mobo: "Placa Madre",
  ram: "Memoria RAM",
  gpu: "Tarjeta Gráfica",
  storage: "Almacenamiento", // Nuevo
  psu: "Fuente de Poder", // Nuevo
  case: "Gabinete", // Nuevo
};

// =========================================================
// 3. INICIALIZACIÓN
// =========================================================
document.addEventListener("DOMContentLoaded", async () => {
  // A. Cargar Productos
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Error en servidor");
    const data = await res.json();

    // Asegurar que sea array
    allProducts = Array.isArray(data) ? data : data.id ? [data] : [];
    console.log("✅ Productos cargados:", allProducts.length);

    // Restaurar si había algo guardado
    restaurarProgreso();
  } catch (error) {
    console.error("Error cargando DB:", error);
    Swal.fire(
      "Error",
      "No se pudo conectar a la base de datos (Puerto 4000)",
      "error"
    );
  }

  // B. Buscador del modal
  const modalSearch = document.getElementById("modalSearch");
  if (modalSearch) {
    modalSearch.addEventListener("input", (e) => {
      renderModal(e.target.value);
    });
  }
});

// =========================================================
// 4. LÓGICA DEL MODAL
// =========================================================
window.openModal = (category) => {
  currentSlot = category;

  // Actualizar título del modal
  const titulo = names[category] || "Componente";
  document.getElementById("modalTitle").textContent = `Seleccionar ${titulo}`;

  // Limpiar buscador
  const inputSearch = document.getElementById("modalSearch");
  if (inputSearch) inputSearch.value = "";

  renderModal();

  new bootstrap.Modal(document.getElementById("componentModal")).show();
};

function renderModal(searchTerm = "") {
  const container = document.getElementById("modalContainer");
  container.innerHTML = "";

  const term = searchTerm.toLowerCase();

  // FILTRAR PRODUCTOS: Coincidencia de categoría + Búsqueda texto
  const filtered = allProducts.filter(
    (p) =>
      p.categoria === currentSlot &&
      (p.nombre.toLowerCase().includes(term) ||
        p.marca.toLowerCase().includes(term))
  );

  if (filtered.length === 0) {
    container.innerHTML = `<div class="col-12 text-center text-muted py-4">No hay componentes disponibles para esta categoría.</div>`;
    return;
  }

  filtered.forEach((p) => {
    const price = parseFloat(p.precio).toFixed(2);
    container.innerHTML += `
      <div class="col-md-6">
        <div class="card h-100 modal-card border-0 shadow-sm p-2" onclick="selectItem(${p.id})">
          <div class="d-flex align-items-center">
            <img src="${p.imagen}" class="rounded" style="width: 80px; height: 80px; object-fit: contain;">
            <div class="ms-3">
              <h6 class="fw-bold mb-1 text-dark" style="font-size: 0.95rem;">${p.nombre}</h6>
              <p class="text-muted small mb-1">${p.marca}</p>
              <span class="text-primary fw-bold">$${price}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  });
}

// =========================================================
// 5. SELECCIÓN Y ACTUALIZACIÓN
// =========================================================
window.selectItem = (id) => {
  const product = allProducts.find((p) => p.id === id);
  if (!product) return;

  // 1. Guardar en el objeto
  build[currentSlot] = product;

  // 2. Actualizar visualmente el slot
  actualizarSlotVisual(currentSlot, product);

  // 3. Guardar y Recalcular
  guardarProgreso();
  updateTotal();

  // 4. Cerrar modal
  const modalEl = document.getElementById("componentModal");
  const modal = bootstrap.Modal.getInstance(modalEl);
  modal.hide();
};

function actualizarSlotVisual(category, product) {
  const slot = document.getElementById(`slot-${category}`);
  if (!slot) return; // Protección por si el ID del HTML está mal

  slot.classList.add("selected");

  // Actualizar textos dentro del slot
  const nameEl = slot.querySelector(`#${category}-name`);
  const priceEl = slot.querySelector(`#${category}-price`);

  if (nameEl) {
    nameEl.textContent = product.nombre;
    nameEl.className = "fw-bold mb-1 text-primary";
  }

  if (priceEl) {
    const price = parseFloat(product.precio).toFixed(2);
    priceEl.innerHTML = `<span class="badge bg-success bg-opacity-10 text-success">$${price}</span>`;
  }
}

function updateTotal() {
  let total = 0;

  // Recorremos el objeto 'build' y sumamos si hay producto seleccionado
  Object.values(build).forEach((p) => {
    // Verificamos si 'p' existe y si tiene precio
    if (p && p.precio) {
      // Aseguramos que sea número (si viene como "100.00", parseFloat lo convierte)
      total += Number(p.precio);
    }
  });

  // Formato de moneda
  const totalFormatted = `$${total.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  const subtotalEl = document.getElementById("subtotal-price"); // Corregido: ID del HTML anterior era este?
  const totalEl = document.getElementById("total-price");

  // En tu último HTML, los IDs son 'resumen-subtotal' y 'resumen-total'
  // CORRECCIÓN FINAL DE IDs:
  const elSubtotal = document.getElementById("resumen-subtotal");
  const elTotal = document.getElementById("resumen-total");

  if (elSubtotal) elSubtotal.textContent = totalFormatted;
  if (elTotal) elTotal.textContent = totalFormatted;
}

// =========================================================
// 6. FUNCIONES EXTRAS (Guardar, Limpiar, Cotizar)
// =========================================================

function guardarProgreso() {
  localStorage.setItem("miaow_pc_build", JSON.stringify(build));
}

function restaurarProgreso() {
  const guardado = localStorage.getItem("miaow_pc_build");
  if (guardado) {
    try {
      const datos = JSON.parse(guardado);
      build = datos; // Restaurar objeto

      // Restaurar visualmente cada slot ocupado
      Object.keys(build).forEach((key) => {
        if (build[key]) {
          actualizarSlotVisual(key, build[key]);
        }
      });
      updateTotal();
    } catch (e) {
      console.error("Error restaurando sesión:", e);
    }
  }
}

window.limpiarTodo = function () {
  Swal.fire({
    title: "¿Reiniciar ensamble?",
    text: "Se borrará tu selección actual.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#8f74c5",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, borrar",
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.removeItem("miaow_pc_build");
      location.reload();
    }
  });
};

window.cotizarWhatsApp = () => {
  let total = 0;
  let msg =
    "Hola Tienda Miaow! 😺%0A%0AQuiero cotizar esta PC que armé en su web:%0A%0A";
  let itemsCount = 0;

  // Recorrer el objeto build para armar el mensaje
  for (const [key, val] of Object.entries(build)) {
    if (val) {
      const nombreCat = names[key] || key; // Usar el nombre bonito
      const precio = parseFloat(val.precio).toFixed(2);

      msg += `✅ *${nombreCat}:* ${val.nombre} - $${precio}%0A`;
      total += parseFloat(val.precio);
      itemsCount++;
    }
  }

  if (itemsCount === 0) {
    Swal.fire(
      "Carrito Vacío",
      "Selecciona al menos un componente para cotizar.",
      "warning"
    );
    return;
  }

  const totalFormatted = total.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  msg += `%0A💰 *Total Estimado: $${totalFormatted}*`;

  // Abrir WhatsApp en nueva pestaña
  window.open(`https://wa.me/573175067243?text=${msg}`, "_blank");
};
