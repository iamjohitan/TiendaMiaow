// frontend/js/detalle_producto.js

const API_BASE_URL = "https://tiendamiaow-production.up.railway.app/";

// 1. Obtener ID de la URL
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

// Referencias del DOM
const refs = {
  img: document.getElementById("det-imagen"),
  marca: document.getElementById("det-marca"),
  nombre: document.getElementById("det-nombre"),
  precio: document.getElementById("det-precio"),
  desc: document.getElementById("det-descripcion"),
  cat: document.getElementById("det-categoria"),
  bread: document.getElementById("breadcrumb-name"),
  btnWs: document.getElementById("btn-whatsapp"),
};

// Función principal
async function cargarDetalle() {
  if (!productId) {
    window.location.href = "productos.html";
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/productos/${productId}`);

    if (!response.ok) throw new Error("Producto no encontrado");

    const producto = await response.json();

    // 2. Llenar datos en el HTML
    document.title = `${producto.nombre} | Tienda Miaow`;

    refs.img.src = producto.imagen;
    refs.img.alt = producto.nombre;

    refs.marca.textContent = producto.marca;
    refs.nombre.textContent = producto.nombre;
    refs.desc.textContent = producto.descripcion;
    refs.bread.textContent = producto.nombre;

    // Categoría (Capitalizada)
    const categoriaBonita =
      producto.categoria.charAt(0).toUpperCase() + producto.categoria.slice(1);
    refs.cat.textContent = categoriaBonita;

    // Precio Formateado
    const precio = parseFloat(producto.precio).toFixed(2);
    refs.precio.textContent = `$${precio}`;

    // 3. Configurar Botón de WhatsApp Dinámico
    const mensaje = `Hola Tienda Miaow! 😺\n\nEstoy interesado en este producto:\n\n*${producto.nombre}*\nMarca: ${producto.marca}\nPrecio: $${precio}\n\n¿Tienen disponibilidad?`;
    const link = `https://wa.me/573175067243?text=${encodeURIComponent(
      mensaje
    )}`;

    refs.btnWs.href = link;
  } catch (error) {
    console.error(error);
    document.querySelector("main").innerHTML = `
            <div class="text-center py-5">
                <h1 class="display-1 fw-bold text-secondary">404</h1>
                <p class="lead">Producto no encontrado.</p>
                <a href="productos.html" class="btn btn-primary">Volver al catálogo</a>
            </div>
        `;
  }
}

document.addEventListener("DOMContentLoaded", cargarDetalle);
