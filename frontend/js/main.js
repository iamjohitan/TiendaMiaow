console.log("Frontend funcionando...");

// Reveal elements on scroll and Navbar shrinking
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

  // Shrinking Navbar Fallback for older browsers / Firefox
  const navbar = document.querySelector(".navbar");
  if (navbar) {
    const checkScroll = () => {
      if (window.scrollY > 50) {
        navbar.classList.add("shrunk");
      } else {
        navbar.classList.remove("shrunk");
      }
    };
    
    // Feature detect scroll-driven animations support
    if (!CSS.supports("(animation-timeline: scroll()) and (animation-range: 0% 100%)")) {
      window.addEventListener("scroll", checkScroll);
      checkScroll(); // run once on load
    }
  }

  // Gallery modal: set image src when clicking a gallery item
  const modalImage = document.getElementById("modalImage");
  document.querySelectorAll(".gallery-img").forEach((img) => {
    img.style.cursor = "pointer";
    img.addEventListener("click", function (e) {
      if (modalImage) {
        const src = this.getAttribute("src");
        modalImage.setAttribute("src", src);
        // Show modal manually or trigger bootstrap
        const modalEl = document.getElementById("imageModal");
        if (modalEl && typeof bootstrap !== 'undefined') {
          const bsModal = bootstrap.Modal.getOrCreateInstance(modalEl);
          bsModal.show();
        }
      }
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
