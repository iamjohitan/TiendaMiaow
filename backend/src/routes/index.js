import { Router } from "express";
const router = Router();

router.get("/", (req, res) => {
  res.json({ msg: "Rutas API funcionando" });
});

export default router;
