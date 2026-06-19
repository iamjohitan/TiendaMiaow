import { supabase } from "../config/supabase.js";

export const enviarCorreoContacto = async (req, res) => {
  const { nombre, apellido, email, asunto, mensaje } = req.body;

  try {
    if (!nombre || !email || !mensaje) {
      return res.status(400).json({
        status: "error",
        message: "Nombre, email y mensaje son requeridos.",
      });
    }

    if (nombre.trim().length < 2) {
      return res.status(400).json({ status: "error", message: "El nombre debe tener al menos 2 caracteres." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ status: "error", message: "Correo electrónico inválido." });
    }

    const fullMessage = asunto ? `[${asunto}] ${mensaje}` : mensaje;
    if (fullMessage.length < 10) {
      return res.status(400).json({ status: "error", message: "El mensaje debe tener al menos 10 caracteres." });
    }

    const fullName = apellido ? `${nombre} ${apellido}` : nombre;

    const { error } = await supabase
      .from("contact_messages")
      .insert({ name: fullName, email, message: fullMessage });

    if (error) throw error;

    console.log("✅ Mensaje guardado en Supabase exitosamente");

    res.status(200).json({
      status: "ok",
      message: "¡Mensaje recibido! Nos pondremos en contacto pronto.",
    });
  } catch (error) {
    console.error("❌ Error al guardar contacto:", error);
    res.status(500).json({
      status: "error",
      message: "Hubo un error al enviar tu mensaje, por favor intenta más tarde.",
    });
  }
};
