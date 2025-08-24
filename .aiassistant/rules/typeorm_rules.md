---
apply:
  paths:
    - "src/**/*.entity.ts"
    - "src/**/entities/**/*"
    - "src/**/repositories/**/*"
    - "src/**/database/**/*"
    - "src/**/typeorm/**/*"
    - "src/**/migrations/**/*"
---

# Reglas específicas para TypeORM

Ámbito: estas reglas se aplican cuando los cambios afectan archivos de entidades, repositorios, capa de datos, configuración de TypeORM o migraciones.

## 1) Migraciones de TypeORM (Regla obligatoria)
- No crear, editar ni eliminar archivos de migraciones de TypeORM.
- Si un cambio en Entities o relaciones requiere migración, indícalo explícitamente en la descripción del PR bajo la sección “Se requiere migración”.
- No modificar migraciones existentes.
- Los developers generarán y ejecutarán migraciones con los comandos de TypeORM.

Comandos sugeridos para el developer (reemplazar paths y nombres según el proyecto):
- Generar migración:
  pnpm typeorm migration:generate -d path/to/data-source.ts src/core/database/migrations/NombreDeMigracion
- Ejecutar migraciones pendientes:
  pnpm typeorm migration:run -d path/to/data-source.ts
- Revertir la última migración:
  pnpm typeorm migration:revert -d path/to/data-source.ts

Qué sí puede hacer el agente:
- Proponer/implementar cambios en Entities y relaciones solo si son necesarios para el feature/bugfix, manteniendo cambios mínimos.
- Documentar claramente qué entidades y campos cambiaron y por qué.
- Añadir tests que cubran el comportamiento esperado tras esos cambios (sin crear migraciones).

## 2) Rendimiento y acceso a datos
- Evitar N+1 queries; usar relaciones, joins o cargas selectivas cuando sea necesario.
- Seleccionar solo columnas requeridas y paginar resultados en endpoints que retornen colecciones.
- No ejecutar SQL crudo sin parámetros; preferir QueryBuilder y repositorios con parámetros tipados.
