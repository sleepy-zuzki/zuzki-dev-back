# Zuzki Dev Back - AI Context

## Project Overview

**Name:** `zuzki-dev-back`
**Type:** Backend Application
**Framework:** NestJS
**Language:** TypeScript
**Architecture:** **Vertical Slicing** (Feature-based). Domain and logic are grouped by functionality (`src/features/<feature>`) rather than technical layers.
**Database:** PostgreSQL with TypeORM.
**Documentation:** OpenAPI (Swagger) & Internal Docs in `docs/`.

## Key Documentation Resources

Refer to these files for detailed standards and guides:

- **Architecture:** `docs/ARCHITECTURE.md` - Core principles of Vertical Slicing, folder structure, and strict dependency rules.
- **Dev Guide:** `docs/DEVELOPER_GUIDE.md` - Recipes for creating features, endpoints, services, and entities. **Read this before writing code.**
- **API Reference:** `docs/FULL_API_DOCUMENTATION.md` - Comprehensive list of endpoints, payloads, and responses.
- **Database Schema:** `docs/schema.dbml` - Visualizable DB schema definitions (Auth, Stack, Project, Blog, Catalog).
- **PR Checklist:** `docs/PR_CHECKLIST.md` - Quality gates for code reviews.
- **Postman:** `docs/postman_collection.json` - Collection for local testing with auto-refresh token scripts.

## Architecture & Structure

The project strictly follows a **Vertical Slicing** architecture to maximize cohesion and minimize coupling.

### Key Directories

- **`src/features/<feature_name>/`**: Contains all logic for a specific feature.
    - `controllers/`: HTTP Endpoints.
    - `services/`: Business logic.
    - `entities/`: TypeORM entities.
    - `dto/`: Data Transfer Objects (Validation).
    - `<feature>.module.ts`: Encapsulation module.
- **`src/shared/`**: Cross-cutting concerns and reusable code.
    - **Crucial Rule:** `Shared` **MUST NEVER** depend on `Features`.
    - Contains: `database`, `storage`, `security`, `config`, `types` (generic).
- **`src/config/`**: Centralized configuration service.
- **`tools/`**: Scripts for migrations and seeding (`migration-create.js`, `seed.ts`).
- **`.aiassistant/rules/`**: **Strict** project rules. Consult these before generating code.

### Dependency Rules (See `docs/ARCHITECTURE.md`)

1.  ✅ **Feature -> Shared**: Allowed.
2.  ✅ **Feature -> Config**: Allowed.
3.  ❌ **Shared -> Feature**: **FORBIDDEN**.
4.  ⚠️ **Feature -> Feature**: Avoid. If necessary, use public API of the target module.

## Building and Running

The project uses **pnpm**.

```bash
# Install dependencies
pnpm install

# Run in development mode (watch)
pnpm run start:dev

# Run in production mode
pnpm run start:prod

# Run unit tests
pnpm run test

# Run E2E tests
pnpm run test:e2e

# Run linting
pnpm run lint
```

## Database & Migrations

- **ORM:** TypeORM
- **Schema Reference:** `docs/schema.dbml`.
- **CLI Wrapper:** Custom scripts in `package.json` and `tools/`.

```bash
# Run migrations
pnpm run migration:run

# Revert migration
pnpm run migration:revert

# Create empty migration
pnpm run migration:create --name=MigrationName

# Generate migration from entity changes
pnpm run migration:generate --name=MigrationName
```

**Note:** Always check `src/shared/database/data-source.ts` config.

## Development Conventions

- **Guide:** Follow recipes in `docs/DEVELOPER_GUIDE.md`.
- **Strict Typing:** Avoid `any`. Use strict TypeScript configuration.
- **Logging:** Use `NestJS Logger` or `Pino`. **NO** `console.log` in production.
- **DTOs:** All endpoints must use DTOs with `class-validator` decorators.
- **Config:** Use `ConfigService` for environment variables.
- **Tests:** Add unit tests for every new service method.
- **Style:** Follow `Prettier` and `ESLint` rules.

## AI Assistant Guidelines

- **Read First:** Before modifying code, consult `docs/DEVELOPER_GUIDE.md` and `.aiassistant/rules/`.
- **Atomic Changes:** Make small, verifiable changes.
- **Verification:** Always run `pnpm run build` and `pnpm run test` before considering a task complete.
- **Security:** Never expose secrets. Use `.env` variables.