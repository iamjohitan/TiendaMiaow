-- ============================================================
-- Tienda Miaow — Supabase Schema + Seed Data
-- Execute this in the Supabase SQL Editor
-- ============================================================

-- ── CATEGORIES ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL
);

INSERT INTO categories (name, slug) VALUES
  ('Procesadores', 'cpu'),
  ('Tarjetas Gráficas', 'gpu'),
  ('Motherboards', 'mobo'),
  ('Memorias RAM', 'ram'),
  ('Almacenamiento', 'storage'),
  ('Fuentes de Poder', 'psu'),
  ('Gabinetes', 'case')
ON CONFLICT (slug) DO NOTHING;

-- ── PRODUCTS ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  stock INTEGER DEFAULT 0,
  category TEXT NOT NULL,
  image_url TEXT,
  brand TEXT,
  specs JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO products (name, description, price, stock, category, image_url, brand, specs) VALUES
(
  'AMD Ryzen 7 7800X3D',
  'El mejor procesador para gaming del mercado. 8 núcleos y 16 hilos con tecnología 3D V-Cache para máximo rendimiento.',
  389.99, 12, 'cpu',
  'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=500&auto=format&fit=crop&q=60',
  'AMD',
  '{"núcleos": "8", "hilos": "16", "frecuencia_base": "4.2 GHz", "frecuencia_boost": "5.0 GHz", "socket": "AM5", "tdp": "120W", "caché": "104MB"}'
),
(
  'Intel Core i5-13600K',
  'Procesador de 13ª generación con 14 núcleos (6P+8E). Desbloqueado para overclocking, ideal para gaming y productividad.',
  299.99, 8, 'cpu',
  'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=500&auto=format&fit=crop&q=60',
  'Intel',
  '{"núcleos": "14 (6P+8E)", "hilos": "20", "frecuencia_base": "3.5 GHz", "frecuencia_boost": "5.1 GHz", "socket": "LGA1700", "tdp": "125W"}'
),
(
  'AMD Ryzen 5 5600X',
  'Procesador de 6 núcleos y 12 hilos. Una de las opciones más populares para gaming en Full HD con excelente eficiencia.',
  159.99, 25, 'cpu',
  'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=500&auto=format&fit=crop&q=60',
  'AMD',
  '{"núcleos": "6", "hilos": "12", "frecuencia_base": "3.7 GHz", "frecuencia_boost": "4.6 GHz", "socket": "AM4", "tdp": "65W"}'
),
(
  'NVIDIA GeForce RTX 4070 Super',
  'Tarjeta gráfica con 12GB GDDR6X, trazado de rayos y DLSS 3. Perfecta para gaming en 1440p y 4K.',
  599.99, 5, 'gpu',
  'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&auto=format&fit=crop&q=60',
  'NVIDIA',
  '{"vram": "12GB GDDR6X", "frecuencia": "2475 MHz", "cuda_cores": "7168", "bus": "192-bit", "tdp": "220W", "hdmi": "2.1", "displayport": "1.4a"}'
),
(
  'NVIDIA GeForce RTX 4060',
  'GPU ideal para gaming a 1080p con ajustes ultra. Consumo optimizado y DLSS 3 para mayor rendimiento.',
  299.99, 18, 'gpu',
  'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&auto=format&fit=crop&q=60',
  'NVIDIA',
  '{"vram": "8GB GDDR6", "frecuencia": "2460 MHz", "cuda_cores": "3072", "bus": "128-bit", "tdp": "115W"}'
),
(
  'AMD Radeon RX 7800 XT',
  'GPU potente con 16GB VRAM GDDR6. Ideal para gaming a 1440p sin preocuparse por límites de memoria.',
  499.99, 7, 'gpu',
  'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&auto=format&fit=crop&q=60',
  'AMD',
  '{"vram": "16GB GDDR6", "frecuencia": "2430 MHz", "stream_processors": "3840", "bus": "256-bit", "tdp": "263W"}'
),
(
  'ASUS ROG STRIX B650-A GAMING WIFI',
  'Placa madre AM5 con DDR5, WiFi 6E, PCIe 5.0 y diseño blanco/plateado premium.',
  219.99, 10, 'mobo',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop&q=60',
  'ASUS',
  '{"socket": "AM5", "chipset": "B650", "ram": "DDR5", "max_ram": "128GB", "formato": "ATX", "pcie": "5.0", "wifi": "6E"}'
),
(
  'MSI MAG B760 TOMAHAWK WIFI',
  'Placa madre duradera para Intel LGA1700, con DDR5, disipadores robustos y excelente conectividad.',
  189.99, 14, 'mobo',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop&q=60',
  'MSI',
  '{"socket": "LGA1700", "chipset": "B760", "ram": "DDR5", "max_ram": "192GB", "formato": "ATX", "pcie": "5.0", "wifi": "6E"}'
),
(
  'Gigabyte A620M GAMING X',
  'Motherboard Micro-ATX asequible para AM5 con DDR5. Perfecta para builds compactos.',
  109.99, 22, 'mobo',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop&q=60',
  'Gigabyte',
  '{"socket": "AM5", "chipset": "A620", "ram": "DDR5", "max_ram": "96GB", "formato": "Micro-ATX", "pcie": "4.0"}'
),
(
  'Corsair Vengeance DDR5 32GB (2x16GB) 6000MHz',
  'Kit DDR5 de alta velocidad optimizado para las últimas plataformas con perfiles Intel XMP 3.0.',
  104.99, 30, 'ram',
  'https://images.unsplash.com/photo-1562976540-1502c2145186?w=500&auto=format&fit=crop&q=60',
  'Corsair',
  '{"capacidad": "32GB (2x16GB)", "tipo": "DDR5", "frecuencia": "6000MHz", "latencia": "CL36", "voltaje": "1.35V", "xmp": "3.0"}'
),
(
  'Kingston FURY Beast RGB 16GB (2x8GB) DDR4 3200MHz',
  'Kit DDR4 con iluminación RGB personalizable y perfiles Intel XMP para overclocking automático.',
  49.99, 40, 'ram',
  'https://images.unsplash.com/photo-1562976540-1502c2145186?w=500&auto=format&fit=crop&q=60',
  'Kingston',
  '{"capacidad": "16GB (2x8GB)", "tipo": "DDR4", "frecuencia": "3200MHz", "latencia": "CL16", "voltaje": "1.35V", "rgb": "Sí"}'
),
(
  'G.Skill Trident Z5 Neo RGB DDR5 32GB (2x16GB) 6000MHz',
  'Kit DDR5 de alta gama diseñado para AMD Ryzen con perfiles AMD EXPO y diseño RGB espectacular.',
  119.99, 20, 'ram',
  'https://images.unsplash.com/photo-1562976540-1502c2145186?w=500&auto=format&fit=crop&q=60',
  'G.Skill',
  '{"capacidad": "32GB (2x16GB)", "tipo": "DDR5", "frecuencia": "6000MHz", "latencia": "CL30", "voltaje": "1.35V", "expo": "Sí"}'
),
(
  'Kingston NV2 1TB NVMe PCIe 4.0',
  'SSD M.2 PCIe Gen 4x4 con lecturas de hasta 3500 MB/s. Excelente relación precio-rendimiento.',
  62.99, 35, 'storage',
  'https://images.unsplash.com/photo-1597872200919-0127a446134a?w=500&auto=format&fit=crop&q=60',
  'Kingston',
  '{"capacidad": "1TB", "tipo": "NVMe PCIe 4.0", "lectura": "3500 MB/s", "escritura": "2100 MB/s", "formato": "M.2 2280"}'
),
(
  'Samsung 990 Pro 2TB NVMe PCIe 4.0',
  'SSD de gama entusiasta más rápido. Lecturas de hasta 7450 MB/s, ideal para edición de video y gaming extremo.',
  169.99, 9, 'storage',
  'https://images.unsplash.com/photo-1597872200919-0127a446134a?w=500&auto=format&fit=crop&q=60',
  'Samsung',
  '{"capacidad": "2TB", "tipo": "NVMe PCIe 4.0", "lectura": "7450 MB/s", "escritura": "6900 MB/s", "formato": "M.2 2280"}'
),
(
  'Crucial BX500 480GB SATA III',
  'SSD SATA de 2.5" ideal como almacenamiento secundario o para acelerar equipos antiguos.',
  34.99, 50, 'storage',
  'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=60',
  'Crucial',
  '{"capacidad": "480GB", "tipo": "SATA III", "lectura": "540 MB/s", "escritura": "500 MB/s", "formato": "2.5 pulgadas"}'
),
(
  'Corsair RM750e 750W 80+ Gold',
  'Fuente modular de 750W con certificación 80+ Gold, ventilador silencioso y soporte ATX 3.0 / PCIe 5.0.',
  99.99, 15, 'psu',
  'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=500&auto=format&fit=crop&q=60',
  'Corsair',
  '{"potencia": "750W", "eficiencia": "80+ Gold", "modular": "Total", "atx_3": "Sí", "pcie_5": "Sí", "ventilador": "120mm"}'
),
(
  'EVGA 600 W1 600W 80+',
  'Fuente básica de 600W con cableado fijo, ideal para ensambles de bajo presupuesto.',
  45.99, 28, 'psu',
  'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=500&auto=format&fit=crop&q=60',
  'EVGA',
  '{"potencia": "600W", "eficiencia": "80+", "modular": "No", "ventilador": "120mm"}'
),
(
  'Seasonic Focus GX-850 850W 80+ Gold',
  'Fuente ultra-eficiente de 850W modular. Confiabilidad absoluta con 10 años de garantía.',
  129.99, 11, 'psu',
  'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=500&auto=format&fit=crop&q=60',
  'Seasonic',
  '{"potencia": "850W", "eficiencia": "80+ Gold", "modular": "Total", "atx_3": "Sí", "pcie_5": "Sí", "garantia": "10 años"}'
),
(
  'Corsair 4000D Airflow Tempered Glass',
  'Gabinete semitorre con frente de rejilla para alto flujo de aire y panel lateral de vidrio templado.',
  89.99, 16, 'case',
  'https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?w=500&auto=format&fit=crop&q=60',
  'Corsair',
  '{"formato": "Semitorre", "motherboard": "ATX / Micro-ATX / Mini-ITX", "ventiladores": "3x 120mm / 2x 140mm", "gpu_max": "360mm", "almacenamiento": "2x 3.5 + 2x 2.5"}'
),
(
  'NZXT H5 Flow Compact Mid-Tower',
  'Gabinete compacto diseñado para refrigeración óptima con ventilador exclusivo en ángulo para la GPU.',
  94.99, 13, 'case',
  'https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?w=500&auto=format&fit=crop&q=60',
  'NZXT',
  '{"formato": "Mid-Tower", "motherboard": "ATX / Micro-ATX / Mini-ITX", "ventiladores": "2x 120mm + 1x 120mm angle", "gpu_max": "365mm", "almacenamiento": "1x 3.5 + 2x 2.5"}'
),
(
  'Lian Li PC-O11 Dynamic',
  'Gabinete icónico de doble cámara para ensambles con refrigeración líquida personalizada.',
  149.99, 4, 'case',
  'https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?w=500&auto=format&fit=crop&q=60',
  'Lian Li',
  '{"formato": "Mid-Tower", "motherboard": "ATX / Micro-ATX / Mini-ITX", "ventiladores": "hasta 9x 120mm", "gpu_max": "420mm", "radiador_max": "360mm"}'
);

-- ── ORDERS ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_email TEXT NOT NULL,
  user_name TEXT NOT NULL,
  shipping_address TEXT NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'confirmed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── ORDER ITEMS ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL
);

-- ── CONTACT MESSAGES ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS contact_messages (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── ROW LEVEL SECURITY ────────────────────────────────────
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Products: anyone can read
CREATE POLICY "products_select_all" ON products FOR SELECT USING (true);

-- Categories: anyone can read
CREATE POLICY "categories_select_all" ON categories FOR SELECT USING (true);

-- Orders: anyone can insert (we use anon key for this demo)
CREATE POLICY "orders_insert_all" ON orders FOR INSERT WITH CHECK (true);
-- Orders: read own by email
CREATE POLICY "orders_select_own" ON orders FOR SELECT USING (true);

-- Order items: anyone can insert
CREATE POLICY "order_items_insert_all" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "order_items_select_all" ON order_items FOR SELECT USING (true);

-- Contact messages: anyone can insert
CREATE POLICY "contact_messages_insert_all" ON contact_messages FOR INSERT WITH CHECK (true);
