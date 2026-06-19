import { Router } from "express";
import { crearOrden, obtenerOrden } from "../controllers/ordenes.controller.js";

const router = Router();

router.post("/", crearOrden);
router.get("/:id", obtenerOrden);

export default router;
