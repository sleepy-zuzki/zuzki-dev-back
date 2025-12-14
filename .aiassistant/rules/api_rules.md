---
apply: always
---

# Reglas específicas para API (NestJS)

Ámbito: estas reglas se aplican cuando los cambios afectan controladores, módulos, DTOs, pipes, filtros o interceptores.

## Arquitectura y Ubicaciones (Alineado con Vertical Slicing)

- Los controladores, servicios, entidades y DTOs relacionados con una funcionalidad deben residir en `src/features/<feature_name>/`.
- Todo el código transversal (guards, interceptores, pipes, filtros, decoradores, tipos, utilidades) debe residir en `src/shared/`.
- Los módulos de `Feature` deben registrar sus propios controladores y servicios.
- Evitar la lógica de negocio compleja en controladores. La lógica principal debe residir en los servicios de la feature.

## Versionado

- Los controladores deben declarar la versión explícita (`version: '1'` u otra vigente).
- Los endpoints deben colgar del prefijo de versión `/v{n}` según la configuración del proyecto.
- Para cambios incompatibles, crear una nueva versión y mantener compatibilidad hasta un plan de deprecación.

## Validación y DTOs

- Respetar el mecanismo de validación ya existente (class-validator / class-transformer).
- Los DTOs viven en `src/features/<feature_name>/dto/`.
- Los DTOs reflejan el contrato público y no deben incluir detalles internos de dominio o persistencia.

## Contratos y Respuestas

- No romper contratos públicos (rutas, DTOs, códigos/formatos de respuesta) sin aprobación y plan de migración.
- Mantener compatibilidad hacia atrás cuando sea posible.
- Documentar los cambios que afecten a clientes y comunicar deprecaciones.

## Seguridad y Transversales

- Respetar guards e interceptores globales configurados; usar decoradores públicos/roles definidos por el proyecto.
- No exponer datos sensibles en respuestas; sanitizar y validar entradas.
- Manejar errores con excepciones de `@nestjs/common` apropiadas y mapearlas a códigos HTTP coherentes.

## Observabilidad

- Usar el logger del proyecto en lugar de `console.log`.
- Mantener métricas y traces conforme a los utilitarios compartidos del repositorio cuando aplique.
