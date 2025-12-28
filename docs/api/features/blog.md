# Blog

Endpoints para la gestión de entradas del blog.

## URL Base
`{{baseUrl}}/api/v1`

## Endpoints

### Listar Entradas
- **Endpoint**: `GET /blog/entries`
- **Autenticación**: No requerida.
- **Parámetros de Consulta (Query Params)**:
  - `status` (opcional): Filtra por estado (`draft`, `published`, `archived`). Si no se envía, devuelve todas las entradas sin importar el estado.
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
- **Autenticación**: No requerida.
- **Respuesta (200)**: Objeto de entrada (ver arriba).

### Obtener por Slug
- **Endpoint**: `GET /blog/entries/slug/:slug`
- **Autenticación**: No requerida.
- **Respuesta (200)**: Objeto de entrada.

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

## Gestión de Archivos

### Adjuntar Archivo
Asocia un archivo existente a una entrada de blog.
- **Endpoint**: `POST /blog/entries/:id/files`
- **Autenticación**: Requerida.
- **Payload**:
  ```json
  {
    "fileId": "uuid-del-archivo",
    "contextSlug": "cover", // o 'gallery', etc.
    "order": 1
  }
  ```
- **Respuesta (204)**: No Content.

### Desvincular Archivo
- **Endpoint**: `DELETE /blog/entries/:id/files/:fileId`
- **Autenticación**: Requerida.
- **Respuesta (204)**: No Content.

### Reordenar Archivos
- **Endpoint**: `PATCH /blog/entries/:id/files/order`
- **Autenticación**: Requerida.
- **Payload**:
  ```json
  {
    "items": [
      { "fileId": "uuid-1", "order": 1 },
      { "fileId": "uuid-2", "order": 2 }
    ]
  }
  ```
- **Respuesta (204)**: No Content.

### Actualizar Contexto
Cambia el tipo de uso de una imagen (ej. de 'gallery' a 'cover').
- **Endpoint**: `PUT /blog/entries/:id/files/:fileId/context`
- **Autenticación**: Requerida.
- **Payload**: `{ "contextSlug": "cover" }`
- **Respuesta (204)**: No Content.

### Establecer Portada
Atajo para actualizar el contexto de un archivo a 'cover'.
- **Endpoint**: `PUT /blog/entries/:id/cover/:fileId`
- **Autenticación**: Requerida.
- **Respuesta (204)**: No Content.