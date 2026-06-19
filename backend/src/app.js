import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/index.js";

dotenv.config();

const app = express();

const allowedOrigins = [
  "https://tiendamiaow.vercel.app",
  "http://localhost:5500",
  "http://127.0.0.1:5500",
];

if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

const corsOptions = {
  origin: function (origin, callback) {
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
