console.log("Frontend funcionando...");

// Reveal elements on scroll
(function () {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll(".reveal-on-scroll").forEach((el) => {
    observer.observe(el);
  });

  // Gallery modal: set image src when clicking a gallery item
  const modalImage = document.getElementById("modalImage");
  document.querySelectorAll(".gallery-item").forEach((img) => {
    img.addEventListener("click", function (e) {
      const src = this.getAttribute("src");
      modalImage.setAttribute("src", src);
    });
  });
})();

// frontend/js/main.js

document.addEventListener("DOMContentLoaded", () => {
  // 1. Detectar el formulario de búsqueda del Navbar
  const searchForm = document.querySelector('form[role="search"]');
  const searchInputNavbar = searchForm
    ? searchForm.querySelector("input")
    : null;

  if (searchForm && searchInputNavbar) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault(); // Evita que la página se recargue sola

      const searchTerm = searchInputNavbar.value.trim();

      if (searchTerm) {
        // 2. Determinar la ruta correcta a productos.html
        // Si estamos en el index (root), vamos a 'pages/productos.html'
        // Si ya estamos en una página dentro de 'pages/', vamos a 'productos.html'
        const currentPath = window.location.pathname;
        const isPagesFolder = currentPath.includes("/pages/");

        const targetUrl = isPagesFolder
          ? "productos.html"
          : "pages/productos.html";

        // 3. Redirigir enviando el término de búsqueda en la URL (?q=termino)
        window.location.href = `${targetUrl}?q=${encodeURIComponent(
          searchTerm
        )}`;
      }
    });
  }
});
