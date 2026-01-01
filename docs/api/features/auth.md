# Autenticación

Endpoints para gestión de sesiones y tokens.

## URL Base
`{{baseUrl}}/api/v1`

## Endpoints

### Inicio de Sesión
- **Endpoint**: `POST /auth/login`
- **Autenticación**: No requerida.
- **Payload**:
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword"
  }
  ```
- **Respuesta (200)**:
  ```json
  {
    "accessToken": "eyJhbG...",
    "refreshToken": "eyJhbG...",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "roles": ["admin"]
    }
  }
  ```

### Refrescar Token
- **Endpoint**: `POST /auth/refresh`
- **Autenticación**: No requerida.
- **Payload**:
  ```json
  {
    "userId": "uuid",
    "refreshToken": "token-string"
  }
  ```
- **Respuesta (200)**:
  ```json
  {
    "accessToken": "eyJhbG...",
    "refreshToken": "eyJhbG...",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "roles": ["admin"]
    }
  }
  ```

### Cierre de Sesión
- **Endpoint**: `POST /auth/logout`
- **Autenticación**: Requerida (Bearer).
- **Payload**:
  ```json
  {
    "userId": "uuid",
    "refreshToken": "token-string"
  }
  ```
- **Respuesta (200)**:
  ```json
  {
    "success": true
  }
  ```