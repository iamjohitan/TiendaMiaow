import { pool } from "../config/db.js";

export const enviarContacto = async (req, res) => {
  try {
    const { nombre, apellido, email, asunto, mensaje } = req.body;

    const conn = await pool.getConnection();

    await conn.query(
      "INSERT INTO contactos (nombre, apellido, email, asunto, mensaje) VALUES (?, ?, ?, ?, ?)",
      [nombre, apellido, email, asunto, mensaje]
    );

    conn.release();

    res.json({ message: "Mensaje enviado correctamente" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al enviar el mensaje" });
  }
};
