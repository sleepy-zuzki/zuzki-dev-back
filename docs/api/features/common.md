# Archivos y Contacto

## Archivos

### Subir Archivo
- **Endpoint**: `POST /files/upload`
- **Autenticación**: Requerida.
- **Tipo**: `multipart/form-data`.
- **Campo**: `file` (Binary, Max 5MB).
- **Respuesta (201)**: `FileEntity` (id, url, mimeType, etc.).

### Obtener Archivo
- **Endpoint**: `GET /files/:id`
- **Autenticación**: Requerida.
- **Respuesta (200)**: `FileEntity`.

### Eliminar Archivo
- **Endpoint**: `DELETE /files/:id`
- **Autenticación**: Requerida.
- **Respuesta (200)**: `{ "success": true }`.

---

## Contacto

### Enviar Mensaje
- **Endpoint**: `POST /contact`
- **Autenticación**: Pública.
- **Payload**:
  ```json
  {
    "name": "John Doe",
    "email": "john@doe.com",
    "message": "Hola..."
  }
  ```
- **Respuesta (204)**: No Content.

---

## Utilidades

### Health Check
- **Endpoint**: `GET /health`
- **Autenticación**: Pública.
- **Respuesta (200)**: Estado del servicio y base de datos.

### Métricas (Prometheus)
- **Endpoint**: `/api/metrics`
- **Autenticación**: Pública.
- **Respuesta (200)**: Texto plano formato Prometheus.
