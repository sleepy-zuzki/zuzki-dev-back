---
apply: always
---

# Convenciones de estructura y ubicaciones

Estos criterios complementan ai_agent_rules.md y estandarizan dónde vive cada cosa.

## HTTP (interfaces)

- Ruta: src/interfaces/http/v{n}/<feature>/
- Archivos:
  - <feature>.module.ts
  - <feature>.controller.ts
  - dto/ (Request/Response DTOs validados con class-validator)
- Prohibido: importar directamente desde infrastructure (usa application).

## Application

- Ruta: src/application/<feature>/
- Archivos:
  - services/ (orquestación de casos de uso)
  - mappers/ (transformar domain <-> dto/view models)
- Evita dependencias de Nest si es posible; inyecta interfaces/ports si se requieren adaptadores.

## Domain

- Ruta: src/domain/<feature>/
- Archivos:
  - types/ (tipos/contratos del dominio)
  - rules/ (reglas puras)
- Prohibido: dependencias de ORM/framework.

## Infrastructure

- Ruta: src/infrastructure/...
- TypeORM:
  - database/typeorm/entities/<feature>/
  - database/typeorm/migrations/
  - database/data-source.ts
- Otros: http-clients, logging, cache, storage, etc.

## Shared

- Ruta: src/shared/...
- Subcarpetas: types, utils, interceptors, guards, pipes, filters, decorators, constants
- Tipos transversales aquí. Tipos específicos del dominio se quedan en domain/<feature>/types.

## Versionado de API

- Ubicación: interfaces/http/v{n}
- Activar Versioning en main.ts (URL o Header). Evitar controladores fuera de interfaces/http/v{n}.

## Nombres y estilo

- Nombres descriptivos y consistentes: <feature>.controller.ts, <feature>.module.ts, _.entity.ts, _.types.ts
- Sin any; tipado estricto; sin console.log en producción (usar Logger/NestJS).
