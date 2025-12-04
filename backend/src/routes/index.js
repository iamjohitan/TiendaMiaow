import { Router } from "express";
import contactoRoutes from "./contacto.routes.js";
import productosRoutes from "./productos.route.js";

console.log("📌 Cargando rutas de contacto...");

const router = Router();

router.use("/contacto", contactoRoutes);
router.use("/productos", productosRoutes);

export default router;
