const API_BASE_URL = "http://localhost:4000";
const PRODUCTOS_ENDPOINT = "/api/productos";

const productosContainer = document.getElementById("productos-container");
const loadingMessage = document.getElementById("loading-message");
const errorMessage = document.getElementById("error-message");
const noResultsMessage = document.getElementById("no-results-message");

// Filtros
const filterMarca = document.getElementById("filter-marca");
const filterCategoria = document.getElementById("filter-categoria"); // NUEVO
const searchInput = document.getElementById("search-input");
const sortOrder = document.getElementById("sort-order");
const resetButton = document.getElementById("reset-filters");

let allProducts = [];

// Diccionario para nombres bonitos de categorías
const categoryNames = {
  cpu: "Procesadores",
  gpu: "Tarjetas Gráficas",
  mobo: "Placas Madre",
  ram: "Memorias RAM",
  storage: "Almacenamiento",
  psu: "Fuentes de Poder",
  case: "Gabinetes",
};

// 1. RENDERIZADO TARJETA
function createProductCard(producto) {
  const formattedPrice = parseFloat(producto.precio).toFixed(2);

  return `

        <div class="col">

            <div class="card h-100 shadow-sm border-0">

                <a href="detalle_producto.html?id=${producto.id}" class="text-decoration-none text-dark">

                    <img src="${producto.imagen}" class="card-img-top p-3" alt="${producto.nombre}" style="height: 200px; object-fit: contain;">

                </a>

                <div class="card-body d-flex flex-column">

                    <h5 class="card-title fw-bold" style="font-size: 1rem;">${producto.nombre}</h5>

                    <p class="text-muted small">${producto.marca}</p>

                    <p class="card-text text-success fs-4 fw-bolder mt-auto">$${formattedPrice}</p>

                    

                    <a href="detalle_producto.html?id=${producto.id}" class="btn btn-primary mt-2">

                        Ver Detalles <i class="bi bi-eye"></i>

                    </a>

                    

                    <a href="https://wa.me/message/T4A5S3YGZWPGE1" target="_blank" class="btn btn-outline-success mt-2">

                        Cotizar <i class="bi bi-whatsapp"></i>

                    </a>

                </div>

            </div>

        </div>

    `;
}

function displayProducts(productsToDisplay) {
  productosContainer.innerHTML = "";
  noResultsMessage.classList.add("d-none");

  if (!Array.isArray(productsToDisplay) || productsToDisplay.length === 0) {
    noResultsMessage.classList.remove("d-none");
    noResultsMessage.innerHTML = `<i class="bi bi-search fs-1 d-block mb-2 text-warning"></i><h5 class="fw-bold">No encontramos productos</h5>`;
    return;
  }

  let html = "";
  productsToDisplay.forEach((p) => (html += createProductCard(p)));
  productosContainer.innerHTML = html;
}

// 2. LLENAR FILTROS (MARCA Y CATEGORÍA)
function populateFilters(products) {
  // Marcas
  const marcas = [...new Set(products.map((p) => p.marca))].sort();
  filterMarca.innerHTML = '<option value="">Todas las Marcas</option>';
  marcas.forEach((m) => {
    const option = document.createElement("option");
    option.value = m;
    option.textContent = m;
    filterMarca.appendChild(option);
  });

  // Categorías (NUEVO)
  const categorias = [...new Set(products.map((p) => p.categoria))].sort();
  filterCategoria.innerHTML = '<option value="">Todas las Categorías</option>';
  categorias.forEach((c) => {
    const option = document.createElement("option");
    option.value = c;
    // Usar nombre bonito si existe, sino el código
    option.textContent = categoryNames[c] || c.toUpperCase();
    filterCategoria.appendChild(option);
  });
}

// 3. FILTRAR Y ORDENAR
function applyFiltersAndSort() {
  let filtered = [...allProducts];

  const search = searchInput.value.toLowerCase();
  const brand = filterMarca.value;
  const category = filterCategoria.value; // NUEVO
  const sort = sortOrder.value;

  // Filtro Texto
  if (search) {
    filtered = filtered.filter(
      (p) =>
        p.nombre.toLowerCase().includes(search) ||
        p.marca.toLowerCase().includes(search)
    );
  }

  // Filtro Marca
  if (brand) {
    filtered = filtered.filter((p) => p.marca === brand);
  }

  // Filtro Categoría (NUEVO)
  if (category) {
    filtered = filtered.filter((p) => p.categoria === category);
  }

  // Ordenar
  if (sort === "price_asc") {
    filtered.sort((a, b) => parseFloat(a.precio) - parseFloat(b.precio));
  } else if (sort === "price_desc") {
    filtered.sort((a, b) => parseFloat(b.precio) - parseFloat(a.precio));
  } else if (sort === "name_asc") {
    filtered.sort((a, b) => a.nombre.localeCompare(b.nombre));
  }

  displayProducts(filtered);
}

// 4. CARGA INICIAL
async function cargarTodosLosProductos() {
  loadingMessage.classList.remove("d-none");
  errorMessage.classList.add("d-none");
  productosContainer.innerHTML = "";

  try {
    const response = await fetch(`${API_BASE_URL}${PRODUCTOS_ENDPOINT}`);
    if (!response.ok) throw new Error("Error API");

    const data = await response.json();

    // Normalizar a Array
    if (Array.isArray(data)) {
      allProducts = data;
    } else if (data && data.id) {
      allProducts = [data];
    } else {
      allProducts = [];
    }

    loadingMessage.classList.add("d-none");

    if (allProducts.length === 0) {
      noResultsMessage.classList.remove("d-none");
      return;
    }

    populateFilters(allProducts); // Llenar selects

    // Verificar si venimos del buscador global
    const urlParams = new URLSearchParams(window.location.search);
    const busquedaGlobal = urlParams.get("q");
    if (busquedaGlobal) {
      searchInput.value = busquedaGlobal;
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    applyFiltersAndSort();

    attachEventListeners();
  } catch (error) {
    console.error(error);
    loadingMessage.classList.add("d-none");
    errorMessage.classList.remove("d-none");
  }
}

function attachEventListeners() {
  searchInput.addEventListener("input", applyFiltersAndSort);
  filterMarca.addEventListener("change", applyFiltersAndSort);
  filterCategoria.addEventListener("change", applyFiltersAndSort); // NUEVO
  sortOrder.addEventListener("change", applyFiltersAndSort);

  resetButton.addEventListener("click", () => {
    searchInput.value = "";
    filterMarca.value = "";
    filterCategoria.value = ""; // NUEVO
    sortOrder.value = "default";
    applyFiltersAndSort();
  });
}

document.addEventListener("DOMContentLoaded", cargarTodosLosProductos);
