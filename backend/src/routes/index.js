import { Router } from "express";
import contactoRoutes from "./contacto.routes.js";
import productosRoutes from "./productos.routes.js";

console.log("📌 Cargando rutas de contacto...");
console.log("📌 Cargando rutas de productos...");

const router = Router();

router.use("/contacto", contactoRoutes);
router.use("/productos", productosRoutes);

export default router;
