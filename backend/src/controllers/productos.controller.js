import { pool } from "../config/db.js";

export const obtenerTodosLosProductos = async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();

    const [productos] = await conn.query(
      "SELECT id, nombre, marca, descripcion, precio FROM productos ORDER BY fecha_creacion DESC"
    );

    res.status(200).json(productos);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res
      .status(500)
      .json({ message: "Error interno del servidor al consultar productos." });
  } finally {
    if (conn) conn.release();
  }
};

// 🛑 AÑADE ESTA FUNCIÓN Y EL 'export const'
export const obtenerProductoPorId = async (req, res) => {
  const { id } = req.params;
  let conn;
  try {
    conn = await pool.getConnection();

    const [producto] = await conn.query(
      "SELECT * FROM productos WHERE id = ?",
      [id]
    );

    if (producto.length === 0) {
      return res.status(404).json({ message: "Producto no encontrado." });
    }

    res.status(200).json(producto[0]);
  } catch (error) {
    console.error("Error al obtener producto por ID:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  } finally {
    if (conn) conn.release();
  }
};
