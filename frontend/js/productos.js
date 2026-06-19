const API_BASE_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.protocol === "file:"
  ? "http://localhost:4000"
  : "https://tiendamiaow-production.up.railway.app";
const PRODUCTOS_ENDPOINT = "/api/productos";

const productGrid = document.getElementById("product-grid");
const loadingState = document.getElementById("loading-state");
const errorState = document.getElementById("error-state");
const noResultsState = document.getElementById("no-results-state");

const searchInput = document.getElementById("busqueda");
const filterCategoria = document.getElementById("categoria");
const filterMarca = document.getElementById("marca");
const sortOrder = document.getElementById("orden");
const resetButton = document.getElementById("btn-reset");
const resultsCount = document.getElementById("results-count");

let allProducts = [];

const categoryNames = {
  cpu: "Procesadores",
  gpu: "Tarjetas Gráficas",
  mobo: "Placas Madre",
  ram: "Memorias RAM",
  storage: "Almacenamiento",
  psu: "Fuentes de Poder",
  case: "Gabinetes",
};

function createProductCard(producto) {
  const formattedPrice = parseFloat(producto.precio).toFixed(2);
  const specs = producto.especificaciones || {};
  let specSummary = "";
  if (specs.nucleos) specSummary += `${specs.nucleos} núcleos · `;
  if (specs.frecuencia) specSummary += `${specs.frecuencia} · `;
  if (specs.capacidad) specSummary += `${specs.capacidad} · `;
  if (specs.vram) specSummary += `${specs.vram} · `;
  if (specs.almacenamiento) specSummary += `${specs.almacenamiento} · `;
  if (specs.potencia) specSummary += `${specs.potencia} · `;
  if (specs.factor) specSummary += `${specs.factor} · `;
  if (specSummary) specSummary = specSummary.slice(0, -3);

  const stockStatus = producto.stock > 0
    ? '<span class="badge" style="background: rgba(16,185,129,.15); color: var(--green); font-size: .65rem; font-weight: 600; padding: 3px 10px; border-radius: var(--r-full);">En Stock</span>'
    : '<span class="badge" style="background: rgba(236,72,153,.15); color: var(--pink); font-size: .65rem; font-weight: 600; padding: 3px 10px; border-radius: var(--r-full);">Sin Stock</span>';

  return `
    <div class="col">
      <div class="product-card">
        <a href="detalle_producto.html?id=${producto.id}" class="product-card-img-wrap text-decoration-none">
          <img src="${producto.imagen}" alt="${producto.nombre}" loading="lazy" />
        </a>
        <div class="product-card-body">
          <span class="product-brand-tag">${producto.marca}</span>
          <h3 class="product-name">${producto.nombre}</h3>
          ${specSummary ? `<p style="font-size: .75rem; color: var(--txt-3); margin-bottom: 10px; line-height: 1.4;">${specSummary}</p>` : ''}
          <div class="product-price">$${formattedPrice}</div>
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px;">
            ${stockStatus}
          </div>
          <div class="product-actions">
            <a href="detalle_producto.html?id=${producto.id}" class="btn btn-ghost" style="font-size: .8rem; padding: 9px 14px; justify-content: center;">
              <i class="bi bi-eye"></i>
            </a>
            <button class="btn-add-cart" onclick="window.addToCart(${producto.id}, '${producto.nombre.replace(/'/g, "\\'")}', ${producto.precio}, '${producto.imagen}')">
              <i class="bi bi-cart-plus"></i>
              Agregar
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function displayProducts(productsToDisplay) {
  productGrid.innerHTML = "";

  if (loadingState) loadingState.classList.add("d-none");
  if (errorState) errorState.classList.add("d-none");

  if (!Array.isArray(productsToDisplay) || productsToDisplay.length === 0) {
    if (noResultsState) noResultsState.classList.remove("d-none");
    if (resultsCount) resultsCount.textContent = "0 productos encontrados";
    return;
  }

  if (noResultsState) noResultsState.classList.add("d-none");

  let html = "";
  productsToDisplay.forEach((p) => (html += createProductCard(p)));
  productGrid.innerHTML = html;

  if (resultsCount) {
    resultsCount.textContent = `${productsToDisplay.length} producto${productsToDisplay.length !== 1 ? 's' : ''} encontrado${productsToDisplay.length !== 1 ? 's' : ''}`;
  }
}

function populateFilters(products) {
  const marcas = [...new Set(products.map((p) => p.marca))].sort();
  filterMarca.innerHTML = '<option value="">Todas las Marcas</option>';
  marcas.forEach((m) => {
    const option = document.createElement("option");
    option.value = m;
    option.textContent = m;
    filterMarca.appendChild(option);
  });

  const categorias = [...new Set(products.map((p) => p.categoria))].sort();
  filterCategoria.innerHTML = '<option value="">Todas las Categorías</option>';
  categorias.forEach((c) => {
    const option = document.createElement("option");
    option.value = c;
    option.textContent = categoryNames[c] || c.charAt(0).toUpperCase() + c.slice(1);
    filterCategoria.appendChild(option);
  });
}

function applyFiltersAndSort() {
  let filtered = [...allProducts];

  const search = searchInput ? searchInput.value.toLowerCase() : "";
  const brand = filterMarca ? filterMarca.value : "";
  const category = filterCategoria ? filterCategoria.value : "";
  const sort = sortOrder ? sortOrder.value : "";

  if (search) {
    filtered = filtered.filter(
      (p) =>
        p.nombre.toLowerCase().includes(search) ||
        p.marca.toLowerCase().includes(search)
    );
  }

  if (brand) {
    filtered = filtered.filter((p) => p.marca === brand);
  }

  if (category) {
    filtered = filtered.filter((p) => p.categoria === category);
  }

  if (sort === "precio-asc") {
    filtered.sort((a, b) => parseFloat(a.precio) - parseFloat(b.precio));
  } else if (sort === "precio-desc") {
    filtered.sort((a, b) => parseFloat(b.precio) - parseFloat(a.precio));
  } else if (sort === "nombre-asc") {
    filtered.sort((a, b) => a.nombre.localeCompare(b.nombre));
  } else if (sort === "nombre-desc") {
    filtered.sort((a, b) => b.nombre.localeCompare(a.nombre));
  }

  displayProducts(filtered);
}

async function cargarTodosLosProductos() {
  if (loadingState) loadingState.classList.remove("d-none");
  if (noResultsState) noResultsState.classList.add("d-none");
  if (errorState) errorState.classList.add("d-none");
  productGrid.innerHTML = "";

  try {
    const response = await fetch(`${API_BASE_URL}${PRODUCTOS_ENDPOINT}`);
    if (!response.ok) throw new Error("Error API");

    const data = await response.json();

    allProducts = Array.isArray(data) ? data : (data && data.id ? [data] : []);

    if (loadingState) loadingState.classList.add("d-none");

    if (allProducts.length === 0) {
      displayProducts([]);
      return;
    }

    populateFilters(allProducts);

    const urlParams = new URLSearchParams(window.location.search);
    const busquedaGlobal = urlParams.get("q");
    if (busquedaGlobal && searchInput) {
      searchInput.value = busquedaGlobal;
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    applyFiltersAndSort();

    if (searchInput) searchInput.addEventListener("input", applyFiltersAndSort);
    if (filterMarca) filterMarca.addEventListener("change", applyFiltersAndSort);
    if (filterCategoria) filterCategoria.addEventListener("change", applyFiltersAndSort);
    if (sortOrder) sortOrder.addEventListener("change", applyFiltersAndSort);

    if (resetButton) {
      resetButton.addEventListener("click", () => {
        if (searchInput) searchInput.value = "";
        if (filterMarca) filterMarca.value = "";
        if (filterCategoria) filterCategoria.value = "";
        if (sortOrder) sortOrder.value = "";
        applyFiltersAndSort();
      });
    }
  } catch (error) {
    console.error(error);
    if (loadingState) loadingState.classList.add("d-none");
    if (errorState) errorState.classList.remove("d-none");
  }
}

document.addEventListener("DOMContentLoaded", cargarTodosLosProductos);
