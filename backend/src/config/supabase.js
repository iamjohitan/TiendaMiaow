import dotenv from "dotenv";
dotenv.config();

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

function createMockSupabase() {
  const handler = {
    get(_, prop) {
      if (prop === "from") return () => createMockQueryBuilder();
      if (prop === "then") return undefined;
      return () => Promise.reject(new Error("Supabase no está configurado. Define SUPABASE_URL y SUPABASE_ANON_KEY en .env"));
    },
  };
  return new Proxy({}, handler);
}

function createMockQueryBuilder() {
  return new Proxy({}, {
    get(_, prop) {
      if (prop === "then") return undefined;
      return () => createMockQueryBuilder();
    },
  });
}

let supabase;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("⚠️ SUPABASE_URL y/o SUPABASE_ANON_KEY no definidos en .env");
  console.warn("   El servidor iniciará en modo simulado.");
  supabase = createMockSupabase();
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false },
  });
}

export { supabase };

export const testConnection = async () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.log("⚠️ Supabase no configurado — saltando verificación");
    return;
  }
  try {
    const { data, error } = await supabase.from("products").select("id").limit(1);
    if (error) throw error;
    console.log("✅ Conexión a Supabase exitosa");
  } catch (err) {
    console.error("❌ Error conectando a Supabase:", err.message);
  }
};
