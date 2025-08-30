# Arquitectura y convenciones

Este proyecto implementa arquitectura hexagonal (puertos y adaptadores) con separación estricta de capas:

- Interfaces (HTTP): Controladores, DTOs, validación y mapeo de errores a HTTP.
- Application: Casos de uso (services), puertos/contratos (ports) y mappers. No conoce infraestructura concreta.
- Domain: Tipos y reglas puras, sin dependencias de frameworks.
- Infrastructure: Adaptadores concretos (ORM, hashing, JWT, storage, cache, etc.) que implementan puertos y exponen providers por tokens.
- Composition: Módulos por feature que cablean infraestructura ↔ application y exportan services listos para usar.
- Shared: Utilidades y tipos transversales (guards, interceptores, pipes, filtros, decoradores, constantes, utils).

Consulta también: .aiassistant/rules/hexagonal_architecture_rules.md

## Principios

- Dependencias hacia adentro: las capas externas dependen de las internas; nunca al revés.
- Interfaces no importan infraestructura; dependen de Application/Shared.
- Application es agnóstica a tecnologías y depende de puertos/tokens.
- Infrastructure implementa puertos definidos por Application y los provee vía tokens.
- Composition centraliza el wiring de cada feature.
- Domain es puro, sin framework ni detalles técnicos.

## Versionado y autenticación

- La API HTTP está versionada (v1) y todos los controladores deben declarar su versión.
- La autenticación por JWT se aplica globalmente por defecto; utiliza el decorador de endpoint público para rutas abiertas.

## Flujo de wiring por feature

1. Application

- Define Ports y Tokens (interfaces/constantes).
- Define Services (casos de uso) que reciben Ports.

2. Infrastructure

- Implementa los Ports y expone módulos de infraestructura por feature que hacen `provide: TOKEN`.

3. Composition

- Importa módulos de infraestructura del feature.
- Declara un provider para el Service usando `useFactory(...)` e inyecta los Tokens/Ports.
- Exporta el Service para consumo de Interfaces.

4. Interfaces (HTTP)

- Importa el módulo de Composition del feature.
- Inyecta el Service en controladores; valida DTOs; mapea errores a HTTP.

## Reglas clave

- No importar infraestructura desde Interfaces.
- No filtrar modelos específicos de ORM a Application/Domain.
- Mapear errores de Application/Domain a excepciones HTTP en Interfaces.
- Usar el logger del proyecto (no `console.log` en producción).
- DTOs validados con class-validator en Interfaces.

## Beneficios

- Bajo acoplamiento y alta testabilidad (mocks de Ports).
- Reemplazo de tecnología sin tocar Application ni Interfaces.
- Composition como punto único de wiring por feature.

## Cambiar de ORM (ejemplo mental)

- Mantén estable `UsersRepositoryPort`.
- Implementa un nuevo adaptador que cumpla el Port.
- Crea un módulo de infraestructura que provea el TOKEN con ese adaptador.
- Ajusta el módulo de Composition para usar ese módulo.
- Application e Interfaces permanecen estables.

## Testing recomendado

- Unit tests en Application con mocks de Ports.
- Tests de controladores en Interfaces con services mockeados y DTOs validados.
- Integración focalizada para adaptadores de infraestructura críticos.
