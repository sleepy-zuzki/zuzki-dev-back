---
apply: always
---

# Reglas para Agentes IA: Vertical Slicing

Objetivo: Garantizar que el código generado siga estrictamente la arquitectura de **Vertical Slicing** (Slices Verticales), priorizando la agrupación por funcionalidad (Feature) y evitando la complejidad innecesaria de capas horizontales estrictas.

## Principios Fundamentales

1.  **Agrupación por Feature**: Todo el código relacionado con una funcionalidad específica (controladores, servicios, entidades, DTOs) debe residir en `src/features/<nombre-feature>`.
2.  **Independencia**: Las features deben ser lo más independientes posible entre sí.
3.  **Shared**: Código transversal y reutilizable va en `src/shared`.
4.  **Pragmatismo**: No crear abstracciones (interfaces/ports) si no son necesarias. Inyección directa de Repositorios y Servicios es permitida.

## Estructura de Carpetas

- `src/features/<feature>/`
  - `controllers/`: Endpoints HTTP.
  - `services/`: Lógica de negocio.
  - `entities/`: Modelos de base de datos (TypeORM).
  - `dto/`: Objetos de transferencia de datos y validación.
  - `<feature>.module.ts`: Módulo de NestJS que encapsula la feature.
- `src/shared/`
  - Utilidades, configuraciones globales, adaptadores de infraestructura genéricos (Storage, Email, etc.).
- `src/config/`
  - Configuración de variables de entorno.

## Reglas de Dependencia (Estrictas)

1.  **Features -> Shared**: ✅ PERMITIDO. Las features pueden usar utilidades y módulos de shared.
2.  **Shared -> Features**: ❌ PROHIBIDO. Shared nunca debe depender de una feature específica.
3.  **Feature -> Feature**: ⚠️ EVITAR. Si es necesario, usar el módulo público de la otra feature. Preferir comunicación por eventos o mover lógica común a Shared.
4.  **Imports**:
    - Usar alias `@features/*`, `@shared/*`, `@config/*`.
    - NO usar rutas relativas largas `../../shared/...`.

## Desarrollo de Features

1.  **Módulos**: Cada feature debe tener su propio `Module`.
2.  **Controladores**:
    - Manejan la petición HTTP y validación (DTOs).
    - Llaman a Services.
    - No contienen lógica de negocio compleja.
3.  **Servicios**:
    - Contienen la lógica de negocio.
    - Interactúan con Repositorios (TypeORM) directamente.
    - Pueden usar adaptadores de `@shared`.
4.  **Entidades**:
    - Definidas dentro de la feature.
    - Registradas en `TypeOrmModule.forFeature()` dentro del módulo de la feature.

## Anti-patrones a Evitar

- **Capas Horizontales**: No crear carpetas `src/controllers`, `src/services` a nivel raíz. Todo debe estar dentro de una feature o shared.
- **Lógica en Controladores**: Mantener los controladores delgados.
- **Dependencias Circulares**: Tener cuidado al importar servicios de otras features.

## Checklist para el Agente

- [ ] ¿El código nuevo pertenece a una feature existente o requiere una nueva?
- [ ] ¿Estoy colocando los archivos en `src/features/<nombre>/...`?
- [ ] ¿He validado que no estoy importando una feature dentro de `@shared`?
- [ ] ¿Estoy usando los alias de importación correctos?
- [ ] ¿He registrado las nuevas entidades y servicios en el módulo de la feature?
