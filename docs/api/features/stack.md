# Stack Tecnológico

Endpoints para gestionar Áreas y Tecnologías.

## URL Base
`{{baseUrl}}/api/v1`

## Áreas

### Listar Áreas
- **Endpoint**: `GET /stack/areas`
- **Autenticación**: Requerida.
- **Respuesta (200)**:
  ```json
  [
    {
      "id": "uuid",
      "name": "Frontend",
      "slug": "frontend",
      "iconCode": "code"
    }
  ]
  ```

### Obtener Área
- **Endpoint**: `GET /stack/areas/:slug`
- **Autenticación**: Requerida.
- **Respuesta (200)**: Objeto de Área.

### Crear Área
- **Endpoint**: `POST /stack/areas`
- **Autenticación**: Requerida.
- **Payload**: `{ "name": "Frontend", "slug": "frontend", "iconCode": "code" }`
- **Respuesta (201)**: Objeto de Área creada.

### Actualizar Área
- **Endpoint**: `PATCH /stack/areas/:id`
- **Autenticación**: Requerida.

### Eliminar Área
- **Endpoint**: `DELETE /stack/areas/:id`
- **Autenticación**: Requerida.

## Tecnologías

### Listar Tecnologías
- **Endpoint**: `GET /stack/technologies`
- **Autenticación**: Requerida.
- **Respuesta (200)**:
  ```json
  [
    {
      "id": "uuid",
      "name": "Angular",
      "slug": "angular",
      "websiteUrl": "https://angular.io",
      "areaId": "uuid-area"
    }
  ]
  ```

### Obtener Tecnología
- **Endpoint**: `GET /stack/technologies/:slug`
- **Autenticación**: Requerida.

### Crear Tecnología
- **Endpoint**: `POST /stack/technologies`
- **Autenticación**: Requerida.
- **Payload**:
  ```json
  {
    "areaId": "uuid",
    "name": "Angular",
    "slug": "angular",
    "websiteUrl": "..."
  }
  ```
- **Respuesta (201)**: Objeto de Tecnología creada.

### Actualizar Tecnología
- **Endpoint**: `PATCH /stack/technologies/:id`
- **Autenticación**: Requerida.

### Eliminar Tecnología
- **Endpoint**: `DELETE /stack/technologies/:id`
- **Autenticación**: Requerida.