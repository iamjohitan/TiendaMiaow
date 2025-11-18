import mariadb from "mariadb";
import dotenv from "dotenv";
dotenv.config();

export const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  connectionLimit: 5,
});

// Función para probar la conexión
export const testConnection = async () => {
  try {
    const conn = await pool.getConnection();
    console.log("Conexión a MariaDB exitosa");
    conn.release();
  } catch (err) {
    console.log("Error en la conexión:", err);
  }
};

testConnection();
