# Proyectos (Portfolio)

Endpoints para gestionar el portafolio de proyectos (Showcases).

## URL Base
`{{baseUrl}}/api/v1`

## Endpoints

### Listar Proyectos
- **Endpoint**: `GET /projects/showcases`
- **Autenticación**: Requerida.
- **Respuesta (200)**: `ShowcaseResponseDto[]`.

### Listar Destacados
- **Endpoint**: `GET /projects/showcases/featured`
- **Autenticación**: Requerida.
- **Respuesta (200)**: `ShowcaseResponseDto[]` (Solo `isFeatured: true`).

### Obtener por Slug
- **Endpoint**: `GET /projects/showcases/:slug`
- **Autenticación**: Requerida.
- **Respuesta (200)**: `ShowcaseResponseDto` (Incluye Área, Tecnologías e Imágenes).

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
- **Respuesta (201)**: `ShowcaseResponseDto`.

### Actualizar Proyecto
- **Endpoint**: `PATCH /projects/showcases/:id`
- **Autenticación**: Requerida.
- **Payload**: Parcial de creación.
- **Respuesta (200)**: `ShowcaseResponseDto`.

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
