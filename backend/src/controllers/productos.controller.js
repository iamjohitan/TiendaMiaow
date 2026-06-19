import { supabase } from "../config/supabase.js";

export const obtenerTodosLosProductos = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    const productos = (data || []).map(normalizarProducto);

    res.status(200).json(productos);
  } catch (error) {
    console.error("❌ Error al obtener productos:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};

export const obtenerProductoPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ message: "Producto no encontrado." });
    }

    res.status(200).json(normalizarProducto(data));
  } catch (error) {
    console.error(`❌ Error al obtener producto ID ${id}:`, error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};

function normalizarProducto(p) {
  return {
    id: p.id,
    nombre: p.name,
    marca: p.brand,
    precio: p.price,
    imagen: p.image_url,
    categoria: p.category,
    descripcion: p.description,
    stock: p.stock,
    especificaciones: p.specs || {},
    fecha_creacion: p.created_at,
  };
}
