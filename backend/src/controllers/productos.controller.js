import { pool } from "../config/db.js";

export const obtenerTodosLosProductos = async (req, res) => {
  try {
    const conn = await pool.getConnection();

    const [productos] = await conn.query(
      "SELECT id, nombre, marca, descripcion, precio, imagen FROM productos ORDER BY fecha_creacion DESC"
    );

    conn.release();

    res.status(200).json(productos);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res
      .status(500)
      .json({ message: "Error interno del servidor al consultar productos." });
  }
};
