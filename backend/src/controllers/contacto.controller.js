import { pool } from "../config/db.js";

export const enviarCorreoContacto = async (req, res) => {
  const { nombre, apellido, email, asunto, mensaje } = req.body;
  let conn;

  try {
    // 1. OBTENER CONEXIÓN
    conn = await pool.getConnection();

    // 2. GUARDAR EN DB
    await conn.query(
      "INSERT INTO contactos (nombre, apellido, email, asunto, mensaje) VALUES (?, ?, ?, ?, ?)",
      [nombre, apellido, email, asunto, mensaje]
    );

    console.log("✅ Mensaje guardado en DB exitosamente");

    // 3. RESPONDER AL CLIENTE
    res.status(200).json({
      status: "ok",
      message: "¡Mensaje recibido! Nos pondremos en contacto pronto.",
    });
  } catch (error) {
    console.error("❌ Error al guardar contacto:", error);
    res.status(500).json({
      status: "error",
      message:
        "Hubo un error al enviar tu mensaje, por favor intenta más tarde.",
    });
  } finally {
    // 4. LIBERAR LA CONEXIÓN (Muy importante)
    if (conn) conn.release();
  }
};
