# Reglas del API (v1)

Ámbito:
- Estas reglas aplican exclusivamente al desarrollo y mantenimiento del API HTTP (controladores NestJS y servicios invocados por dichos controladores).
- No aplican a scripts/CLI, jobs/cron, workers de colas, migraciones de base de datos ni a módulos internos que no expongan rutas HTTP directamente.

- Versionado: todos los controladores se anotan con `version: '1'` y exponen rutas bajo `/v1`.
- Convención de rutas:
  - Catálogo: `/v1/catalog/stacks`, `/v1/catalog/technologies`.
  - Portafolio: `/v1/portfolio/projects`, `/v1/portfolio/files`.
- Estructura de carpetas por módulo:
  - `controllers/`: colocar exclusivamente controladores (p. ej., `projects.controller.ts`, `stacks.controller.ts`).
  - `services/`: colocar exclusivamente servicios (p. ej., `projects.service.ts`, `stacks.service.ts`).
  - El módulo (`*.module.t![img.png](img.png)s`) importa los servicios desde `services/` y registra los controladores desde `controllers/`.
- Respuestas y errores:
  - 404 Not Found cuando un recurso no existe (usando `NotFoundException`).
  - Listados ordenados por campos relevantes (p. ej. `name ASC`, `createdAt DESC`), salvo que se defina paginación.
- Entidades y relaciones:
  - Seleccionar relaciones necesarias explícitamente en servicios (p. ej., `projects` incluye `technologies` y `previewImage`).
