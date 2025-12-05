// backend/app.js (Revertido para Desarrollo Local)

import express from "express";
import cors from "cors";
import router from "./routes/index.js";

const app = express();

// 🛑 ELIMINAR O COMENTAR: Las líneas de allowedOrigin y corsOptions son para producción.
// const allowedOrigin = "https://tiendamiaow.vercel.app";
// const corsOptions = {...};
// app.use(cors(corsOptions));

// 1. Usar app.use(cors()) para desarrollo:
app.use(cors()); // ⬅️ Permite peticiones desde cualquier origen (localhost:puerto, 127.0.0.1:puerto)
app.use(express.json());

app.use("/api", router);

app.get("/", (req, res) => {
  res
    .status(200)
    .json({ status: "ok", message: "API Tienda Miaow funcionando..." });
});

app.use((req, res, next) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
