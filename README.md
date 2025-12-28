# Zuzki Dev Back

Backend de la plataforma **Zuzki Dev**, construido con **NestJS** y siguiendo una arquitectura de **Vertical Slicing**.

Este proyecto prioriza la modularidad por funcionalidad (features) sobre las capas técnicas, facilitando la escalabilidad y el mantenimiento en un entorno de desarrollo ágil.

## 🚀 Stack Tecnológico

- **Framework:** [NestJS](https://nestjs.com/) v11
- **Lenguaje:** TypeScript
- **Base de Datos:** PostgreSQL
- **ORM:** [TypeORM](https://typeorm.io/)
- **Package Manager:** pnpm
- **Documentación API:** OpenAPI (Swagger)
- **Logging:** Pino

## 🏗 Arquitectura

El proyecto sigue estrictamente el patrón de **Vertical Slicing**.

- **Features (`src/features/`)**: Cada funcionalidad (Auth, Blog, Projects, etc.) es autocontenida y posee sus propios controladores, servicios, entidades y DTOs.
- **Shared (`src/shared/`)**: Código transversal reutilizable (Database, Config, Utils). **Nunca** depende de una feature.
- **V1Module**: Agrupador de módulos para la versión 1 de la API.

Para más detalles, consulta:
- 📐 [Arquitectura y Principios](./docs/ARCHITECTURE.md)
- 👩‍💻 [Guía del Desarrollador](./docs/DEVELOPER_GUIDE.md)

## 🛠️ Configuración y Ejecución

### Prerrequisitos

- Node.js (v20+)
- pnpm (`npm install -g pnpm`)
- PostgreSQL

### Instalación

```bash
# Instalar dependencias
pnpm install
```

### Variables de Entorno

Copia el archivo de ejemplo y configura tus variables:

```bash
cp .env.example .env
```

### Ejecución

```bash
# Desarrollo (Watch mode)
pnpm run start:dev

# Producción
pnpm run start:prod
```

## 🧪 Calidad y Testing

Mantenemos altos estándares de calidad mediante linting estricto y pruebas automatizadas.

```bash
# Unit Tests
pnpm run test

# E2E Tests
pnpm run test:e2e

# Coverage
pnpm run test:cov

# Linting & Formatting
pnpm run lint
pnpm run format
```

## 🗄️ Base de Datos y Migraciones

Utilizamos TypeORM para la gestión de esquemas.

```bash
# Ejecutar migraciones pendientes
pnpm run migration:run

# Generar una nueva migración (basada en cambios de entidades)
pnpm run migration:generate --name=NombreDelCambio

# Crear una migración vacía
pnpm run migration:create --name=NombreDelScript

# Revertir última migración
pnpm run migration:revert
```

## 📚 Documentación

Toda la documentación detallada se encuentra en el directorio `docs/`:

- [API Reference (Endpoints)](./docs/FULL_API_DOCUMENTATION.md)
- [Esquema de Base de Datos](./docs/schema.dbml)
- [Checklist de Pull Requests](./docs/PR_CHECKLIST.md)
- [Colección de Postman](./docs/postman_collection.json)

## 📂 Estructura del Proyecto

```
src/
├── config/                 # Configuración centralizada
├── features/               # Vertical Slices (Lógica de negocio)
│   ├── auth/
│   ├── blog/
│   ├── projects/
│   └── ...
├── metrics/                # Monitorización
├── shared/                 # Código transversal (DB, Utils, Security)
├── app.module.ts           # Módulo raíz
├── v1.module.ts            # Módulo de versión 1
└── main.ts                 # Entry point
```

## 🤝 Contribución

Por favor, revisa [CONTRIBUTING.md](./CONTRIBUTING.md) antes de enviar un Pull Request.

---
**Zuzki Dev Team**