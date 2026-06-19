<p align="center">
  <img src="frontend/img/logo.png" alt="Tienda Miaow" width="80" />
</p>

<h1 align="center">🐱 Tienda Miaow</h1>

<p align="center">
  <strong>Hardware premium en Cali, Colombia</strong><br />
  Componentes originales — precios justos — asesoría de verdad
</p>

<p align="center">
  <a href="#caracteristicas">Características</a> •
  <a href="#stack-tecnologico">Stack</a> •
  <a href="#empezar">Empezar</a> •
  <a href="#api">API</a> •
  <a href="#despliegue">Despliegue</a>
</p>

---

## Características

- **Catálogo de productos** — Navega, filtra y busca entre más de 20 componentes con especificaciones técnicas detalladas.
- **PC Builder** — Arma tu PC paso a paso seleccionando componentes de cada categoría, con progreso visual y cotización por WhatsApp.
- **Carrito de compras** — Offcanvas lateral con persistencia en localStorage, ajuste de cantidades y resumen.
- **Checkout** — Formulario de envío, creación de orden en base de datos y pantalla de éxito con confeti.
- **Formulario de contacto** — Envío de mensajes a base de datos con validación en cliente y servidor.
- **Diseño responsive** — Tema oscuro tech premium con animaciones, glassmorphism y micro-interacciones.

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| **Frontend** | HTML5, CSS3 (Design System propio), JavaScript (ES6+) |
| **CDN** | Bootstrap 5.3, Bootstrap Icons, Google Fonts (Inter + Outfit), SweetAlert2 |
| **Backend** | Node.js + Express 5 (ES Modules) |
| **Base de datos** | Supabase (PostgreSQL) |
| **Hosting Frontend** | [Vercel](https://tiendamiaow.vercel.app) |
| **Hosting Backend** | Railway |

## Estructura del Proyecto

```
TiendaMiaow/
├── backend/
│   ├── src/
│   │   ├── app.js                  # Servidor Express
│   │   ├── config/
│   │   │   ├── supabase.js         # Cliente Supabase (con fallback mock)
│   │   │   └── db.js               # Re-export + test de conexión
│   │   ├── controllers/
│   │   │   ├── productos.controller.js
│   │   │   ├── ordenes.controller.js
│   │   │   └── contacto.controller.js
│   │   └── routes/
│   │       ├── index.js
│   │       ├── productos.routes.js
│   │       ├── ordenes.routes.js
│   │       └── contacto.routes.js
│   ├── supabase/
│   │   └── migration.sql           # Esquema DDL + 21 productos semilla
│   ├── package.json
│   └── .env                        # Variables de entorno (no versionar)
├── frontend/
│   ├── index.html                  # Landing page
│   ├── css/
│   │   └── styles.css              # Sistema de diseño completo (~2500 líneas)
│   ├── js/
│   │   ├── main.js                 # Animaciones, navbar shrink, búsqueda
│   │   ├── cart.js                 # Carrito (localStorage + offcanvas)
│   │   ├── productos.js            # Catálogo con filtros
│   │   ├── detalle_producto.js     # Detalle de producto
│   │   ├── pc_builder.js           # PC Builder interactivo
│   │   ├── contacto.js             # Formulario de contacto
│   │   └── checkout.js             # Checkout con confeti
│   ├── img/                        # Logo, favicon, imágenes
│   └── pages/
│       ├── productos.html
│       ├── detalle_producto.html
│       ├── pc_builder.html
│       ├── contacto.html
│       └── checkout.html
├── .gitignore
├── LICENSE                         # MIT
└── README.md
```

## API

Todas las rutas están montadas bajo `/api` en el puerto `4000`.

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/` | Health check |
| `GET` | `/api/productos` | Listar todos los productos |
| `GET` | `/api/productos/:id` | Obtener producto por ID |
| `POST` | `/api/orders` | Crear una orden |
| `GET` | `/api/orders/:id` | Obtener orden por ID |
| `POST` | `/api/contacto` | Enviar mensaje de contacto |

### Ejemplos de uso

**GET /api/productos**
```json
[
  {
    "id": 1,
    "nombre": "AMD Ryzen 7 7800X3D",
    "marca": "AMD",
    "precio": 389.99,
    "categoria": "cpu",
    "imagen": "https://...",
    "stock": 12,
    "especificaciones": { "nucleos": 8, "hilos": 16, ... }
  }
]
```

**POST /api/contacto**
```json
{
  "nombre": "Juan",
  "apellido": "Pérez",
  "email": "juan@ejemplo.com",
  "asunto": "Consulta",
  "mensaje": "Quiero cotizar un RTX 4070 Super"
}
```

## Empezar

### Requisitos

- Node.js 18+
- Una cuenta en [Supabase](https://supabase.com) (opcional — el servidor funciona con un mock si no hay credenciales)

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tuusuario/tienda-miaow.git
cd tienda-miaow

# Backend
cd backend
npm install
cp .env.example .env   # Editar con tus credenciales de Supabase
npm run dev             # Servidor en http://localhost:4000

# Frontend (en otra terminal)
cd frontend
# Abrir index.html con Live Server (puerto 5500) o cualquier servidor estático
```

### Base de datos

1. Crea un proyecto en [Supabase](https://supabase.com).
2. Ve a **SQL Editor** y pega el contenido de `backend/supabase/migration.sql`.
3. Copia las credenciales (`SUPABASE_URL` y `SUPABASE_ANON_KEY`) desde **Settings → API** a tu `.env`.

### Variables de Entorno

| Variable | Descripción |
|----------|-------------|
| `SUPABASE_URL` | URL de tu proyecto Supabase |
| `SUPABASE_ANON_KEY` | Anon key pública de Supabase |
| `PORT` | Puerto del servidor (por defecto 4000) |
| `FRONTEND_URL` | URL del frontend para CORS |

## Despliegue

### Backend (Railway)

```bash
# El backend se despliega automáticamente desde GitHub en Railway
# Configurar las variables de entorno en el panel de Railway
```

### Frontend (Vercel)

```bash
# Conectar el repositorio a Vercel
# Carpeta raíz: frontend/
# Build command: ninguno (sitio estático)
# Sin framework
```

## Licencia

Distribuido bajo la licencia MIT. Ver `LICENSE` para más información.

---

<p align="center">
  Hecho con ❤️ en Cali, Colombia<br />
  <a href="mailto:soporte.tiendamiaow@gmail.com">soporte.tiendamiaow@gmail.com</a>
</p>
