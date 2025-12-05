import { pool } from "../config/db.js";

export const obtenerTodosLosProductos = async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();

    const productos = await conn.query(
      "SELECT * FROM productos ORDER BY fecha_creacion DESC"
    );

    res.status(200).json(productos);
  } catch (error) {
    console.error("❌ Error DB al obtener productos:", error);
    res.status(500).json({
      message: "Error interno del servidor al consultar la base de datos.",
    });
  } finally {
    if (conn) conn.release();
  }
};

export const obtenerProductoPorId = async (req, res) => {
  const { id } = req.params;
  let conn;
  try {
    conn = await pool.getConnection();

    const rows = await conn.query("SELECT * FROM productos WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Producto no encontrado." });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error(`❌ Error DB al obtener producto ID ${id}:`, error);
    res.status(500).json({ message: "Error interno del servidor." });
  } finally {
    if (conn) conn.release();
  }
};
