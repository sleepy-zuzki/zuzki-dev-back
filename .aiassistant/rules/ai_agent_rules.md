---
apply: always
---

# Reglas generales para agentes de IA en este proyecto NestJS

Objetivo: asegurar que las contribuciones generadas por IA sean seguras, mantenibles y compatibles con el flujo de trabajo del equipo.

Estas reglas generales aplican a cualquier cambio propuesto o implementado por agentes de IA en este repositorio.
Para reglas específicas por tecnología (p. ej., TypeORM o API/DTOs), consulta:

- .aiassistant/rules/hexagonal_architecture_rules.md
- .aiassistant/rules/typeorm_rules.md
- .aiassistant/rules/api_rules.md

## Principios

- Seguridad primero: nunca exponer secretos ni credenciales.
- Cambios mínimos y revisables: priorizar parches pequeños, atómicos y con propósito claro.
- Mantenibilidad: respetar la arquitectura NestJS, tipado estricto y estilo de código del proyecto.
- Consistencia: usar las herramientas y convenciones ya presentes en el repositorio.

## Reglas operativas

### Arquitectura NestJS

- Seguir el patrón de módulos, controladores, servicios y providers.
- Aplicar responsabilidad única por clase/archivo cuando sea posible.
- Usar inyección de dependencias de Nest en lugar de instancias manuales.
- Manejo de errores con las excepciones de @nestjs/common (por ejemplo, BadRequestException, NotFoundException, etc.).
- Evitar console.log en código de producción; preferir Logger de NestJS.

### TypeScript y calidad de código

- Tipado estricto: evitar any; preferir tipos explícitos e inferencia segura.
- Mantener nombres descriptivos, evitar duplicación y preferir funciones puras cuando aplique.
- Cumplir con ESLint/Prettier del proyecto. No deshabilitar reglas salvo que exista una justificación técnica y consenso.

### Dependencias y gestor de paquetes

- Usar exclusivamente pnpm para la gestión de paquetes.
- No agregar ni actualizar dependencias sin solicitar aprobación explícita.
- Si se propone una nueva dependencia, incluir: motivo, alternativas evaluadas, tamaño/impacto y plan de rollback.

### Seguridad y datos

- No exponer secretos, claves o tokens en el código ni en los parches.
- Usar variables de entorno para valores sensibles y respetar la configuración existente.
- No ejecutar SQL crudo sin parámetros; preferir acceso a datos seguro y parametrizado.
- Sanitizar/validar inputs en capas adecuadas y retornar códigos HTTP coherentes.

### Pruebas

- Escribir o actualizar pruebas unitarias con Jest para nueva lógica o correcciones.
- Evitar pruebas end-to-end pesadas sin aprobación; priorizar unit tests y pruebas de integración focalizadas.
- Aislar dependencias usando mocks/stubs cuando corresponda.

### Estilo de commits y PRs

- Mantener commits pequeños y descriptivos.
- Incluir en el PR:
  - Resumen del cambio
  - Contexto/justificación
  - Impacto (endpoints afectados, entidades afectadas)
  - “Se requiere migración”: Sí/No. Si Sí, detallar entidades/campos.
  - Checklist (lint, build, tests en local)

## Proceso recomendado para agentes de IA

1. Análisis de impacto

- Identifica qué módulos, servicios, controladores o entidades se tocan.
- Verifica dependencias y efectos colaterales (usos, inyección de dependencias, contratos).

2. Implementación incremental

- Realiza cambios mínimos y enfocados.
- No introduzcas refactors masivos no solicitados.

3. Validación local

- Asegúrate de que el código compile y cumpla con las reglas de lint y formato del proyecto.
- Añade/ajusta tests unitarios pertinentes.

4. Entrega y comunicación

- Prepara el PR siguiendo la plantilla anterior.
- Si tus cambios afectan el esquema de base de datos, marca “Se requiere migración” y no incluyas archivos de migración.

## Checklist previo a abrir PR

- [ ] Código compila sin errores.
- [ ] Lint/formato aplicados según configuración del proyecto.
- [ ] Pruebas unitarias relevantes añadidas/actualizadas y en verde.
- [ ] No se agregaron dependencias sin aprobación.
- [ ] No se exponen secretos ni valores sensibles.

## Tipos y reutilización

- Todos los tipos y contratos compartidos deben residir en carpetas dedicadas "types" dentro de cada dominio/módulo (por ejemplo: src/users/types, src/auth/types).
- No definir tipos en línea si ya existen en la carpeta de tipos; siempre importarlos desde su fuente canónica.
- Si un tipo será usado por múltiples módulos, evaluar moverlo a un paquete/ubicación común (por ejemplo, src/shared/types) y re-exportarlo para evitar duplicaciones.
- Cualquier PR que introduzca tipos nuevos debe revisar y referenciar tipos existentes para prevenir definiciones duplicadas o ligeramente distintas.

Cumplir estas reglas agiliza la revisión y reduce errores en producción. Gracias por colaborar responsablemente.
