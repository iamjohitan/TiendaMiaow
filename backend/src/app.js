import express from "express";
import cors from "cors";
import router from "./routes/index.js";

const app = express();

// 1. DEFINE EL DOMINIO DE TU FRONTEND EN NETLIFY
// ¡ATENCIÓN!: Reemplaza ESTE valor con tu URL real de Netlify
const allowedOrigin = "https://strong-choux-120ee2.netlify.app";

// 2. CONFIGURACIÓN DE CORS
const corsOptions = {
  origin: allowedOrigin,
  // Puedes definir métodos si lo necesitas:
  // methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  // credentials: true // Útil si usas cookies de sesión
};

// 3. USA LA CONFIGURACIÓN ESPECÍFICA
app.use(cors(corsOptions));
app.use(express.json());

app.use("/api", router);

app.get("/", (req, res) => {
  res.send("API Tienda Miaow funcionando...");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
