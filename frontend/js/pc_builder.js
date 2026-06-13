const API_BASE_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.protocol === "file:"
  ? "http://localhost:4000"
  : "https://tiendamiaow-production.up.railway.app";
const API_URL = `${API_BASE_URL}/api/productos`;

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

const defaultSlotContents = {
  cpu: {
    icon: "bi-cpu",
    title: "Procesador",
    desc: "El cerebro de tu computadora"
  },
  mobo: {
    icon: "bi-motherboard",
    title: "Placa Madre",
    desc: "La base de todo el sistema"
  },
  ram: {
    icon: "bi-memory",
    title: "Memoria RAM",
    desc: "Velocidad y multitarea"
  },
  gpu: {
    icon: "bi-gpu-card",
    title: "Tarjeta Gráfica",
    desc: "Potencia visual para juegos"
  },
  storage: {
    icon: "bi-device-ssd",
    title: "Almacenamiento",
    desc: "SSD o Disco Duro"
  },
  psu: {
    icon: "bi-lightning-charge",
    title: "Fuente de Poder",
    desc: "Energía para tu PC"
  },
  case: {
    icon: "bi-box",
    title: "Gabinete",
    desc: "La carcasa de tu estilo"
  }
};

window.removeItem = (event, category) => {
  event.stopPropagation(); // Prevenir abrir el modal al hacer clic en borrar
  build[category] = null;
  guardarProgreso();
  updateTotal();
  actualizarSlotVacio(category);
};

function actualizarSlotVacio(category) {
  const slot = document.getElementById(`slot-${category}`);
  if (!slot) return;
  
  slot.classList.remove("selected");
  const data = defaultSlotContents[category];
  
  slot.innerHTML = `
    <div class="slot-icon-wrapper slot-icon text-primary bg-primary bg-opacity-10">
      <i class="bi ${data.icon}"></i>
    </div>
    <div class="flex-grow-1">
      <h5 class="mb-1 fw-bold text-dark" id="${category}-name">${data.title}</h5>
      <p class="mb-0 text-muted small" id="${category}-price">${data.desc}</p>
    </div>
    <button class="slot-action-btn add btn btn-sm btn-outline-secondary rounded-circle shadow-sm">
      <i class="bi bi-plus-lg"></i>
    </button>
  `;
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
        <small class="text-uppercase text-muted font-monospace fw-bold" style="font-size: 0.7rem; letter-spacing: 0.5px;">${names[category] || category}</small>
        <h5 class="mb-1 fw-bold text-primary" style="font-size: 0.95rem;">${product.nombre}</h5>
        <span class="badge bg-success bg-opacity-10 text-success">$${price}</span>
      </div>
      <button class="slot-remove-btn" onclick="removeItem(event, '${category}')" title="Quitar componente">
        <i class="bi bi-trash3-fill"></i>
      </button>
    </div>
  `;
}

function updateTotal() {
  let total = 0;
  let selectedCount = 0;

  // Recorremos el objeto 'build' y sumamos si hay producto seleccionado
  Object.values(build).forEach((p) => {
    if (p && p.precio) {
      total += Number(p.precio);
      selectedCount++;
    }
  });

  // Formato de moneda
  const totalFormatted = `$${total.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  const elSubtotal = document.getElementById("resumen-subtotal");
  const elTotal = document.getElementById("resumen-total");

  if (elSubtotal) elSubtotal.textContent = totalFormatted;
  if (elTotal) elTotal.textContent = totalFormatted;

  // Actualizar barra de progreso de armado
  const progressText = document.getElementById("progress-text");
  const progressFill = document.getElementById("progress-fill");

  if (progressText) {
    progressText.textContent = `${selectedCount} / 7`;
  }
  if (progressFill) {
    const percent = Math.round((selectedCount / 7) * 100);
    progressFill.style.width = `${percent}%`;
  }
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
