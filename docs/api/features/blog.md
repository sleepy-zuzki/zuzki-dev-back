# Blog

Endpoints para la gestión de entradas del blog.

## URL Base
`{{baseUrl}}/api/v1`

## Endpoints

### Listar Entradas
- **Endpoint**: `GET /blog/entries`
- **Autenticación**: Requerida.
- **Respuesta (200)**:
  ```json
  [
    {
      "id": "uuid",
      "status": "published",
      "title": "Mi Primera Entrada",
      "slug": "mi-primera-entrada",
      "description": "Una breve descripción...",
      "publishDate": "2024-01-01T12:00:00Z",
      "createdAt": "2024-01-01T10:00:00Z",
      "updatedAt": "2024-01-01T10:00:00Z"
    }
  ]
  ```

### Obtener por ID
- **Endpoint**: `GET /blog/entries/:id`
- **Autenticación**: Requerida.
- **Respuesta (200)**:
  ```json
  {
    "id": "uuid",
    "status": "draft",
    "title": "Borrador",
    "slug": "borrador",
    "description": null,
    "content": { "time": 1234567890, "blocks": [] },
    "publishDate": null,
    "createdAt": "2024-01-02T10:00:00Z",
    "updatedAt": "2024-01-02T10:00:00Z"
  }
  ```

### Obtener por Slug
- **Endpoint**: `GET /blog/entries/slug/:slug`
- **Autenticación**: Requerida.
- **Respuesta (200)**: Mismo objeto que Obtener por ID.

### Crear Entrada
- **Endpoint**: `POST /blog/entries`
- **Autenticación**: Requerida.
- **Payload**:
  ```json
  {
    "title": "Nueva Entrada",
    "slug": "nueva-entrada",
    "description": "Opcional",
    "content": {},
    "publishDate": "2024-12-31T23:59:59Z"
  }
  ```
- **Nota**: Estado inicial por defecto: `draft`.
- **Respuesta (201)**: Objeto de entrada creada.

### Publicar Entrada
Cambia el estado de `draft` a `published`.
- **Endpoint**: `POST /blog/entries/:id/publish`
- **Autenticación**: Requerida.
- **Reglas**:
  - `draft` -> `published`: OK.
  - `published` -> `published`: OK (No-op).
  - `archived` -> Error 401.
- **Respuesta (200)**: Sin contenido (Void).

### Actualizar Entrada
- **Endpoint**: `PATCH /blog/entries/:id`
- **Autenticación**: Requerida.
- **Payload**: Parcial de creación.
- **Respuesta (200)**: Objeto de entrada actualizada.

### Eliminar Entrada
- **Endpoint**: `DELETE /blog/entries/:id`
- **Autenticación**: Requerida.
- **Respuesta (200)**:
  ```json
  {
    "success": true
  }
  ```