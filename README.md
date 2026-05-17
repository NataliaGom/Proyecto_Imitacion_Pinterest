# Proyecto_Imitacion_Pinterest

Sitio web full-stack inspirado en Pinterest con estilo minimalista. Incluye frontend React/Vite/Bootstrap y backend FastAPI/PostgreSQL sin ORM, CRUD completo, protección por usuario mediante headers, cache local del feed, paginación y descubrimiento de fotos desde Unsplash consumido exclusivamente desde el backend.

## Stack

### Backend

- Python
- `fastapi[standard]`
- PostgreSQL
- `psycopg2-binary`
- `httpx`
- Sin SQLAlchemy ni ORM
- Preparado para Render

### Frontend

- React
- Vite
- Bootstrap 5.3
- Bootstrap Icons
- `sessionStorage` para usuario actual
- `localStorage` para cache de feed y timestamp
- OpenGraph en `frontend/index.html`

## Estructura

```txt
backend/
  app/
    main.py
    config.py
    database.py
    schemas.py
    utils.py
    routers/
      posts.py
      discovery.py
  requirements.txt
frontend/
  index.html
  package.json
  vite.config.js
  public/og-image.svg
  src/
    App.jsx
    main.jsx
    api/client.js
    components/
    hooks/
    styles/custom.css
```

## Ejecutar backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
fastapi dev app/main.py
```

Configura en `backend/.env`:

```env
DATABASE_URL=postgresql://usuario:password@host:5432/database
UNSPLASH_ACCESS_KEY=tu_access_key_de_unsplash
FRONTEND_ORIGIN=http://localhost:5173
```

## Ejecutar frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Configura en `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_PUBLIC_URL=http://localhost:5173
```

## API propia

Todos los endpoints de negocio requieren este header:

```http
X-User-Id: andrea
```

Endpoints:

- `GET /api/posts?page=1&page_size=12&min_date=...` — listado paginado.
- `GET /api/posts/{post_id}` — detalle por id.
- `POST /api/posts` — alta de entidad.
- `PATCH /api/posts/{post_id}` — modificación parcial.
- `PUT /api/posts/{post_id}` — reemplazo completo.
- `DELETE /api/posts/{post_id}` — eliminación.
- `GET /api/discovery?page=1&per_page=12` — imágenes de Unsplash transformadas por backend.

## Reglas de permisos

El backend guarda el usuario creador en la columna `user_id`. Sólo el usuario que creó un post puede modificarlo, reemplazarlo o eliminarlo. Si otro usuario intenta hacerlo, la API responde `403 Forbidden`.

## Cache del feed

La primera carga obtiene posts desde PostgreSQL y guarda `pin_minimal_posts_cache` y `pin_minimal_posts_cache_timestamp` en `localStorage`. En cargas posteriores, el frontend muestra el cache inmediatamente y consulta la API con `min_date` para traer cambios posteriores al timestamp.

## Despliegue en Render

Backend:

- Root Directory: `backend`
- Build Command: `pip install -r requirements.txt`
- Start Command: `fastapi run app/main.py --host 0.0.0.0 --port $PORT`
- Variables: `DATABASE_URL`, `UNSPLASH_ACCESS_KEY`, `FRONTEND_ORIGIN`

Frontend como Static Site:

- Root Directory: `frontend`
- Build Command: `npm install && npm run build`
- Publish Directory: `dist`
- Variable: `VITE_API_BASE_URL=https://tu-api.onrender.com`
