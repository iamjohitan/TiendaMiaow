import { Router } from "express";
import {
  obtenerTodosLosProductos,
  obtenerProductoPorId,
} from "../controllers/productos.controller.js";
const router = Router();

router.get("/", obtenerTodosLosProductos);

router.get("/:id", obtenerProductoPorId);

export default router;
