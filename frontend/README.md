# Frontend — Pin Minimal

Frontend React con Vite y Bootstrap 5.3 para una interfaz minimalista tipo Pinterest.

## Variables de entorno

Copia `.env.example` a `.env`:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_PUBLIC_URL=http://localhost:5173
```

## Ejecutar localmente

```bash
npm install
npm run dev
```

## Funcionalidades

- Usuario actual guardado en `sessionStorage`.
- Header `X-User-Id` en cada llamada a la API.
- Feed de posts con mosaico responsive.
- CRUD completo con formularios y modales.
- Detalle por id usando `GET /api/posts/{id}`.
- Paginación controlada desde el cliente.
- Cache de posts y timestamp en `localStorage`.
- Discovery vía API propia que consume Unsplash desde backend.
- Metadatos OpenGraph para compartir en redes y WhatsApp.
