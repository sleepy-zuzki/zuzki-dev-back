# Guía del Desarrollador

Esta guía describe cómo trabajar en el proyecto bajo la arquitectura de **Vertical Slicing**.

## Mentalidad de Desarrollo

Olvida las capas horizontales estrictas (Controller > Service > Domain > Infra). Piensa en **Features**. Cuando tengas que añadir una funcionalidad:

1.  ¿A qué feature pertenece? (¿Auth? ¿Users? ¿Projects?)
2.  ¿Necesito crear una nueva feature?
3.  Implementa todo lo necesario (BD, Lógica, API) dentro de esa carpeta de feature.

## Recetas Comunes

### 1. Crear una Nueva Feature

1.  Crea la carpeta en `src/features/<nombre>`.
2.  Crea el módulo: `nest g module features/<nombre>`.
3.  Añádelo a `app.module.ts` (si no lo hizo el CLI).

### 2. Añadir un Endpoint (Controller)

1.  Dentro de `src/features/<feature>/controllers/`.
2.  Crea el DTO en `../dto/` usando `class-validator`.
3.  Inyecta el Service necesario en el constructor.
4.  Implementa el método con los decoradores `@Get`, `@Post`, etc.
5.  Retorna DTOs o interfaces simples, evita retornar entidades de TypeORM directamente si tienen datos sensibles.

### 3. Implementar Lógica de Negocio (Service)

1.  Dentro de `src/features/<feature>/services/`.
2.  Inyecta los Repositorios de TypeORM (`@InjectRepository(Entity)`) o adaptadores de `@shared`.
3.  Escribe la lógica. Si es muy compleja, puedes extraer partes a clases auxiliares o estrategias dentro de la misma carpeta de la feature.

### 4. Modelo de Datos (Entities)

1.  Dentro de `src/features/<feature>/entities/`.
2.  Usa decoradores de TypeORM (`@Entity`, `@Column`, etc.).
3.  Recuerda registrar la entidad en `TypeOrmModule.forFeature([Entity])` dentro del módulo de la feature.

### 5. Usar Infraestructura Compartida (Storage, Email, etc.)

1.  No reimplementes lógica genérica en la feature.
2.  Busca en `src/shared/`. Ejemplo: `SharedStorageModule`.
3.  Importa el módulo compartido en tu `FeatureModule`.
4.  Inyecta el servicio compartido (ej. `StorageService`) en tu Service de feature.

## Convenciones de Código

- **Imports**: Usa los alias definidos en `tsconfig.json`:
  - `@features/*` -> Otras features (usar con precaución).
  - `@shared/*` -> Utilidades compartidas.
  - `@config/*` -> Configuración.
- **Naming**:
  - Clases: `PascalCase` (ej. `UsersService`, `CreateUserDto`).
  - Archivos: `kebab-case` (ej. `users.service.ts`, `create-user.dto.ts`).
  - Interfaces: `PascalCase` (puedes prefijar con `I` si prefieres, pero no es obligatorio en TS moderno).

## Manejo de Errores

- Usa las excepciones estándar de NestJS (`NotFoundException`, `BadRequestException`, `UnauthorizedException`) directamente en los Services o Controllers.
- El filtro global de excepciones se encargará de formatear la respuesta HTTP.

## Testing

### Unit Testing (Jest)

- Archivos `.spec.ts` junto al archivo que prueban.
- Mockea las dependencias externas (Repositorios, otros Servicios).

Ejemplo básico de test de servicio:

```typescript
const module: TestingModule = await Test.createTestingModule({
  providers: [
    UsersService,
    { provide: getRepositoryToken(User), useValue: mockRepo },
  ],
}).compile();
```

### E2E Testing

- En la carpeta `test/`.
- Pruebas de caja negra golpeando la API.

## Despliegue y Migraciones

- **Migraciones**: Usamos TypeORM.
  - Generar: `pnpm migration:generate src/shared/database/migrations/<nombre>`.
  - Correr: `pnpm migration:run`.
- **Configuración**: Todo a través de variables de entorno (.env). Nunca hardcodees credenciales.

## Checklist para Pull Requests

- [ ] El código compila (`pnpm build`).
- [ ] El linter pasa (`pnpm lint`).
- [ ] No hay dependencias circulares entre features o hacia shared.
- [ ] Las nuevas entidades están registradas en el Módulo y en el DataSource.
- [ ] Si cambiaste la BD, incluiste la migración.
