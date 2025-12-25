# **Documentación de la API de Zuzki Dev**

Este documento proporciona una referencia completa de todos los endpoints disponibles en la API de Zuzki Dev.

**URL Base**: `{{baseUrl}}/v1`
**Versión de la API**: `v1`

---

## **Autenticación**

La mayoría de los endpoints requieren un Token Bearer para la autenticación. El token debe incluirse en la cabecera `Authorization`.

`Authorization: Bearer {{accessToken}}`

### **Inicio de Sesión**

- **Endpoint**: `POST /auth/login`
- **Autenticación**: No requerida.
- **Cuerpo de la Solicitud** (`application/json`):

| Campo      | Tipo   | Requerido | Descripción                   |
| :--------- | :----- | :-------- | :---------------------------- |
| `email`    | string | Sí        | Email del usuario.            |
| `password` | string | Sí        | Contraseña (mínimo 8 caract.). |

- **Respuesta Exitosa (`200 OK`)**: Devuelve un objeto `LoginResponse` que contiene tokens de acceso/refresco e información del usuario.

### **Refrescar Token de Acceso**

- **Endpoint**: `POST /auth/refresh`
- **Autenticación**: No requerida.
- **Cuerpo de la Solicitud** (`application/json`):

| Campo          | Tipo   | Requerido | Descripción                   |
| :------------- | :----- | :-------- | :---------------------------- |
| `userId`       | uuid   | Sí        | ID del usuario.               |
| `refreshToken` | string | Sí        | Token de refresco válido.     |

- **Respuesta Exitosa (`200 OK`)**: Devuelve un nuevo objeto `LoginResponse`.

### **Cierre de Sesión**

Revoca el token de refresco de un usuario.

- **Endpoint**: `POST /auth/logout`
- **Autenticación**: Requerida (implícitamente a través de la verificación de propiedad del token).
- **Cuerpo de la Solicitud** (`application/json`):

| Campo          | Tipo   | Requerido | Descripción                    |
| :------------- | :----- | :-------- | :----------------------------- |
| `userId`       | uuid   | Sí        | ID del usuario.                |
| `refreshToken` | string | Sí        | El token de refresco a revocar.|

- **Respuesta Exitosa (`200 OK`)**: Devuelve `{ "success": true }`.

---

## **Usuarios**

Endpoints para la gestión de usuarios.

### **Obtener Usuario por ID**

- **Endpoint**: `GET /users/:id`
- **Autenticación**: Requerida.
- **Parámetros de URL**:
  - `id` (uuid, requerido): El ID del usuario.
- **Respuesta Exitosa (`200 OK`)**: Devuelve un `UserResponseDto`.

### **Crear Usuario**

- **Endpoint**: `POST /users`
- **Autenticación**: Requerida.
- **Cuerpo de la Solicitud** (`application/json`):

| Campo      | Tipo     | Requerido | Descripción                               |
| :--------- | :------- | :-------- | :---------------------------------------- |
| `email`    | string   | Sí        | Email del usuario.                        |
| `password` | string   | Sí        | Contraseña (mínimo 8 caract.).            |
| `roles`    | string[] | No        | Array de roles (ej: `["admin", "user"]`). |
| `isActive` | boolean  | No        | Define si el usuario está activo.         |

- **Respuesta Exitosa (`201 Created`)**: Devuelve un `UserResponseDto`.

---

## **Stack**

Endpoints para gestionar áreas técnicas y tecnologías.

### **Áreas**

#### **Listar Áreas**
- **Endpoint**: `GET /stack/areas`
- **Autenticación**: Requerida.
- **Respuesta Exitosa (`200 OK`)**: Devuelve `AreaResponseDto[]`.

#### **Obtener Área por Slug**
- **Endpoint**: `GET /stack/areas/:slug`
- **Autenticación**: Requerida.
- **Respuesta Exitosa (`200 OK`)**: Devuelve un `AreaResponseDto`.

#### **Crear Área**
- **Endpoint**: `POST /stack/areas`
- **Autenticación**: Requerida.
- **Cuerpo de la Solicitud** (`application/json`):

| Campo      | Tipo   | Requerido | Descripción                      |
| :--------- | :----- | :-------- | :------------------------------- |
| `name`     | string | Sí        | Nombre del área (2-100 caract.). |
| `slug`     | string | Sí        | Slug en formato kebab-case.      |
| `iconCode` | string | No        | Código de ícono (1-50 caract.).  |

- **Respuesta Exitosa (`201 Created`)**: Devuelve un `AreaResponseDto`.

#### **Actualizar Área**
- **Endpoint**: `PATCH /stack/areas/:id`
- **Autenticación**: Requerida.
- **Cuerpo de la Solicitud**: `CreateAreaDto` parcial.
- **Respuesta Exitosa (`200 OK`)**: Devuelve el `AreaResponseDto` actualizado.

#### **Eliminar Área**
- **Endpoint**: `DELETE /stack/areas/:id`
- **Autenticación**: Requerida.
- **Respuesta Exitosa (`200 OK`)**: Devuelve `{ "success": true }`.

### **Tecnologías**

