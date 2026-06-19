const RAILWAY_API_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.protocol === "file:"
  ? "http://localhost:4000"
  : "https://tiendamiaow-production.up.railway.app";
const CONTACT_ENDPOINT = "/api/contacto";

const contactForm = document.querySelector(".contact-form-inner");

if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector("button[type='submit']");
    const originalBtnText = submitBtn.innerHTML;

    const formData = new FormData(contactForm);
    const nombre = (formData.get("nombre") || "").trim();
    const apellido = (formData.get("apellido") || "").trim();
    const email = (formData.get("email") || "").trim();
    const asunto = (formData.get("asunto") || "").trim();
    const mensaje = (formData.get("mensaje") || "").trim();

    if (!nombre || nombre.length < 2) {
      Swal.fire({ title: "Campo requerido", text: "Ingresa tu nombre.", icon: "warning", confirmButtonColor: "#7c3aed" });
      return;
    }
    if (!apellido || apellido.length < 2) {
      Swal.fire({ title: "Campo requerido", text: "Ingresa tu apellido.", icon: "warning", confirmButtonColor: "#7c3aed" });
      return;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Swal.fire({ title: "Email inválido", text: "Ingresa un correo electrónico válido.", icon: "warning", confirmButtonColor: "#7c3aed" });
      return;
    }
    if (!asunto || asunto.length < 3) {
      Swal.fire({ title: "Campo requerido", text: "Ingresa un asunto.", icon: "warning", confirmButtonColor: "#7c3aed" });
      return;
    }
    if (!mensaje || mensaje.length < 10) {
      Swal.fire({ title: "Mensaje muy corto", text: "El mensaje debe tener al menos 10 caracteres.", icon: "warning", confirmButtonColor: "#7c3aed" });
      return;
    }

    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Enviando...';
    submitBtn.disabled = true;

    try {
      const respuesta = await fetch(`${RAILWAY_API_URL}${CONTACT_ENDPOINT}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, apellido, email, asunto, mensaje }),
      });

      if (respuesta.ok) {
        Swal.fire({
          title: "¡Mensaje enviado!",
          text: "Gracias por escribirnos, te responderemos pronto.",
          icon: "success",
          confirmButtonColor: "#7c3aed",
        });
        contactForm.reset();
      } else {
        let errorData = {};
        try { errorData = await respuesta.json(); } catch (e) { errorData.message = `Error ${respuesta.status}`; }
        Swal.fire({ title: "Algo salió mal", text: errorData.message || "No se pudo enviar el mensaje.", icon: "error", confirmButtonColor: "#7c3aed" });
      }
    } catch (error) {
      Swal.fire({
        title: "Error de Conexión",
        text: "No se pudo conectar con el servidor. Verifica que el backend esté encendido.",
        icon: "error",
        confirmButtonColor: "#7c3aed",
      });
    } finally {
      submitBtn.innerHTML = originalBtnText;
      submitBtn.disabled = false;
    }
  });
}
