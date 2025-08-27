# Domain · Catalog

Responsabilidades:

- Definir contratos y tipos del dominio para Catálogo (Technology, Stack).
- Mantenerse libre de framework/ORM.

Contratos:

- types/technology.types.ts:
  - Technology, CreateTechnologyInput, UpdateTechnologyInput
- types/stack.types.ts:
  - Stack, CreateStackInput, UpdateStackInput

Notas:

- Los tipos de dominio son consumidos por application y mappers.
- DTOs de transporte y validaciones HTTP viven en interfaces/http/v1/<feature>/dto.
