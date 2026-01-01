# Archivos y Contacto

## Archivos

### Subir Archivo
- **Endpoint**: `POST /files/upload`
- **Autenticación**: Requerida.
- **Tipo**: `multipart/form-data`.
- **Campo**: `file` (Binary, Max 5MB).
- **Respuesta (201)**:
  ```json
  {
    "id": "uuid",
    "url": "https://bucket.provider.com/key.jpg",
    "mimeType": "image/jpeg",
    "sizeBytes": 102400,
    "createdAt": "2024-01-01T10:00:00Z"
  }
  ```

### Obtener Archivo
- **Endpoint**: `GET /files/:id`
- **Autenticación**: Requerida.
- **Respuesta (200)**: Mismo objeto que Subir Archivo.

### Eliminar Archivo
- **Endpoint**: `DELETE /files/:id`
- **Autenticación**: Requerida.
- **Respuesta (200)**:
  ```json
  {
    "success": true
  }
  ```

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
    "message": "Hola, me gustaría contactar..."
  }
  ```
- **Respuesta (204)**: No Content.

---

## Utilidades

### Health Check
- **Endpoint**: `GET /health`
- **Autenticación**: Pública.
- **Respuesta (200)**:
  ```json
  {
    "status": "ok",
    "uptime": 123.45,
    "timestamp": "2024-01-01T12:00:00Z",
    "database": {
      "status": "up",
      "initialized": true
    }
  }
  ```

### Métricas (Prometheus)
- **Endpoint**: `/api/metrics`
- **Autenticación**: Pública.
- **Respuesta (200)**: Texto plano formato Prometheus.