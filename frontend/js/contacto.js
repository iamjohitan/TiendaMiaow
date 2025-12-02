const contactForm = document.querySelector(".contact-form");

if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);

    const nombre = formData.get("nombre");
    const apellido = formData.get("apellido");
    const email = formData.get("email");
    const asunto = formData.get("asunto");
    const mensaje = formData.get("mensaje");

    try {
      const respuesta = await fetch("http://localhost:4000/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          apellido,
          email,
          asunto,
          mensaje,
        }),
      });

      const data = await respuesta.json();

      if (respuesta.ok) {
        Swal.fire({
          title: "¡Mensaje enviado!",
          text: "Gracias por escribirnos, te responderemos pronto.",
          icon: "success",
          background: "#f3ecff",
          color: "#2a213a",
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#8f74c5",
          buttonsStyling: true,
        });

        contactForm.reset();
      } else {
        Swal.fire({
          title: "Algo salió mal",
          text: data.message || "No se pudo enviar el mensaje.",
          icon: "error",
          background: "#f3ecff",
          color: "#2a213a",
          confirmButtonText: "Entendido",
          confirmButtonColor: "#8f74c5",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error del servidor",
        text: "No se pudo conectar con el servidor.",
        icon: "error",
        background: "#f3ecff",
        color: "#2a213a",
        confirmButtonText: "Cerrar",
        confirmButtonColor: "#8f74c5",
      });
      console.error(error);
    }
  });
}
