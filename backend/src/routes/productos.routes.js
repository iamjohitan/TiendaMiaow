// backend/src/routes/productos.route.js

import { Router } from "express";
import {
  obtenerTodosLosProductos,
  obtenerProductoPorId,
} from "../controllers/productos.controller.js";

const router = Router();

// GET /productos/ -> Obtiene la lista completa
router.get("/", obtenerTodosLosProductos);

// GET /productos/:id -> Obtiene un solo producto
router.get("/:id", obtenerProductoPorId);

export default router;
