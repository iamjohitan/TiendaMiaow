// frontend/js/contacto.js

const RAILWAY_API_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.protocol === "file:"
  ? "http://localhost:4000"
  : "https://tiendamiaow-production.up.railway.app";
const CONTACT_ENDPOINT = "/api/contacto";

// 🛑 CORRECCIÓN AQUÍ: Usamos la clase nueva del diseño bonito (.contact-form-inner)
const contactForm = document.querySelector(".contact-form-inner");

if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Efecto visual de carga en el botón
    const submitBtn = contactForm.querySelector("button[type='submit']");
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML =
      '<span class="spinner-border spinner-border-sm"></span> Enviando...';
    submitBtn.disabled = true;

    const formData = new FormData(contactForm);

    const dataToSend = {
      nombre: formData.get("nombre"),
      apellido: formData.get("apellido"),
      email: formData.get("email"),
      asunto: formData.get("asunto"),
      mensaje: formData.get("mensaje"),
    };

    try {
      const respuesta = await fetch(`${RAILWAY_API_URL}${CONTACT_ENDPOINT}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      if (respuesta.ok) {
        const data = await respuesta.json();

        Swal.fire({
          title: "¡Mensaje enviado!",
          text:
            data.message || "Gracias por escribirnos, te responderemos pronto.",
          icon: "success",
          confirmButtonColor: "#8f74c5",
          background: "#fff",
          color: "#2a213a",
        });

        contactForm.reset();
      } else {
        let errorData = {};
        try {
          errorData = await respuesta.json();
        } catch (e) {
          errorData.message = `Error ${respuesta.status}: No se pudo obtener respuesta del servidor.`;
        }

        Swal.fire({
          title: "Algo salió mal",
          text: errorData.message || "No se pudo enviar el mensaje.",
          icon: "error",
          confirmButtonColor: "#8f74c5",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error de Conexión",
        text: "No se pudo conectar con el servidor (Puerto 4000). Revisa que tu backend esté encendido.",
        icon: "error",
        confirmButtonColor: "#8f74c5",
      });
      console.error("Error en la solicitud Fetch:", error);
    } finally {
      // Restaurar el botón
      submitBtn.innerHTML = originalBtnText;
      submitBtn.disabled = false;
    }
  });
} else {
  console.error(
    "❌ Error: No se encontró el formulario en el HTML. Verifica la clase .contact-form-inner"
  );
}
