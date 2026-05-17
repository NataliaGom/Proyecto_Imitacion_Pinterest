# Backend — Pin Minimal API

API propia hecha con FastAPI, Python y PostgreSQL sin SQLAlchemy/ORM. Todas las operaciones usan conexión directa con `psycopg2`, `.cursor()`, `.execute()`, `.fetchone()`, `.fetchall()` y `.commit()`.

## Variables de entorno

Copia `.env.example` a `.env` y configura:

```env
DATABASE_URL=postgresql://usuario:password@host:5432/database
UNSPLASH_ACCESS_KEY=tu_access_key_de_unsplash
FRONTEND_ORIGIN=http://localhost:5173
```

## Ejecutar localmente

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
fastapi dev app/main.py
```

## Endpoints principales

- `GET /api/health`
- `GET /api/posts?page=1&page_size=12&min_date=...`
- `GET /api/posts/{post_id}`
- `POST /api/posts`
- `PATCH /api/posts/{post_id}`
- `PUT /api/posts/{post_id}`
- `DELETE /api/posts/{post_id}`
- `GET /api/discovery?page=1&per_page=12`

Todos los endpoints de negocio requieren el header:

```http
X-User-Id: andrea
```
