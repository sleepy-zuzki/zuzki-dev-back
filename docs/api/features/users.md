# Usuarios

Endpoints para la gestión de usuarios del sistema.

## URL Base
`{{baseUrl}}/api/v1`

## Endpoints

### Obtener Usuario por ID
- **Endpoint**: `GET /users/:id`
- **Autenticación**: Requerida.
- **Respuesta (200)**:
  ```json
  {
    "id": "uuid",
    "email": "user@example.com",
    "roles": ["user", "admin"],
    "isActive": true,
    "createdAt": "2024-01-01T10:00:00Z"
  }
  ```

### Crear Usuario
- **Endpoint**: `POST /users`
- **Autenticación**: Requerida.
- **Payload**:
  ```json
  {
    "email": "new@user.com",
    "password": "securePass123",
    "roles": ["user"],
    "isActive": true
  }
  ```
- **Respuesta (201)**: Mismo objeto que Obtener Usuario.