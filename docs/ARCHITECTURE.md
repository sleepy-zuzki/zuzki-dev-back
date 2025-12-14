# Arquitectura y Convenciones

Este proyecto implementa una arquitectura basada en **Vertical Slicing** (Slices Verticales). El objetivo es agrupar el código por **funcionalidad (feature)** en lugar de por capas técnicas, reduciendo la complejidad, el boilerplate y facilitando el mantenimiento por un equipo pequeño.

## Principios Fundamentales

1.  **Agrupación por Feature**: Todo lo relacionado con una característica (controladores, servicios, entidades, DTOs) reside en la misma carpeta (`src/features/<nombre-feature>`).
2.  **Cohesión sobre Capas**: Se prioriza que el código que cambia junto esté junto. No forzamos capas artificiales (como interfaces/ports) si no son estrictamente necesarias.
3.  **Independencia de Features**: Una feature idealmente no debería depender de otra. Si necesitan compartir lógica, esta se mueve a `src/shared` o se comunica a través de eventos/módulos públicos.
4.  **Shared Reutilizable**: El código transversal (configuración, utilidades, componentes UI comunes, adaptadores de infraestructura genéricos) vive en `src/shared`. `Shared` **nunca** debe depender de una `Feature`.

## Estructura de Carpetas

```
src/
├── features/               # Módulos funcionales (Slices)
│   ├── auth/
│   │   ├── controllers/    # Endpoints HTTP
│   │   ├── services/       # Lógica de negocio
│   │   ├── entities/       # Modelos de base de datos (TypeORM)
│   │   ├── dto/            # Transferencia de datos y validación
│   │   ├── guards/         # Seguridad específica de la feature
│   │   └── auth.module.ts  # Módulo de NestJS que encapsula la feature
│   ├── users/
│   └── ...
├── shared/                 # Código transversal reutilizable
│   ├── database/           # Configuración de BD
│   ├── storage/            # Adaptadores de almacenamiento (S3, R2)
│   ├── security/           # Hashing, encriptación
│   └── ...
├── config/                 # Configuración centralizada (Variables de entorno)
├── main.ts                 # Punto de entrada
└── app.module.ts           # Módulo raíz que importa features y shared
```

## Flujo de Datos Típico

El flujo es directo y pragmático:

1.  **Controller**: Recibe la petición HTTP, valida el DTO y llama al Service.
2.  **Service**: Contiene la lógica de negocio. Llama al Repository (TypeORM) o a otros providers.
3.  **Repository/Entity**: Acceso a datos directo usando TypeORM.
4.  **Shared Adapters**: Si se requiere infraestructura externa (ej. subir un archivo), el Service llama a un adaptador genérico inyectado desde `@shared`.

## Reglas de Dependencia

- ✅ **Feature -> Shared**: Las features pueden usar todo lo que hay en Shared.
- ✅ **Feature -> Config**: Las features pueden leer la configuración.
- ❌ **Shared -> Feature**: Shared NO puede importar nada de Features (evita ciclos y acoplamiento).
- ⚠️ **Feature -> Feature**: Evitar en lo posible. Si es necesario (ej. `Auth` necesita `Users`), hacerlo a través del `Module` público y servicios exportados, manteniendo el acoplamiento bajo control.

## Autenticación y Seguridad

- La autenticación (JWT) es global o específica por endpoint según guards.
- Se utiliza `Passport` y `Guards` de NestJS.
- Las contraseñas y secretos se gestionan en `@shared/security` y `@config`.

## Testing

- **Unit Tests**: Se prueban los Services mockeando los Repositories y Adapters.
- **E2E Tests**: Se prueban los flujos completos levantando la aplicación (o parte de ella) y golpeando los endpoints.
