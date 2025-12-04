// backend/src/controllers/productos.controller.js

import { getConnection } from "../config/db.js";

export const obtenerTodosLosProductos = async (req, res) => {
  try {
    // La función getConnection debe usar las variables de entorno de Railway (DATABASE_URL)
    const conn = await getConnection();

    // Consulta todos los campos necesarios de tu tabla 'productos'
    const [productos] = await conn.query(
      "SELECT id, nombre, marca, descripcion, precio, imagen FROM productos ORDER BY fecha_creacion DESC"
    );

    res.status(200).json(productos);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res
      .status(500)
      .json({ message: "Error interno del servidor al consultar productos." });
  }
};
// ... (puedes dejar la función obtenerProductoPorId para la página de detalle, si ya la tienes)
