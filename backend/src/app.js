// backend/app.js

import express from "express";
import cors from "cors";
import router from "./routes/index.js";

const app = express();

// 🛑 AQUÍ PONES TU URL DE VERCEL (sin barra al final)
const allowedOrigins = [
  "https://tiendamiaow.vercel.app", // Tu frontend en producción
  "http://localhost:5500", // Tu entorno local (opcional)
  "http://127.0.0.1:5500",
];

const corsOptions = {
  origin: function (origin, callback) {
    // Permitir solicitudes sin origen (como Postman) o si está en la lista
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Bloqueado por CORS"));
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

app.use(cors(corsOptions));
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
