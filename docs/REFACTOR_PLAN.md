# Plan de Refactor de Estructura (por fases)

Objetivo: unificar la organización por features y capas, reducir deuda técnica y mejorar mantenibilidad sin interrumpir el delivery.

## Fase 0 — Preparación (sin romper nada)

- Añadir alias de paths en `tsconfig.json` (`@modules/*`, `@infra/*`, `@domain/*`, `@common/*`, `@config/*`, `@shared/*`).
- Actualizar imports paulatinamente a alias (no mover archivos aún).
- Añadir lint rules para import order si aplica.

Verificación:

- Compila y corre tests.
- No hay imports relativos largos como `../../../../`.

## Fase 1 — Infraestructura de base de datos

- Mover `data-source.ts` a `src/infra/database/data-source.ts`.
- Unificar todo lo relacionado a DB en `src/infra/database/`:
  - `entities/` (por feature),
  - `migrations/`,
  - `seeds/`,
  - `repositories/` (implementaciones TypeORM).
- Ajustar imports y configuración TypeORM/Nest para el nuevo path.

Riesgos:

- Paths de migraciones/CLI. Mitigar probando migraciones en local/CI.

## Fase 2 — Health y Métricas

- Crear `src/modules/health/` y mover `health.controller.ts` dentro.
- Crear/ajustar `src/modules/metrics/` para exponer endpoint de Prometheus.
- Registrar ambos módulos en `app.module.ts`.

Verificación:

- Endpoints de health y metrics siguen respondiendo.

## Fase 3 — Unificar features en `src/modules`

- Mover `src/auth/` a `src/modules/auth/`.
- Mover `src/users/` a `src/modules/users/`.
- Mover `src/metrics/` a `src/modules/metrics/` si aún no está.
- Actualizar referencias en `app.module.ts` y demás imports.

Riesgos:

- Imports rotos. Mitigar con búsqueda/replace asistido y CI.

## Fase 4 — Separar dominio de infraestructura

- Crear `src/domain/` para modelos y tipos de negocio (p. ej., `project.types.ts`, `stack.types.ts`).
- Mantener entidades TypeORM en `src/infra/database/entities/`.
- Introducir mapeadores en cada feature: `modules/<feature>/mappers/*`.
- Definir interfaces de repositorio en `src/domain/<feature>/repositories/` y mover implementaciones a `infra/database/repositories/<feature>/`.

Verificación:

- Tests unitarios a nivel de servicio usando mocks de repositorios (interfaces de dominio).

## Fase 5 — Extraer `common` y limpiar `core`

- Crear `src/common/` para guards/decorators/pipes/interceptors/filters compartidos.
- Migrar elementos genéricos de `src/auth/*/guards` si son verdaderamente cross-cutting.
- Vaciar progresivamente `src/core/` y eliminarlo cuando no quede contenido; distribuir:
  - `core/database` -> `infra/database`
  - `core/models` -> `domain/*` (y/o `shared/*` si aplica)
  - `core/schemas` -> `domain/*` o `common/dto` según uso

## Fase 6 — Testing y docs

- Elegir estrategia de ubicación de tests (global vs cercanos al feature) y estandarizar.
- Añadir documentación de endpoints en `openapi/` con script de generación.
- Actualizar `README` con nuevas rutas y estructura.

## Guía de verificación continua

- Pipeline CI: `pnpm lint && pnpm test && pnpm build`.
- Pruebas e2e tras mover módulos clave (auth/users).
- Revisión de imports: no deben quedar rutas rotas ni alias faltantes.

## Plan de reversión

- Cada fase debe ir en su PR independiente.
- Si algo falla, revertir la fase completa (un solo commit/PR) sin mezclar con otras.
- Mantener ramas de respaldo durante el refactor.

## Tiempos estimados

- Fase 0–1: 0.5–1 día
- Fase 2–3: 1–2 días
- Fase 4–5: 2–3 días (según superficie)
- Fase 6: 0.5–1 día
