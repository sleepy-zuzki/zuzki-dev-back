# Arquitectura y convenciones

Este proyecto sigue una arquitectura por capas con orientación a puertos y adaptadores (hexagonal):

- Interfaces (HTTP): Controladores, DTOs, validación y mapeo de errores a HTTP.
- Application: Casos de uso (services), puertos/contratos (ports) y mappers. No conoce infraestructura concreta.
- Domain: Tipos y reglas puras, sin dependencias de frameworks.
- Infrastructure: Adaptadores concretos (ORM, hashing, JWT, storage, cache, etc.) y módulos que proveen tokens/ports.
- Composition: Módulos por feature que cablean infraestructura ↔ application y exportan services listos para usar.
- Shared: Utilidades y tipos transversales.

## Principios

- Interfaces no importan directamente infraestructura; solo consumen services provistos por Composition/Application.
- Application se mantiene agnóstico a tecnologías. Depende solo de Ports y Tokens.
- Infrastructure implementa ports y expone providers por tokens.
- Composition conecta los tokens de infraestructura con los services de application y los exporta.
- Domain no depende de ningún framework.

## Flujo de wiring por feature

1. Application

- Define Ports y Tokens (interfaces/constantes).
- Define Services (casos de uso) que reciben Ports.

2. Infrastructure

- Implementa los Ports y expone Módulos de infraestructura por feature que hacen `provide: TOKEN`.

3. Composition

- Importa módulos de infraestructura del feature.
- Declara un provider para el Service usando `useFactory(...)` e inyecta los Tokens/Ports.
- Exporta el Service para consumo de Interfaces.

4. Interfaces (HTTP)

- Importa el módulo de Composition del feature.
- Inyecta el Service en controladores; valida DTOs; mapea errores a HTTP.

## Beneficios

- Bajo acoplamiento y alta testabilidad (mocks de Ports).
- Reemplazo de tecnología (p. ej., ORM) sin tocar Application ni Interfaces.
- Composition como “Single Point of Truth” para el wiring por feature.

## Reglas clave

- No importar infraestructura desde Interfaces.
- No filtrar modelos específicos de ORM a Application/Domain.
- Mapear errores de Application/Domain a excepciones HTTP en Interfaces.
- Usar Logger de NestJS (o nestjs-pino) en lugar de `console.log` en producción.
- DTOs validados con class-validator en Interfaces.

## Cambiar de ORM (ejemplo mental)

- Mantén estable `UsersRepositoryPort`.
- Implementa un nuevo adaptador (p. ej., PrismaUsersRepositoryAdapter) que cumpla el Port.
- Crea un nuevo módulo de infraestructura para proveer el TOKEN con ese adaptador.
- Ajusta el módulo de Composition (o crea uno alternativo) para importar ese módulo.
- Interfaces ni Application requieren cambios.

## Testing recomendado

- Unit tests en Application con mocks de Ports.
- Tests de controladores en Interfaces con services mockeados y DTOs validados.
- Integración focalizada para adaptadores de infraestructura críticos.
