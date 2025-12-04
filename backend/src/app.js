import express from "express";
import cors from "cors";
import router from "./routes/index.js";

const app = express();

const allowedOrigin = "https://strong-choux-120ee2.netlify.app";

const corsOptions = {
  origin: allowedOrigin,
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
