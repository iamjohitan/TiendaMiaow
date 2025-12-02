import { Router } from "express";
import contactoRoutes from "./contacto.routes.js";

console.log("📌 Cargando rutas de contacto...");

const router = Router();

router.use("/contacto", contactoRoutes);

export default router;
