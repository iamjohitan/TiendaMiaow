// frontend/js/productos.js

const RAILWAY_API_URL = "https://tiendamiaow-production.up.railway.app";
const PRODUCTOS_ENDPOINT = "/api/productos";

const productosContainer = document.getElementById("productos-container");
const loadingMessage = document.getElementById("loading-message");
const errorMessage = document.getElementById("error-message");
const noResultsMessage = document.getElementById("no-results-message"); // Nuevo
const filterMarca = document.getElementById("filter-marca");
const searchInput = document.getElementById("search-input");
const sortOrder = document.getElementById("sort-order");
const resetButton = document.getElementById("reset-filters");

let allProducts = []; // Para guardar todos los productos una vez y aplicar filtros localmente

// Función para generar la tarjeta HTML de un solo producto
function createProductCard(producto) {
  return `
        <div class="col">
            <div class="card h-100 shadow-sm">
                <a href="producto-detalle.html?id=${
                  producto.id
                }" class="text-decoration-none text-dark">
                    <img src="${
                      producto.imagen
                    }" class="card-img-top p-3" alt="${
    producto.nombre
  }" style="height: 200px; object-fit: contain;">
                </a>
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title fw-bold">${producto.nombre}</h5>
                    <p class="text-muted small">${producto.marca}</p>
                    <p class="card-text text-success fs-4 fw-bolder mt-auto">$${producto.precio.toFixed(
                      2
                    )}</p>
                    <a href="producto-detalle.html?id=${
                      producto.id
                    }" class="btn btn-primary mt-2">
                        Ver Detalles <i class="bi bi-eye"></i>
                    </a>
                    <button class="btn btn-outline-success mt-2">
                        Añadir al Carrito <i class="bi bi-cart-plus"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Función para mostrar los productos en el contenedor
function displayProducts(productsToDisplay) {
  productosContainer.innerHTML = ""; // Limpiar antes de renderizar
  noResultsMessage.classList.add("d-none"); // Ocultar mensaje de no resultados

  if (productsToDisplay.length === 0) {
    noResultsMessage.classList.remove("d-none");
    return;
  }

  let allCardsHtml = "";
  productsToDisplay.forEach((producto) => {
    allCardsHtml += createProductCard(producto);
  });
  productosContainer.innerHTML = allCardsHtml;
}

// Función para rellenar el filtro de marcas
function populateBrandFilter(products) {
  const marcas = [...new Set(products.map((p) => p.marca))].sort(); // Obtener marcas únicas y ordenar
  filterMarca.innerHTML = '<option value="">Todas las Marcas</option>'; // Restablecer

  marcas.forEach((marca) => {
    const option = document.createElement("option");
    option.value = marca;
    option.textContent = marca;
    filterMarca.appendChild(option);
  });
}

// Función para aplicar todos los filtros y la búsqueda
function applyFiltersAndSort() {
  let filteredProducts = [...allProducts]; // Copia de todos los productos

  const searchTerm = searchInput.value.toLowerCase();
  const selectedBrand = filterMarca.value;
  const currentSortOrder = sortOrder.value;

  // 1. Filtrar por búsqueda
  if (searchTerm) {
    filteredProducts = filteredProducts.filter(
      (producto) =>
        producto.nombre.toLowerCase().includes(searchTerm) ||
        producto.marca.toLowerCase().includes(searchTerm)
    );
  }

  // 2. Filtrar por marca
  if (selectedBrand) {
    filteredProducts = filteredProducts.filter(
      (producto) => producto.marca === selectedBrand
    );
  }

  // 3. Ordenar
  if (currentSortOrder === "price_asc") {
    filteredProducts.sort((a, b) => a.precio - b.precio);
  } else if (currentSortOrder === "price_desc") {
    filteredProducts.sort((a, b) => b.precio - a.precio);
  } else if (currentSortOrder === "name_asc") {
    filteredProducts.sort((a, b) => a.nombre.localeCompare(b.nombre));
  } else if (currentSortOrder === "name_desc") {
    filteredProducts.sort((a, b) => b.nombre.localeCompare(a.nombre));
  }

  displayProducts(filteredProducts);
}

// Función principal para cargar todos los productos desde la API
async function cargarTodosLosProductos() {
  loadingMessage.classList.remove("d-none");
  errorMessage.classList.add("d-none");
  noResultsMessage.classList.add("d-none");
  productosContainer.innerHTML = ""; // Limpiar

  try {
    const response = await fetch(`${RAILWAY_API_URL}${PRODUCTOS_ENDPOINT}`);

    if (!response.ok) {
      throw new Error(
        `Error ${response.status}: Fallo al conectar con el servidor.`
      );
    }

    const productos = await response.json();
    allProducts = productos; // Guarda todos los productos

    loadingMessage.classList.add("d-none");

    if (allProducts.length === 0) {
      noResultsMessage.classList.remove("d-none");
      noResultsMessage.textContent =
        "Actualmente no hay productos en la base de datos.";
      return;
    }

    populateBrandFilter(allProducts); // Rellena el filtro de marcas
    applyFiltersAndSort(); // Aplica filtros iniciales (mostrar todos)
  } catch (error) {
    console.error("Error al cargar productos:", error);
    loadingMessage.classList.add("d-none");
    errorMessage.classList.remove("d-none");
    productosContainer.innerHTML = "";
  }
}

// Event Listeners para los filtros y búsqueda
searchInput.addEventListener("input", applyFiltersAndSort);
filterMarca.addEventListener("change", applyFiltersAndSort);
sortOrder.addEventListener("change", applyFiltersAndSort);
resetButton.addEventListener("click", () => {
  searchInput.value = "";
  filterMarca.value = "";
  sortOrder.value = "default";
  applyFiltersAndSort();
});

// Carga los productos al iniciar la página
document.addEventListener("DOMContentLoaded", cargarTodosLosProductos);
