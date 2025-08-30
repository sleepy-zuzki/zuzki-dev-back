# CONTRIBUTING

Gracias por contribuir. Este proyecto usa arquitectura hexagonal (ports & adapters) con límites reforzados por ESLint y CI.

## Requisitos

- Node 22.x y pnpm 9.x
- Scripts clave:
  - Lint: `pnpm lint` / autofix `pnpm lint:fix`
  - Typecheck: `pnpm typecheck`
  - Tests: `pnpm test`, cobertura `pnpm test:cov`
- Hooks:
  - pre-commit: `lint-staged` (formato + eslint en staged)
  - pre-push: `lint:ci` + `typecheck`

## Flujo de contribución

1. Crea una rama desde `develop` o `main`:
   - Feature: `feature/<breve-descripcion>`
   - Fix: `fix/<breve-descripcion>`
2. Asegura calidad local: `pnpm typecheck && pnpm lint:fix && pnpm test`
3. Abre PR con contexto y checklist completado (ver `docs/PR_CHECKLIST.md`)

## Mapa de capas (hexagonal)

- Interfaces (HTTP): controladores, DTOs, mapeo de errores.
- Application: casos de uso (services), ports (contratos), tokens, mappers.
- Domain: tipos y reglas puras (sin framework/ORM).
- Infrastructure: adaptadores concretos (ORM, JWT, HTTP, storage, etc.).
- Composition: módulos por feature que conectan infra ↔ application.
- Shared: utilidades y tipos transversales.

Principio: dependencias siempre hacia adentro (Interfaces → Composition → Application → Domain). Domain no depende de ninguna otra capa ni frameworks.

## Alias (paths) y su capa

- `@interfaces/*`, `@application/*`, `@domain/*`, `@infra/*`, `@shared/*`
- `@config/*`, `@metrics/*`, `@health/*` (cross-cutting/infra/configuración)
- `@app/*` (alias raíz; no usar para saltarse límites)

Consulta `tsconfig.json` para el detalle.

## Límites reforzados por ESLint (resumen)

- Interfaces:
  - No importar Infrastructure ni ORM directamente.
  - Manejo estricto de promesas (no-floating-promises: error).
- Application:
  - No depender de Interfaces/Infrastructure ni de frameworks (Nest/ORM).
  - Retornos explícitos en funciones públicas.
  - Promesas flotantes: error.
- Domain:
  - Puro: sin Nest, sin ORM, sin decoradores.
  - Retornos explícitos en funciones públicas.
- Infrastructure:
  - No depender de Interfaces.
- Shared:
  - No depender de capas superiores (Application/Interfaces/Infrastructure).
- Composition root (entrypoints):
  - Excepción documentada para orquestar capas (override de ESLint).
- Tests:
  - Reglas relajadas (no-console permitido, sin exigencia de tipos de retorno).

Los alias anteriores (y rutas `src/**`) están cubiertos por `no-restricted-imports` para evitar fugas entre capas.

## Convenciones de imports

- `eslint-plugin-import` habilitado:
  - Orden: builtin, external, internal (alias), parent, sibling, index, object, type.
  - Línea en blanco tras imports y sin duplicados.
  - Resolvers de TS/Node respetan alias y extensiones.

## PR Checklist (resumen)

- Lint/format ok, typecheck ok, tests ok.
- Sin violaciones de arquitectura (no-restricted-imports).
- Imports ordenados y sin duplicados.
- Documentación actualizada si cambian contratos o wiring.

## Documentación

- Arquitectura: `docs/ARCHITECTURE.md`
- Guía del desarrollador: `docs/DEVELOPER_GUIDE.md`
- Checklist de PR: `docs/PR_CHECKLIST.md`
