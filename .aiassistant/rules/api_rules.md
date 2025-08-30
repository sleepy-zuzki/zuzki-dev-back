---
---

# Reglas específicas para API (NestJS)

Ámbito: estas reglas se aplican cuando los cambios afectan controladores, módulos, DTOs, pipes, filtros o interceptores.

## Arquitectura y ubicaciones (alineado con arquitectura hexagonal)

- Los controladores y módulos HTTP deben residir bajo: `src/interfaces/http/v{n}/<feature>/`.
- Está prohibido importar directamente desde `infrastructure` en controladores/módulos de Interfaces; solo dependencias de `application` y `shared`.
- Los módulos HTTP registran controladores y providers que sean adaptadores a `application` (p. ej., servicios de casos de uso).
- Evitar lógica de negocio en controladores/interceptores/guards; delegar a casos de uso en `application`.

## Versionado

- Todo controlador debe declarar versión explícita (`version: '1'` u otra vigente).
- Los endpoints deben colgar del prefijo de versión `/v{n}` según la configuración del proyecto.
- Para cambios incompatibles, crear una nueva versión y mantener compatibilidad hasta plan de deprecación.

## Validación y DTOs

- Respetar el mecanismo de validación ya existente (class-validator / class-transformer).
- Los DTOs viven en `src/interfaces/http/v{n}/<feature>/dto/`.
- Los DTOs reflejan el contrato público y no deben incluir detalles internos de dominio o persistencia.

## Contratos y respuestas

- No romper contratos públicos (rutas, DTOs, códigos/formatos de respuesta) sin aprobación y plan de migración.
- Mantener compatibilidad hacia atrás cuando sea posible.
- Documentar los cambios que afecten a clientes y comunicar deprecaciones.

## Seguridad y transversales

- Respetar guards e interceptores globales configurados; usar decoradores públicos/roles definidos por el proyecto.
- No exponer datos sensibles en respuestas; sanitizar y validar entradas.
- Manejar errores con excepciones de `@nestjs/common` apropiadas y mapearlas a códigos HTTP coherentes.

## Observabilidad

- Usar el logger del proyecto en lugar de `console.log`.
- Mantener métricas y traces conforme a los utilitarios compartidos del repositorio cuando aplique.
