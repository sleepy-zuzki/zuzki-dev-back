# Blog

Endpoints para la gestión de entradas del blog.

## URL Base
`{{baseUrl}}/api/v1`

## Endpoints

### Listar Entradas
- **Endpoint**: `GET /blog/entries`
- **Autenticación**: Requerida.
- **Respuesta (200)**: `BlogResponseDto[]`.

### Obtener por ID
- **Endpoint**: `GET /blog/entries/:id`
- **Autenticación**: Requerida.
- **Respuesta (200)**: `BlogResponseDto` (incluye `status`).

### Obtener por Slug
- **Endpoint**: `GET /blog/entries/slug/:slug`
- **Autenticación**: Requerida.
- **Respuesta (200)**: `BlogResponseDto`.

### Crear Entrada
- **Endpoint**: `POST /blog/entries`
- **Autenticación**: Requerida.
- **Payload**:
  ```json
  {
    "title": "Mi Título",
    "slug": "mi-titulo",
    "description": "Opcional",
    "content": {},
    "publishDate": "ISO-Date"
  }
  ```
- **Nota**: Estado inicial por defecto: `draft`.
- **Respuesta (201)**: `BlogResponseDto`.

### Publicar Entrada
Cambia el estado de `draft` a `published`.
- **Endpoint**: `POST /blog/entries/:id/publish`
- **Autenticación**: Requerida.
- **Reglas**:
  - `draft` -> `published`: OK.
  - `published` -> `published`: OK (No-op).
  - `archived` -> Error 401.
- **Respuesta (200)**: Void.

### Actualizar Entrada
- **Endpoint**: `PATCH /blog/entries/:id`
- **Autenticación**: Requerida.
- **Payload**: Parcial de creación.
- **Respuesta (200)**: `BlogResponseDto`.

### Eliminar Entrada
- **Endpoint**: `DELETE /blog/entries/:id`
- **Autenticación**: Requerida.
- **Respuesta (200)**: `{ "success": true }`.
