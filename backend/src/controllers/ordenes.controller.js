import { supabase } from "../config/supabase.js";

export const crearOrden = async (req, res) => {
  const { user_name, user_email, shipping_address, items } = req.body;

  try {
    if (!user_name || !user_email || !shipping_address || !items || !items.length) {
      return res.status(400).json({ status: "error", message: "Todos los campos son requeridos." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user_email)) {
      return res.status(400).json({ status: "error", message: "Correo electrónico inválido." });
    }

    let total = 0;
    for (const item of items) {
      if (!item.product_id || !item.quantity || !item.unit_price) {
        return res.status(400).json({ status: "error", message: "Cada item debe tener product_id, quantity y unit_price." });
      }
      total += item.quantity * item.unit_price;
    }

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({ user_name, user_email, shipping_address, total, status: "confirmed" })
      .select()
      .maybeSingle();

    if (orderError) throw orderError;

    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.unit_price,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) throw itemsError;

    res.status(201).json({
      status: "ok",
      message: "Orden creada exitosamente.",
      order: {
        id: order.id,
        user_name,
        user_email,
        shipping_address,
        total,
        status: "confirmed",
        items: orderItems,
      },
    });
  } catch (error) {
    console.error("❌ Error al crear orden:", error);
    res.status(500).json({ status: "error", message: "Error al procesar la orden." });
  }
};

export const obtenerOrden = async (req, res) => {
  const { id } = req.params;

  try {
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (orderError) throw orderError;

    if (!order) {
      return res.status(404).json({ message: "Orden no encontrada." });
    }

    const { data: items, error: itemsError } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", id);

    if (itemsError) throw itemsError;

    res.status(200).json({ ...order, items: items || [] });
  } catch (error) {
    console.error(`❌ Error al obtener orden ID ${id}:`, error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};
