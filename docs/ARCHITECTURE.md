# Arquitectura y organización de carpetas

# Arquitectura y organización de carpetas

Objetivo: mantener un proyecto NestJS escalable y mantenible separando responsabilidades por capas y dominios.

## Capas

- interfaces: adaptadores (HTTP/controllers/dto) y versionado de API.
- application: orquestación de casos de uso (sin framework) y mapeos.
- domain: tipos/modelos/reglas puras del negocio (sin framework).
- infrastructure: detalles técnicos (ORM/entities, migrations, clientes externos, cache, logging).
- shared: utilidades, tipos y cross-cutting (guards, interceptors, pipes, filtros, decoradores, constantes).

## Estructura objetivo (resumen)

src/
app.module.ts
main.ts
config/
interfaces/
http/
v1/
<feature>/
<feature>.module.ts
<feature>.controller.ts
dto/
common/
application/
<feature>/
services/
mappers/
domain/
<feature>/
types/
rules/
infrastructure/
database/
typeorm/
entities/
<feature>/
migrations/
data-source.ts
logging/
http-clients/
cache/
shared/
types/
utils/
interceptors/
guards/
pipes/
filters/
decorators/
constants/
health/
metrics/

## Principios clave

- DTOs en interfaces/http/v{n}/<feature>/dto.
- Tipos de dominio en domain/<feature>/types; si son transversales, shared/types.
- Entities de TypeORM en infrastructure/database/typeorm/entities (no en domain).
- Controladores no acceden directo a infrastructure: usan application services.
- Versionado de API por URL o header activado en main.ts.

## Plan de migración incremental

Fase 1 (este commit):

- Crear estructura objetivo y documentación.
- Añadir mapa de refactor.

Fase 2:

- Mover controladores y módulos HTTP a interfaces/http/v1/<feature>.
- Ajustar imports y rutas.

Fase 3:

- Mover entities y migrations a infrastructure/database/typeorm/\*.
- Mover data-source.ts a infrastructure/database/data-source.ts.
- Actualizar scripts y referencias.

Fase 4:

- Crear servicios de application y mover lógica fuera de controladores.
- Consolidar tipos en domain/shared según corresponda.

Fase 5:

- Centralizar cross-cutting en shared.
- Limpiar carpetas obsoletas y actualizar aliases de TS si existen.

## Checklist

- Compila y lint en verde
- Tests ajustados
- Scripts de migración apuntan a nuevas rutas
- Sin nuevas dependencias
- Sin secretos en código

Consulta .aiassistant/rules/conventions.md para reglas y ubicaciones exactas.
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
