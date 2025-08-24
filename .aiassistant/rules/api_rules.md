---
apply:
  paths:
    - 'src/**/*.controller.ts'
    - 'src/**/*.module.ts'
    - 'src/**/*.dto.ts'
    - 'src/**/*.pipe.ts'
    - 'src/**/*.filter.ts'
    - 'src/**/*.interceptor.ts'
---

# Reglas específicas para API (NestJS)

Ámbito: estas reglas se aplican cuando los cambios afectan controladores, módulos, DTOs, pipes, filtros o interceptores.

## Validación y DTOs

- Respetar el mecanismo de validación ya existente en el proyecto (pipes, DTOs, etc.).
- No introducir nuevas librerías de validación sin aprobación previa.
- Los DTOs deben reflejar exactamente el contrato público esperado y contener solo lo necesario.

## API y contratos

- No romper contratos públicos (nombres de rutas, DTOs, respuestas) sin aprobación y plan de migración.
- Mantener la compatibilidad hacia atrás cuando sea posible.
- Documentar cualquier cambio que afecte a clientes existentes.
