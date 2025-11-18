import express from "express";
import cors from "cors";
import router from "./routes/index.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", router);

app.get("/", (req, res) => {
  res.send("API Tienda Miaow funcionando...");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
