const RAILWAY_API_URL = "https://tiendamiaow-production.up.railway.app";
const CONTACT_ENDPOINT = "/api/contacto";

const contactForm = document.querySelector(".contact-form");

if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

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
          background: "#f3ecff",
          color: "#2a213a",
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#8f74c5",
          buttonsStyling: true,
        });

        contactForm.reset();
      } else {
        let errorData = {};
        try {
          errorData = await respuesta.json();
        } catch (e) {
          errorData.message = `Error ${respuesta.status}: No se pudo obtener el mensaje de error del servidor.`;
        }

        Swal.fire({
          title: "Algo salió mal",
          text: errorData.message || "No se pudo enviar el mensaje.",
          icon: "error",
          background: "#f3ecff",
          color: "#2a213a",
          confirmButtonText: "Entendido",
          confirmButtonColor: "#8f74c5",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error de Conexión",
        text: "No se pudo conectar con el servidor de la API. Verifica tu conexión o el estado de Railway.",
        icon: "error",
        background: "#f3ecff",
        color: "#2a213a",
        confirmButtonText: "Cerrar",
        confirmButtonColor: "#8f74c5",
      });
      console.error("Error en la solicitud Fetch:", error);
    }
  });
}
