import { Router } from "express";
import contactoRoutes from "./contacto.routes.js";
import productosRoutes from "./productos.routes.js";
import ordenesRoutes from "./ordenes.routes.js";

const router = Router();

router.use("/contacto", contactoRoutes);
router.use("/productos", productosRoutes);
router.use("/orders", ordenesRoutes);

export default router;