#### **Listar Tecnologías**
- **Endpoint**: `GET /stack/technologies`
- **Autenticación**: Requerida.
- **Respuesta Exitosa (`200 OK`)**: Devuelve `TechnologyResponseDto[]`.

#### **Obtener Tecnología por Slug**
- **Endpoint**: `GET /stack/technologies/:slug`
- **Autenticación**: Requerida.
- **Respuesta Exitosa (`200 OK`)**: Devuelve un `TechnologyResponseDto`.

#### **Crear Tecnología**
- **Endpoint**: `POST /stack/technologies`
- **Autenticación**: Requerida.
- **Cuerpo de la Solicitud** (`application/json`):

| Campo          | Tipo   | Requerido | Descripción                     |
| :------------- | :----- | :-------- | :------------------------------ |
| `areaId`       | uuid   | Sí        | ID del Área asociada.           |
| `name`         | string | Sí        | Nombre (2-100 caract.).         |
| `slug`         | string | Sí        | Slug en formato kebab-case.     |
| `websiteUrl`   | string | No        | URL válida.                     |
| `docsUrl`      | string | No        | URL válida.                     |
| `iconClass`    | string | No        | Clase CSS del ícono.            |
| `primaryColor` | string | No        | Color hexadecimal (ej: #FFFFFF).|

- **Respuesta Exitosa (`201 Created`)**: Devuelve un `TechnologyResponseDto`.

#### **Actualizar Tecnología**
- **Endpoint**: `PATCH /stack/technologies/:id`
- **Autenticación**: Requerida.
- **Cuerpo de la Solicitud**: `CreateTechnologyDto` parcial.
- **Respuesta Exitosa (`200 OK`)**: Devuelve el `TechnologyResponseDto` actualizado.

#### **Eliminar Tecnología**
- **Endpoint**: `DELETE /stack/technologies/:id`
- **Autenticación**: Requerida.
- **Respuesta Exitosa (`200 OK`)**: Devuelve `{ "success": true }`.

---

## **Proyectos (Showcases)**

Endpoints para gestionar el portafolio de proyectos.

### **Listar Proyectos**
- **Endpoint**: `GET /projects/showcases`
- **Autenticación**: Requerida.
- **Respuesta Exitosa (`200 OK`)**: Devuelve `ShowcaseResponseDto[]`.

### **Listar Proyectos Destacados**
- **Endpoint**: `GET /projects/showcases/featured`
- **Autenticación**: Requerida.
- **Respuesta Exitosa (`200 OK`)**: Devuelve `ShowcaseResponseDto[]`.

### **Obtener Proyecto por Slug**
- **Endpoint**: `GET /projects/showcases/:slug`
- **Autenticación**: Requerida.
- **Respuesta Exitosa (`200 OK`)**: Devuelve un `ShowcaseResponseDto` que incluye:
  - Datos básicos (id, title, slug, description, content, year, isFeatured).
  - `area`: Objeto con información del área (`id`, `name`, `slug`).
  - `technologies`: Array de tecnologías utilizadas.
  - `images`: Array de objetos con las imágenes asociadas:
    - `id`: ID del archivo.
    - `url`: URL pública del archivo.
    - `type`: Contexto/Tipo de imagen (ej: `cover`, `hero-slide`, `gallery`).
    - `order`: Orden de visualización.

### **Crear Proyecto**
- **Endpoint**: `POST /projects/showcases`
- **Autenticación**: Requerida.
- **Cuerpo de la Solicitud** (`application/json`):

| Campo           | Tipo     | Requerido | Descripción                             |
| :-------------- | :------- | :-------- | :-------------------------------------- |
| `title`         | string   | Sí        | Título del proyecto (2-150 caract.).    |
| `slug`          | string   | Sí        | Slug único en formato kebab-case.       |
| `description`   | string   | No        | Máx 1000 caract.                        |
| `content`       | object   | No        | Objeto de contenido de EditorJS.        |
| `repoUrl`       | string   | No        | URL válida.                             |
| `liveUrl`       | string   | No        | URL válida.                             |
| `areaId`        | uuid     | No        | ID del área (Stack Area).               |
| `year`          | number   | No        | Año (1900-2100).                        |
| `isFeatured`    | boolean  | No        | `false` por defecto.                    |
| `technologyIds` | uuid[]   | No        | Array de IDs de Tecnologías.            |

- **Respuesta Exitosa (`201 Created`)**: Devuelve un `ShowcaseResponseDto`.

### **Actualizar Proyecto**
- **Endpoint**: `PATCH /projects/showcases/:id`
- **Autenticación**: Requerida.
- **Cuerpo de la Solicitud**: `CreateShowcaseDto` parcial.
- **Respuesta Exitosa (`200 OK`)**: Devuelve el `ShowcaseResponseDto` actualizado.

### **Eliminar Proyecto**
- **Endpoint**: `DELETE /projects/showcases/:id`
- **Autenticación**: Requerida.
- **Respuesta Exitosa (`200 OK`)**: Devuelve `{ "success": true }`.

### **Gestión de Archivos de Proyecto**

#### **Adjuntar Archivo**
- **Endpoint**: `POST /projects/showcases/:id/files`
- **Autenticación**: Requerida.
- **Cuerpo** (`application/json`):
  - `fileId` (uuid): ID del archivo previamente subido.
  - `contextSlug` (string): Contexto (`cover`, `hero-slide`, `gallery`).
  - `order` (number, opcional): Posición en la lista.

#### **Desvincular Archivo**
- **Endpoint**: `DELETE /projects/showcases/:id/files/:fileId`
- **Autenticación**: Requerida.

#### **Reordenar Archivos**
- **Endpoint**: `PATCH /projects/showcases/:id/files/order`
- **Autenticación**: Requerida.
- **Cuerpo**: `{"items": [{"fileId": "uuid", "order": 1}, ...]}`

#### **Establecer Portada (Cover)**
- **Endpoint**: `PUT /projects/showcases/:id/cover/:fileId`
- **Autenticación**: Requerida.
- **Nota**: Al establecer una nueva portada, la anterior pasará automáticamente a ser de tipo `gallery`.

---

## **Blog**

Endpoints para gestionar las entradas del blog.

### **Listar Entradas**
- **Endpoint**: `GET /blog/entries`
- **Autenticación**: Requerida.
- **Respuesta Exitosa (`200 OK`)**: Devuelve `BlogEntryEntity[]`.

### **Obtener Entrada por ID**
- **Endpoint**: `GET /blog/entries/:id`
- **Autenticación**: Requerida.
- **Respuesta Exitosa (`200 OK`)**: Devuelve una `BlogEntryEntity`.

### **Obtener Entrada por Slug**
- **Endpoint**: `GET /blog/entries/slug/:slug`
- **Autenticación**: Requerida.
- **Respuesta Exitosa (`200 OK`)**: Devuelve una `BlogEntryEntity`.

### **Crear Entrada**
- **Endpoint**: `POST /blog/entries`
- **Autenticación**: Requerida.
- **Cuerpo de la Solicitud** (`application/json`):

| Campo         | Tipo     | Requerido | Descripción                          |
| :------------ | :------- | :-------- | :----------------------------------- |
| `title`       | string   | Sí        | Título (5-255 caract.).              |
| `slug`        | string   | Sí        | Slug en formato kebab-case.          |
| `description` | string   | No        | Máx 1000 caract.                     |
| `content`     | object   | No        | Objeto de contenido de EditorJS.     |
| `publishDate` | string   | No        | Fecha en formato ISO.                |

- **Respuesta Exitosa (`201 Created`)**: Devuelve una `BlogEntryEntity`.

### **Actualizar Entrada**
- **Endpoint**: `PATCH /blog/entries/:id`
- **Autenticación**: Requerida.
- **Cuerpo de la Solicitud**: `CreateBlogDto` parcial.
- **Respuesta Exitosa (`200 OK`)**: Devuelve la `BlogEntryEntity` actualizada.

### **Eliminar Entrada**
- **Endpoint**: `DELETE /blog/entries/:id`
- **Autenticación**: Requerida.
- **Respuesta Exitosa (`200 OK`)**: Devuelve `{ "success": true }`.

---

## **Archivos**

Endpoints para gestionar archivos.

### **Subir Archivo**
- **Endpoint**: `POST /files/upload`
- **Autenticación**: Requerida.
- **Solicitud**: `multipart/form-data`
    - `file`: El contenido del archivo (Máx 5MB).
- **Respuesta Exitosa (`201 Created`)**: Devuelve una `FileEntity` (id, url, etc.).

### **Obtener Información del Archivo**
- **Endpoint**: `GET /files/:id`
- **Autenticación**: Requerida.
- **Respuesta Exitosa (`200 OK`)**: Devuelve una `FileEntity`.

### **Eliminar Archivo**
- **Endpoint**: `DELETE /files/:id`
- **Autenticación**: Requerida.
- **Respuesta Exitosa (`200 OK`)**: Devuelve `{ "success": true }`.

---

## **Contacto**

### **Enviar Solicitud de Contacto**
- **Endpoint**: `POST /contact`
- **Autenticación**: No requerida (Público).
- **Cuerpo de la Solicitud** (`application/json`):

| Campo     | Tipo   | Requerido | Descripción           |
| :-------- | :----- | :-------- | :-------------------- |
| `name`    | string | Sí        | Máx 120 caract.       |
| `email`   | string | Sí        | Email válido.         |
| `message` | string | Sí        | Máx 4000 caract.      |

- **Respuesta Exitosa (`204 No Content`)**: No devuelve contenido.

---

## **Health Check**

### **Verificar Salud del Servicio**
- **Endpoint**: `GET /health`
- **Autenticación**: No requerida.
- **Respuesta Exitosa (`200 OK`)**: Devuelve un objeto de estado.

---

## **Métricas**

### **Métricas de Prometheus**
- **Endpoint**: `GET /api/metrics` (Nota: Sin prefijo de versión)
- **Autenticación**: No requerida.
- **Respuesta Exitosa (`200 OK`)**: Devuelve texto en formato Prometheus.