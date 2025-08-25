# Arquitectura y organización de carpetas

Este proyecto usa NestJS y TypeScript. A continuación se presenta:

- Un diagnóstico de la estructura actual.
- Una estructura propuesta por módulos (feature-first) y capas.
- Convenciones de nombres y alias de importación.
- Recomendaciones para pruebas, migraciones y documentación.

## Diagnóstico actual (resumen)

Estructura relevante:

- `src/`
  - `auth/`, `users/`, `metrics/` (features en la raíz)
  - `modules/` (otra carpeta para features)
  - `core/` con `database/` y `models/`
  - `config/`, `app.module.ts`, `main.ts`
  - `health.controller.ts` (suelto en raíz de `src/`)
- `data-source.ts` en la raíz del repo
- `openapi/`, `docs/`, `tools/`, `test/`

Observaciones:

1. Duplicidad/ambigüedad para features: parte en `src/` y parte en `src/modules/`.
2. Mezcla de responsabilidades en `core/`: contiene `database` (infraestructura) y `models` (dominio).
3. Posible duplicación conceptual entre `src/database` y `src/core/database`.
4. Archivos sueltos (p. ej. `health.controller.ts`) sin módulo propio.
5. Modelos de dominio y entidades de TypeORM coexisten sin una capa clara de mapeo.

## Estructura propuesta

Proponemos una estructura por módulos (feature-first) y capas, con carpetas bien definidas:
