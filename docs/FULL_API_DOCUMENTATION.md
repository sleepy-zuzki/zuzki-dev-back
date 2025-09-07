# **Zuzki Dev API Documentation**

This document provides a complete reference for all available endpoints in the Zuzki Dev API.

**Base URL**: `{{baseUrl}}`
**API Version**: `v1`

---

## **Authentication**

Most endpoints require a Bearer Token for authentication. The token should be included in the `Authorization` header.

`Authorization: Bearer {{accessToken}}`

The collection includes a pre-request script to automatically handle login and token renewal.

---

## **Health Check**

Endpoints for monitoring the application's health.

### **Check Service Health**

Verifies the status of the application and its database connection.

- **Endpoint**: `GET /health`
- **Authentication**: Not required.
- **Success Response (`200 OK`)**: Returns a status object detailing the health of various application components.

---

## **Authentication**

Endpoints for user login, logout, and token management.

### **User Login**

- **Endpoint**: `POST /auth/login`
- **Authentication**: Not required.
- **Request Body** (`application/json`):

| Campo      | Tipo   | Requerido | Descripción             |
| :--------- | :----- | :-------- | :---------------------- |
| `email`    | string | Sí        | Email del usuario.      |
| `password` | string | Sí        | Contraseña del usuario. |

- **Success Response (`200 OK`)**: Returns a `LoginResponse` object containing access and refresh tokens, and user information.

### **Refresh Access Token**

- **Endpoint**: `POST /auth/refresh`
- **Authentication**: Not required.
- **Request Body** (`application/json`):

| Campo          | Tipo   | Requerido | Descripción                          |
| :------------- | :----- | :-------- | :----------------------------------- |
| `userId`       | string | Sí        | ID del usuario.                      |
| `refreshToken` | string | Sí        | El refresh token válido del usuario. |

- **Success Response (`200 OK`)**: Returns a new `LoginResponse` object.

### **User Logout**

Revokes a user's refresh token.

- **Endpoint**: `POST /auth/logout`
- **Authentication**: Required.
- **Request Body** (`application/json`):

| Campo          | Tipo   | Requerido | Descripción                 |
| :------------- | :----- | :-------- | :-------------------------- |
| `userId`       | string | Sí        | ID del usuario.             |
| `refreshToken` | string | Sí        | El refresh token a revocar. |

- **Success Response (`200 OK`)**: Returns `{ "success": true }`.

---

## **Users**

User management endpoints.

### **Get User by ID**

- **Endpoint**: `GET /users/:id`
- **Authentication**: Required.
- **URL Parameters**:
  - `id` (string, required): The ID of the user to retrieve.
- **Success Response (`200 OK`)**: Returns a `UserResponseDto` object.

### **Create User**

- **Endpoint**: `POST /users`
- **Authentication**: Required.
- **Request Body** (`application/json`):

| Campo      | Tipo     | Requerido | Descripción                                 |
| :--------- | :------- | :-------- | :------------------------------------------ |
| `email`    | string   | Sí        | Email del nuevo usuario.                    |
| `password` | string   | Sí        | Contraseña (mínimo 8 caracteres).           |
| `roles`    | string[] | No        | Array de roles (e.g., `["admin", "user"]`). |
| `isActive` | boolean  | No        | Define si el usuario está activo.           |

- **Success Response (`201 Created`)**: Returns the newly created `UserResponseDto` object.

---

## **Portfolio: Projects**

Endpoints for managing the projects portfolio.

### **List Projects**

- **Endpoint**: `GET /portfolio/projects`
- **Authentication**: Required.
- **Success Response (`200 OK`)**: Returns an array of `ProjectResponseDto` objects.

### **Get Project by Slug**

- **Endpoint**: `GET /portfolio/projects/:slug`
- **Authentication**: Required.
- **URL Parameters**:
  - `slug` (string, required): The unique slug of the project.
- **Success Response (`200 OK`)**: Returns a single `ProjectResponseDto` object, now including `carouselImages`.

### **Create Project**

- **Endpoint**: `POST /portfolio/projects`
- **Authentication**: Required.
- **Request Body** (`application/json`): See `CreateProjectDto` for all optional and required fields (name, slug, description, etc.).
- **Success Response (`201 Created`)**: Returns the newly created `ProjectResponseDto`.

### **Update Project**

