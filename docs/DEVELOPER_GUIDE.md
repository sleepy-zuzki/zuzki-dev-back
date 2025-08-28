# Guía del Desarrollador

Este documento te guía para implementar cambios sin romper la convención de arquitectura hexagonal del proyecto.

## Estructura de carpetas (resumen operativo)

- interfaces/http/v{n}/<feature>/
  - Controladores + DTOs + validación (class-validator).
  - No importar infraestructura aquí.
- application/<feature>/
  - services/: casos de uso (pura lógica de aplicación).
  - ports/: contratos (ports) + tokens (constantes para DI).
  - mappers/: conversión domain ↔ view/dto.
- domain/<feature>/
  - types/: tipos/contratos de dominio (sin framework).
  - rules/: reglas de dominio puras (si aplica).
- infrastructure/...
  - Implementaciones concretas (ORM, hashing, jwt, etc.).
  - Modules por feature que proveen tokens.
- infrastructure/composition/
  - Módulos por feature que conectan infrastructure ↔ application y exportan services.
- shared/...
  - Utilidades y tipos transversales.

## Flujo de trabajo por capas (mental model)

1. Application define QUÉ necesita (Ports) y CÓMO orquesta (Services).
2. Infrastructure implementa los Ports.
3. Composition “enchufa” infraestructura a los services, creando providers listos.
4. Interfaces usa los services expuestos por composition y mapea errores a HTTP.

## Recetas de cambios comunes

### 1) Añadir un nuevo endpoint HTTP en v1

- Crear DTOs en interfaces/http/v1/<feature>/dto con class-validator.
- Crear/actualizar el controlador en interfaces/http/v1/<feature>/<feature>.controller.ts.
- Inyectar el Service de application (que llega vía Composition).
- Manejar errores con excepciones de @nestjs/common (BadRequestException, NotFoundException, etc.).
- No importar módulos de infraestructura en interfaces.

Checklist:

- [ ] DTOs validados
- [ ] Controlador inyecta Service (no adapters)
- [ ] Mapeo de errores de dominio a HTTP

### 2) Añadir un nuevo caso de uso (Service)

- Definir/actualizar métodos en application/<feature>/services/<service>.ts.
- Si necesita capacidades externas: definir o ampliar un Port en application/<feature>/ports y su Token.
- Asegurar que los métodos no dependan de framework ni modelos de ORM.

Checklist:

- [ ] Lógica pura en Service
- [ ] Ports/Tokens definidos si necesitas infraestructura
- [ ] Tests unitarios del Service con mocks de Ports

### 3) Añadir un nuevo adaptador de infraestructura (DB/HTTP/JWT/Cache)

- Implementar el Port en infrastructure/…/adapters/<feature>/…adapter.ts.
- Exponer un módulo de infraestructura que provea el TOKEN del Port.
- No exportar clases específicas del ORM a application/domain.

Checklist:

- [ ] Adapter implementa el Port sin filtrar tipos del ORM
- [ ] Módulo de infraestructura hace provide: TOKEN y lo exporta

### 4) Cablear (wiring) en Composition

- Crear/actualizar infrastructure/composition/<feature>.composition.module.ts.
- Importar los módulos de infraestructura necesarios.
- Proveer el Service de application vía useFactory inyectando los Tokens.
- Exportar el Service para que interfaces lo use.

Checklist:

- [ ] Imports solo de infraestructura + application
- [ ] useFactory inyecta los Tokens correctos
- [ ] Exporta el Service

### 5) Tests

- Application: pruebas unitarias de Services con mocks de Ports.
- Interfaces: pruebas unitarias de controladores con Service mockeado y validación de DTOs.
- Integración: focalizadas para adaptadores críticos (repositorios, JWT, etc.).

Comandos:

- Unit: pnpm test
- Cobertura: pnpm test:cov

## Buenas prácticas clave

- No importar infraestructura desde interfaces (HTTP).
- Application sin dependencias de Nest/ORM; usa solo Ports y Tipos.
- Tokens de DI (constantes string/symbol) van junto a los Ports.
- Usar Logger de NestJS/nestjs-pino, no console.log en producción.
- Versionado de API habilitado y ValidationPipe global en main.

## Pitfalls (y cómo evitarlos)

- Fuga de modelos de ORM a application/domain → conviértelos en adapters/mappers en infraestructura.
- Providers duplicados de un mismo Service → centraliza la factory en Composition.
- Tokens no resueltos (Unknown provider) → verifica que el módulo de composición importe el módulo de infraestructura que exporta ese TOKEN y que AppModule lo registre si es raíz.
- Dependencias cíclicas → mantené application → ports → infrastructure → composition → interfaces como flujo y evita imports cruzados.

## Cómo cambiar de ORM (estrategia)

- Mantén estable el Port (p. ej., UsersRepositoryPort).
- Crea un nuevo adapter que implemente ese Port usando el nuevo ORM.
- Crea un módulo de infra que provea el TOKEN con ese adapter.
- Ajusta el módulo de composición (o crea una variante) para usar el nuevo módulo.
- No toques Services de application ni controladores.

## Checklist rápido antes de abrir PR

- [ ] Lint y formato OK (pnpm lint)
- [ ] Compila y arranca (pnpm build / pnpm start:dev)
- [ ] Tests relevantes añadidos/actualizados y en verde
- [ ] Interfaces no importan infraestructura
- [ ] Documentación actualizada si cambió el wiring o los Ports

Para más detalles de arquitectura, consulta docs/ARCHITECTURE.md y la checklist docs/PR_CHECKLIST.md.
