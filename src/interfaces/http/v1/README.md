# interfaces/http/v1

# Interfaces HTTP · v1

Convenciones:

- Ubicación: src/interfaces/http/v1/<feature>/
- Archivos por feature: <feature>.module.ts, controllers/_.controller.ts, dto/_.dto.ts
- Validación: DTOs de request con class-validator.
- Prohibido: importar directamente infraestructura. Siempre usar servicios de application vía providers/tokens.

Estructura por feature:

- users: controlador y DTOs; delega en application/users/services.
- auth: controlador; delega en application/auth/services y puertos de hashing/tokens.
- catalog: controllers para technologies/stacks; DTOs; delega en application/catalog/services.
- portfolio: controllers para projects/files; DTOs; delega en application/portfolio/services.

Versionado:

- Controladores anotados con version: '1'. Asegurar versionado activo en el bootstrap (URL o Header).

Wiring:

- Cada módulo HTTP importa los módulos de infraestructura necesarios (que exponen puertos) y registra providers de servicios de application con factories que inyectan dichos puertos.
  Aquí viven los módulos y controladores HTTP de la versión v1 del API.

- Un feature por carpeta: auth, users, catalog, portfolio, etc.
- Coloca DTOs bajo dto/.
- Los controladores dependen de servicios en application/<feature>.
