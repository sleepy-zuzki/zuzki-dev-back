# Proyectos (Portfolio)

Endpoints para gestionar el portafolio de proyectos (Showcases).

## URL Base
`{{baseUrl}}/api/v1`

## Endpoints

### Listar Proyectos
- **Endpoint**: `GET /projects/showcases`
- **Autenticación**: Requerida.
- **Respuesta (200)**: Array de proyectos (ver estructura abajo).

### Listar Destacados
- **Endpoint**: `GET /projects/showcases/featured`
- **Autenticación**: Requerida.
- **Respuesta (200)**: Array de proyectos (Solo `isFeatured: true`).

### Obtener por Slug
- **Endpoint**: `GET /projects/showcases/:slug`
- **Autenticación**: Requerida.
- **Respuesta (200)**:
  ```json
  {
    "id": "uuid",
    "title": "Proyecto Alpha",
    "slug": "proyecto-alpha",
    "description": "Descripción...",
    "content": {},
    "repoUrl": "https://github.com/...",
    "liveUrl": "https://demo.com",
    "year": 2024,
    "isFeatured": true,
    "area": {
      "id": "uuid",
      "name": "Frontend",
      "slug": "frontend"
    },
    "technologies": [
      {
        "id": "uuid",
        "name": "React",
        "slug": "react"
      }
    ],
    "images": [
      {
        "id": "uuid",
        "url": "https://...",
        "type": "cover",
        "order": 1
      }
    ]
  }
  ```

### Crear Proyecto
- **Endpoint**: `POST /projects/showcases`
- **Autenticación**: Requerida.
- **Payload**:
  ```json
  {
    "title": "Proyecto X",
    "slug": "proyecto-x",
    "description": "...",
    "repoUrl": "...",
    "liveUrl": "...",
    "areaId": "uuid",
    "technologyIds": ["uuid1", "uuid2"]
  }
  ```
- **Respuesta (201)**: Objeto de proyecto creado.

### Actualizar Proyecto
- **Endpoint**: `PATCH /projects/showcases/:id`
- **Autenticación**: Requerida.
- **Payload**: Parcial de creación.
- **Respuesta (200)**: Objeto de proyecto actualizado.

### Eliminar Proyecto
- **Endpoint**: `DELETE /projects/showcases/:id`
- **Autenticación**: Requerida.
- **Respuesta (200)**: `{ "success": true }`.

## Gestión de Archivos de Proyecto

### Adjuntar Archivo
- **Endpoint**: `POST /projects/showcases/:id/files`
- **Payload**: `{ "fileId": "uuid", "contextSlug": "cover|gallery", "order": 1 }`

### Desvincular Archivo
- **Endpoint**: `DELETE /projects/showcases/:id/files/:fileId`

### Reordenar Archivos
- **Endpoint**: `PATCH /projects/showcases/:id/files/order`
- **Payload**: `{ "items": [{ "fileId": "uuid", "order": 1 }] }`

### Establecer Portada
- **Endpoint**: `PUT /projects/showcases/:id/cover/:fileId`