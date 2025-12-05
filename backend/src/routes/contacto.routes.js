import { Router } from "express";
import { enviarCorreoContacto } from "../controllers/contacto.controller.js";

const router = Router();

router.get("/test", (req, res) => {
  res.send("Ruta de contacto funcionando ✔");
});

router.post("/", enviarCorreoContacto);

export default router;
