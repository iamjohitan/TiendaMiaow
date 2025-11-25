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
