# Copilot Instructions for zuzki-dev-back

This project implements a strict hexagonal architecture (ports & adapters) using NestJS. AI coding agents must follow these conventions to ensure maintainability, testability, and separation of concerns.

## Architecture Overview

- **Layers**:
  - **Domain** (`src/domain/<feature>/`): Pure business logic, types, and rules. No framework/ORM dependencies.
  - **Application** (`src/application/<feature>/`): Use case orchestration, ports (interfaces), tokens, and mappers. No direct infrastructure/framework dependencies.
  - **Infrastructure** (`src/infrastructure/...`): Adapters for persistence, external services, etc. Implements application ports.
  - **Composition** (`src/infrastructure/composition/`): Wires infrastructure adapters to application services via providers/tokens.
  - **Interfaces (HTTP)** (`src/interfaces/http/v{n}/<feature>/`): Controllers, DTOs (class-validator), error mapping. Only imports from application modules.
  - **Shared** (`src/shared/`): Cross-cutting utilities (guards, interceptors, pipes, filters, decorators, constants, types).

- **Dependency Direction**: Always inward (Interfaces → Composition → Application → Domain). Never import infrastructure directly in interfaces.

## Developer Workflows

- **Install dependencies**:  
  `pnpm install`
- **Build**:  
  `pnpm run build`
- **Run (dev/prod)**:  
  `pnpm run start:dev` / `pnpm run start:prod`
- **Test (unit/e2e/coverage)**:  
  `pnpm run test` / `pnpm run test:e2e` / `pnpm run test:cov`
- **Lint/Format**:  
  `pnpm lint` / `pnpm lint:fix`
- **Typecheck**:  
  `pnpm typecheck`
- **Pre-commit hooks**:  
  Lint and format staged files via `.husky/pre-commit`

## Project-Specific Patterns

- **DTOs**:  
  All request/response DTOs live in `src/interfaces/http/v{n}/<feature>/dto/` and use `class-validator`.
- **Application Modules**:  
  Every feature exposes an application module (`src/application/<feature>/<feature>.application.module.ts`) that re-exports composition modules. Interfaces only import these modules.
- **Ports & Tokens**:  
  Define ports in `application/<feature>/ports/` and tokens for DI. Infrastructure implements and provides these via tokens.
- **No ORM Entities Outside Infrastructure**:  
  Domain/application/interfaces must not use ORM entities.
- **Error Handling**:  
  Map domain/application errors to HTTP exceptions in controllers using `@nestjs/common` exceptions.
- **Versioning**:  
  All controllers declare API version (`version: '1'`) and endpoints are prefixed accordingly.

## Integration Points

- **Postman Collections**:  
  Automatically synchronized with API endpoints. Do not edit manually; see [postman/README.md](postman/README.md).
- **TypeORM Migrations**:  
  Do not create/edit migration files directly. If entity changes require migration, note it in PR description.

## Key References

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md): Architecture principles and wiring flow.
- [docs/DEVELOPER_GUIDE.md](docs/DEVELOPER_GUIDE.md): Layer responsibilities, common recipes, and pitfalls.
- [docs/PR_CHECKLIST.md](docs/PR_CHECKLIST.md): PR requirements and quality checks.
- [CONTRIBUTING.md](CONTRIBUTING.md): Contribution workflow and ESLint-enforced boundaries.
- [.aiassistant/rules/hexagonal_architecture_rules.md](.aiassistant/rules/hexagonal_architecture_rules.md): AI agent rules for architecture compliance.
- [.aiassistant/rules/api_rules.md](.aiassistant/rules/api_rules.md): API-specific conventions.

## Examples

- **Adding an endpoint**:
  - Create DTOs in `interfaces/http/v1/<feature>/dto/`
  - Update controller in `interfaces/http/v1/<feature>/<feature>.controller.ts`
  - Inject service from application module
- **Adding a new adapter**:
  - Implement port in `infrastructure/.../adapters/`
  - Provide token in infrastructure module
  - Wire via composition module

---

**Feedback requested:**  
Are any sections unclear or missing key patterns? Let me know to iterate and improve
