# Reglas para agentes de IA en este proyecto NestJS

Objetivo: asegurar que las contribuciones generadas por IA sean seguras, mantenibles y compatibles con el flujo de trabajo del equipo.

Estas reglas aplican a cualquier cambio propuesto o implementado por agentes de IA en este repositorio.

## Principios
- Seguridad primero: nunca exponer secretos ni credenciales.
- Cambios mínimos y revisables: priorizar parches pequeños, atómicos y con propósito claro.
- Mantenibilidad: respetar la arquitectura NestJS, tipado estricto y estilo de código del proyecto.
- Consistencia: usar las herramientas y convenciones ya presentes en el repositorio.

## Reglas operativas

### 1) Migraciones de TypeORM (Regla obligatoria)
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

### 2) Arquitectura NestJS
- Seguir el patrón de módulos, controladores, servicios y providers.
- Aplicar responsabilidad única por clase/archivo cuando sea posible.
- Usar inyección de dependencias de Nest en lugar de instancias manuales.
- Manejo de errores con las excepciones de @nestjs/common (por ejemplo, BadRequestException, NotFoundException, etc.).
- Evitar console.log en código de producción; preferir Logger de NestJS.

### 3) TypeScript y calidad de código
- Tipado estricto: evitar any; preferir tipos explícitos e inferencia segura.
- Mantener nombres descriptivos, evitar duplicación y preferir funciones puras cuando aplique.
- Cumplir con ESLint/Prettier del proyecto. No deshabilitar reglas salvo que exista una justificación técnica y consenso.

### 4) Validación y DTOs
- Respetar el mecanismo de validación ya existente en el proyecto (pipes, DTOs, etc.).
- No introducir nuevas librerías de validación sin aprobación previa.
- Los DTOs deben reflejar exactamente el contrato público esperado y contener solo lo necesario.

### 5) Dependencias y gestor de paquetes
- Usar exclusivamente pnpm para la gestión de paquetes.
- No agregar ni actualizar dependencias sin solicitar aprobación explícita.
- Si se propone una nueva dependencia, incluir: motivo, alternativas evaluadas, tamaño/impacto y plan de rollback.

### 6) Seguridad y datos
- No exponer secretos, claves o tokens en el código ni en los parches.
- Usar variables de entorno para valores sensibles y respetar la configuración existente.
- No ejecutar SQL crudo sin parámetros; preferir el QueryBuilder de TypeORM y/o repositorios.
- Sanitizar/validar inputs en capas adecuadas y retornar códigos HTTP coherentes.

### 7) API y contratos
- No romper contratos públicos (nombres de rutas, DTOs, respuestas) sin aprobación y plan de migración.
- Mantener la compatibilidad hacia atrás cuando sea posible.
- Documentar cualquier cambio que afecte a clientes existentes.

### 8) Pruebas
- Escribir o actualizar pruebas unitarias con Jest para nueva lógica o correcciones.
- Evitar pruebas end-to-end pesadas sin aprobación; priorizar unit tests y pruebas de integración focalizadas.
- Aislar dependencias usando mocks/stubs cuando corresponda.

### 9) Rendimiento y acceso a datos
- Evitar N+1 queries; usar relaciones, joins o cargas selectivas cuando sea necesario.
- Seleccionar solo columnas requeridas y paginar resultados en endpoints que retornen colecciones.

### 10) Estilo de commits y PRs
- Mantener commits pequeños y descriptivos.
- Incluir en el PR:
  - Resumen del cambio
  - Contexto/justificación
  - Impacto (endpoints afectados, entidades afectadas)
  - “Se requiere migración”: Sí/No. Si Sí, detallar entidades/campos.
  - Checklist (lint, build, tests en local)

## Proceso recomendado para agentes de IA

1) Análisis de impacto
- Identifica qué módulos, servicios, controladores o entidades se tocan.
- Verifica dependencias y efectos colaterales (usos, inyección de dependencias, contratos).

2) Implementación incremental
- Realiza cambios mínimos y enfocados.
- No introduzcas refactors masivos no solicitados.

3) Validación local
- Asegúrate de que el código compile y cumpla con las reglas de lint y formato del proyecto.
- Añade/ajusta tests unitarios pertinentes.

4) Entrega y comunicación
- Prepara el PR siguiendo la plantilla anterior.
- Si tus cambios afectan el esquema de base de datos, marca “Se requiere migración” y no incluyas archivos de migración.

## Checklist previo a abrir PR
- [ ] Código compila sin errores.
- [ ] Lint/formato aplicados según configuración del proyecto.
- [ ] Pruebas unitarias relevantes añadidas/actualizadas y en verde.
- [ ] No se agregaron migraciones de TypeORM.
- [ ] Si hay cambios de Entities/relaciones: “Se requiere migración” marcado y documentado.
- [ ] No se agregaron dependencias sin aprobación.
- [ ] No se exponen secretos ni valores sensibles.

Cumplir estas reglas agiliza la revisión y reduce errores en producción. Gracias por colaborar responsablemente.
