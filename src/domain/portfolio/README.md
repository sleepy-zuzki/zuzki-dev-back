# Domain · Portfolio

Responsabilidades:

- Definir contratos y tipos puros del dominio (sin dependencias de framework/ORM).
- Expresar relaciones de negocio a nivel conceptual.

Contratos:

- types/project.types.ts:
  - Project, CreateProjectInput, UpdateProjectInput
  - Project.technologies: TechnologyRef[]
  - Project.previewImage: FileRef | null
  - Semántica de orquestación (usada por application):
    - technologyIds: undefined (no-op), null/[] (limpiar), number[] (reemplazar)
    - previewImageId: undefined (no-op), null (limpiar), number (reemplazar)
- types/file.types.ts:
  - File, CreateFileInput, UpdateFileInput

Reglas:

- Mantener tipos canónicos aquí y reutilizarlos en application/mappers.
- No incluir DTOs HTTP ni validaciones de transporte aquí.