- **Endpoint**: `PATCH /portfolio/projects/:id`
- **Authentication**: Required.
- **URL Parameters**:
  - `id` (integer, required): The ID of the project to update.
- **Request Body** (`application/json`): See `UpdateProjectDto` for all available fields. All fields are optional.
- **Success Response (`200 OK`)**: Returns the updated `ProjectResponseDto`.

### **Delete Project**

- **Endpoint**: `DELETE /portfolio/projects/:id`
- **Authentication**: Required.
- **URL Parameters**:
  - `id` (integer, required): The ID of the project to delete.
- **Success Response (`200 OK`)**: Returns `{ "success": true }`.

### **Add Image to Carousel**

- **Endpoint**: `POST /portfolio/projects/:id/images`
- **Authentication**: Required.
- **URL Parameters**:
  - `id` (integer, required): The ID of the project.
- **Request Body** (`application/json`):

| Campo      | Tipo    | Requerido | Descripción                            |
| :--------- | :------ | :-------- | :------------------------------------- |
| `fileId`   | integer | Sí        | ID del archivo a añadir al carrusel.   |
| `position` | integer | No        | Posición en el carrusel. Default: `0`. |

- **Success Response (`204 No Content`)**.

### **Remove Image from Carousel**

- **Endpoint**: `DELETE /portfolio/projects/:id/images/:fileId`
- **Authentication**: Required.
- **URL Parameters**:
  - `id` (integer, required): The ID of the project.
  - `fileId` (integer, required): The ID of the file to remove.
- **Success Response (`204 No Content`)**.

### **Reorder Carousel Images**

- **Endpoint**: `PATCH /portfolio/projects/:id/images`
- **Authentication**: Required.
- **URL Parameters**:
  - `id` (integer, required): The ID of the project.
- **Request Body** (`application/json`): An object with an `images` key, which is an array of `{ fileId, position }` objects.
- **Success Response (`204 No Content`)**.

---

## **Portfolio: Files**

Endpoints for managing files.

### **List Files**

- **Endpoint**: `GET /portfolio/files`
- **Authentication**: Required.
- **Success Response (`200 OK`)**: Returns an array of `FileResponseDto` objects.

### **Get File by ID**

- **Endpoint**: `GET /portfolio/files/:id`
- **Authentication**: Required.
- **URL Parameters**:
  - `id` (integer, required): The ID of the file.
- **Success Response (`200 OK`)**: Returns a single `FileResponseDto` object.

### **Upload File**

- **Endpoint**: `POST /portfolio/files`
- **Authentication**: Required.
- **Request Body** (`multipart/form-data`):

| Campo       | Tipo   | Requerido | Descripción                                  |
| :---------- | :----- | :-------- | :------------------------------------------- |
| `file`      | File   | Sí        | El archivo a subir.                          |
| `projectId` | string | No        | ID del proyecto al que se asocia el archivo. |

- **Success Response (`201 Created`)**: Returns the created `FileResponseDto`.

### **Update File**

- **Endpoint**: `PATCH /portfolio/files/:id`
- **Authentication**: Required.
- **URL Parameters**:
  - `id` (integer, required): The ID of the file to update.
- **Request Body** (`application/json`): See `UpdateFileDto`. All fields are optional.
- **Success Response (`200 OK`)**: Returns the updated `FileResponseDto`.

### **Delete File**

- **Endpoint**: `DELETE /portfolio/files/:id`
- **Authentication**: Required.
- **URL Parameters**:
  - `id` (integer, required): The ID of the file to delete.
- **Success Response (`200 OK`)**: Returns `{ "success": true }`.

---

## **Catalog**

Endpoints for managing catalog entities like Technologies and Stacks.

### **Technologies**

- `GET /catalog/technologies`: Lists all technologies.
- `GET /catalog/technologies/:slug`: Gets a single technology by slug.
- `POST /catalog/technologies`: Creates a new technology.
- `PATCH /catalog/technologies/:id`: Updates a technology.
- `DELETE /catalog/technologies/:id`: Deletes a technology.

### **Stacks**

- `GET /catalog/stacks`: Lists all stacks.
- `GET /catalog/stacks/:slug`: Gets a single stack by slug.
- `POST /catalog/stacks`: Creates a new stack.
- `PATCH /catalog/stacks/:id`: Updates a stack.
- `DELETE /catalog/stacks/:id`: Deletes a stack.
