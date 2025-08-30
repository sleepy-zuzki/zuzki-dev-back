---
apply: always
---

# Reglas para agentes IA: Arquitectura Hexagonal y Patrón de Diseño

Objetivo: garantizar que cualquier contribución generada por IA preserve estrictamente la arquitectura hexagonal del proyecto, mantenga la separación de responsabilidades y evite dependencias indeseadas o acoplamientos entre capas.

Estas reglas complementan las normas generales de agentes y las convenciones del repositorio.

## Principios rectores

- Dominio primero: el dominio es puro, independiente de frameworks y persistencia.
- Entrada/Salida como detalles: infraestructura y adaptadores son reemplazables.
- Dependencias hacia adentro: las capas externas dependen de las internas, nunca al revés.
- Puertos y adaptadores: la comunicación entre capas se modela con interfaces (puertos) y sus implementaciones (adaptadores).
- Tipado estricto y contratos explícitos: evita any y asegúrate de tener contratos claros por capa.
- Cambios minimalistas: prioriza parches atómicos que no mezclen preocupaciones de varias capas.

## Capas y responsabilidades

- Domain (src/domain/<feature>/)
  - Contiene reglas de negocio, tipos y modelos del dominio.
  - No depende de NestJS, TypeORM ni librerías de infraestructura.
  - Puede incluir “rules” y “types” del dominio.
- Application (src/application/<feature>/)
  - Orquesta casos de uso.
  - Define puertos (interfaces) hacia infraestructura y otros servicios externos.
  - Evita dependencias de framework; si se requieren, inyecta interfaces/tokens.
  - **Application Modules**: Módulos intermediarios que encapsulan la composición de servicios e importan desde Infrastructure. Estos módulos actúan como fachadas que ocultan los detalles de infraestructura a la capa de Interfaces.
- Infrastructure (src/infrastructure/…)
  - Implementa adaptadores de puertos: persistencia (ORM), HTTP clients, cache, storage, logging, etc.
  - No expone APIs directamente; cumple contratos de Application.
  - **Composition Modules**: Módulos en `src/infrastructure/composition/` que manejan la composición compleja de dependencias de infraestructura.
- Interfaces (src/interfaces/http/v{n}/<feature>/)
  - Controladores HTTP y módulos expuestos.
  - Valida entrada (DTOs), mapea hacia Application y retorna respuestas.
  - **NUNCA** accede a Infrastructure directamente; **SOLO** usa Application Modules (src/application/<feature>/\*.application.module.ts).
- Shared (src/shared/…)
  - Preocupaciones transversales: tipos comunes, utilidades puras, interceptores, guards, pipes, filtros, decoradores, constantes.
  - No contiene lógica de negocio.

## Reglas de dependencias permitidas

- Domain: no depende de nadie fuera de Domain o Shared puramente funcional.
- Application: puede depender de Domain y Shared. Define puertos (interfaces) hacia infraestructura.
- Infrastructure: puede depender de Application (para implementar puertos) y Shared. Nunca de Interfaces.
- Interfaces: puede depender **ÚNICAMENTE** de Application Modules (\*.application.module.ts) y Shared. **NUNCA** de Infrastructure.
- Shared: no depende de capas superiores (no debe conocer Application/Interfaces/Infrastructure).

Visualización de dependencias con Application Modules:

## Puertos, tokens e inyección de dependencias

- Define puertos (interfaces) en Application, en “ports/”.
- Expón tokens de inyección (constantes) para cada puerto, p. ej. FEATURE_PORT_TOKEN.
- Implementaciones de puertos viven en Infrastructure y se registran como providers que usan dichos tokens.
- No inyectes clases concretas de Infrastructure en Interfaces; inyecta tokens/puertos definidos en Application.

## Application Modules (Patrón Obligatorio)

**Propósito**: Actuar como capa intermedia que encapsula la composición de dependencias de Infrastructure, manteniendo a Interfaces libre de conocimiento sobre Infrastructure.

**Estructura obligatoria:**

- Ubicación: `src/application/<feature>/<feature>.application.module.ts`
- Naming: `{Feature}ApplicationModule`
- Responsabilidad: Importar y re-exportar módulos de composición de Infrastructure

**Ejemplo de implementación:**

## DTOs, mapeo y modelos

- DTOs de entrada/salida SOLO en Interfaces (p. ej., src/interfaces/http/v1/<feature>/dto/).
- No uses entidades de ORM en controladores. Mapea DTO <-> modelos de dominio o view models en mappers de Application.
- Application puede proveer mappers para convertir domain <-> view models/DTOs, o exponer tipos de salida específicos del caso de uso.
- Mantén separado el modelo de dominio del modelo de persistencia. No filtres detalles de ORM al dominio.

## Persistencia y ORM

- Entidades de persistencia (TypeORM) solo en Infrastructure.
- Repositorios de persistencia implementan puertos definidos en Application.
- Prohíbe el uso de entidades ORM en Domain/Application/Interfaces.
- Evita SQL crudo; usa repositorios/QueryBuilder parametrizado. Nunca incrustes credenciales o strings sensibles.

## Interfaces HTTP

