import { Router } from "express";
import { enviarContacto } from "../controllers/contacto.controller.js";

const router = Router();

router.get("/test", (req, res) => {
  res.send("Ruta de contacto funcionando ✔");
});

router.post("/", enviarContacto);

export default router;
