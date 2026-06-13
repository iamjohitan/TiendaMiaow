import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, "../data/db.json");

// Helper function to read from JSON DB
function readDatabase() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      console.warn("⚠️ Base de datos local no encontrada, inicializando vacía...");
      return { productos: [], contactos: [] };
    }
    const data = fs.readFileSync(DB_PATH, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("❌ Error al leer la base de datos local:", error);
    return { productos: [], contactos: [] };
  }
}

// Helper function to write to JSON DB
function writeDatabase(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("❌ Error al escribir en la base de datos local:", error);
  }
}

export const pool = {
  async getConnection() {
    // Retorna una conexión simulada con el método query y release
    return {
      async query(sql, params = []) {
        const db = readDatabase();
        const sqlNormalized = sql.trim().replace(/\s+/g, " ").toUpperCase();

        // 1. SELECT * FROM productos WHERE id = ?
        if (sqlNormalized.startsWith("SELECT * FROM PRODUCTOS WHERE ID =")) {
          const id = params[0];
          const found = db.productos.find((p) => String(p.id) === String(id));
          return found ? [found] : [];
        }

        // 2. SELECT * FROM productos ORDER BY fecha_creacion DESC
        if (sqlNormalized.startsWith("SELECT * FROM PRODUCTOS")) {
          let results = [...db.productos];
          if (sqlNormalized.includes("ORDER BY FECHA_CREACION DESC")) {
            results.sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion));
          }
          return results;
        }

        // 3. INSERT INTO contactos (nombre, apellido, email, asunto, mensaje) VALUES (?, ?, ?, ?, ?)
        if (sqlNormalized.startsWith("INSERT INTO CONTACTOS")) {
          const [nombre, apellido, email, asunto, mensaje] = params;
          const newContacto = {
            id: db.contactos.length + 1,
            nombre,
            apellido,
            email,
            asunto,
            mensaje,
            fecha_creacion: new Date().toISOString(),
          };
          db.contactos.push(newContacto);
          writeDatabase(db);
          return { affectedRows: 1, insertId: newContacto.id };
        }

        throw new Error(`Consulta SQL local no soportada: "${sql}"`);
      },
      release() {
        // Conexión simulada, no requiere liberar recursos reales
      },
    };
  },
};

export const testConnection = async () => {
  try {
    const conn = await pool.getConnection();
    console.log("✅ Conexión a la base de datos local (JSON) exitosa");
    conn.release();
  } catch (err) {
    console.log("❌ Error en la conexión local:", err);
  }
};

testConnection();