- Controladores solo orquestan: validan DTOs, delegan al caso de uso de Application y devuelven respuesta.
- No coloques lógica de negocio en controladores.
- Usa decoradores y guards transversales desde Shared.
- Versiona los endpoints bajo interfaces/http/v{n}.
- No importes Infrastructure en módulos o controladores HTTP.

## Cross-cutting concerns

- Guards, interceptores, pipes y filtros viven en Shared.
- La configuración global (p. ej., guards globales, interceptores) se registra en el bootstrap o en los módulos de Interfaces, usando providers y tokens adecuados.
- Logs con el logger configurado del proyecto (no console.log).

## Manejo de errores y seguridad

- Usa excepciones de @nestjs/common en Interfaces para retornar códigos HTTP adecuados.
- En Application y Domain, lanza errores de negocio o resultados tipados; tradúcelos a excepciones HTTP en Interfaces.
- Sanitiza/valida entradas en DTOs con class-validator y class-transformer.
- Nunca expongas secretos; usa variables de entorno gestionadas por el servicio de configuración.
- Autenticación y autorización deben ser transversales; respeta los decoradores públicos/roles y los guards definidos.

## Versionado y compatibilidad

- Toda nueva API debe vivir en la versión de Interfaces apropiada.
- La deprecación debe documentarse y exponerse de forma controlada. Evita cambios incompatibles sin una versión mayor o un plan de migración.

## Pruebas

- Unit tests por capa:
  - Domain: pruebas puras de reglas, sin mocks de framework.
  - Application: casos de uso con mocks de puertos.
  - Infrastructure: pruebas de integración acotadas (p. ej., repositorios con DB de prueba).
  - Interfaces: pruebas unitarias de controladores (mockeando Application) y, si aplica, e2e focalizadas.
- No mezcles pruebas de distintas capas en el mismo archivo.
- Cubre flujo feliz y errores principales.

## Qué puede cambiar un agente IA (y qué no)

Permitido:

- Añadir/ajustar casos de uso en Application con sus puertos.
- Crear adaptadores en Infrastructure que implementen puertos existentes.
- Agregar controladores/DTOs/módulos en Interfaces que usen **únicamente** Application Modules.
- **Crear Application Modules** cuando se añade nueva funcionalidad que requiera Infrastructure.
- Añadir tipos/utilidades transversales en Shared.
- Pequeñas mejoras de seguridad, validación y manejo de errores coherentes con este diseño.

Prohibido:

- **NUNCA** importar directamente desde Infrastructure en Interfaces (usar Application Modules).
- **NUNCA** importar desde `@infra/*` en Interfaces; usar `@application/*` únicamente.
- Usar entidades/artefactos de ORM fuera de Infrastructure.
- Añadir lógica de negocio en controladores, guards o interceptores.
- Saltarse puertos e inyectar implementaciones concretas en Application/Interfaces.
- Crear módulos en Interfaces que importen composition modules directamente.
- Añadir dependencias sin justificación y aprobación.

## Anti‑patrones a evitar

- Anemia en Application: mover toda la lógica a controladores o repositorios.
- Dependencias circulares entre módulos.
- Acoplar Domain a detalles de persistencia (decoradores de ORM, repositorios concretos).
- Reutilizar entidades ORM como DTOs o tipos del dominio.
- Accesos directos a datos en Interfaces (bypass del caso de uso).
- “God services” con demasiadas responsabilidades y dependencias.

## Checklist previo al PR (IA)

- [ ] La clase/archivo añadido respeta la carpeta y capa correctas.
- [ ] **CRÍTICO**: Interfaces NO importa directamente de Infrastructure (`@infra/*`).
- [ ] **CRÍTICO**: Interfaces solo importa de Application Modules (`@application/*`).
- [ ] Si se crea funcionalidad nueva, existe su correspondiente Application Module.
- [ ] Application Modules solo importan/exportan, sin lógica adicional.
- [ ] No hay importaciones hacia capas internas desde capas externas prohibidas.
- [ ] Los puertos nuevos están definidos en Application y tienen token de inyección.
- [ ] Las implementaciones de puertos están en Infrastructure y registradas por token.
- [ ] Los controladores solo orquestan y usan DTOs con validación.
- [ ] No hay uso de entidades ORM fuera de Infrastructure.
- [ ] Errores mapeados a excepciones HTTP en Interfaces; dominio y aplicación usan contratos propios.
- [ ] Tipado estricto sin any ni silencios de ESLint/Prettier sin justificación.
- [ ] Pruebas unitarias/integración pertinentes están incluidas o actualizadas.
- [ ] No se expusieron secretos y se usan variables de entorno existentes.

## Estrategia de evolución

- Para refactors grandes, propone primero un plan de módulos y migración de puertos, luego implementa por pasos pequeños.
- Mantén adaptadores y contratos estables; introduce nuevas versiones de puertos si hace falta sin romper consumidores.
- Documenta los cambios en un README de módulo o en las notas internas de arquitectura.

---

Cumplir estas reglas preserva la arquitectura hexagonal, facilita el cambio de detalles de infraestructura y mantiene el dominio independiente y testeable.
