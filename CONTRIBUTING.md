# Guía de Contribución - Zuzki Dev Back

¡Gracias por tu interés en contribuir a **Zuzki Dev Back**! 

Este proyecto ha evolucionado hacia una arquitectura de **Vertical Slicing** (Slices Verticales), priorizando la cohesión funcional y la simplicidad sobre las capas horizontales tradicionales (como Hexagonal o Onion). Por favor, lee esta guía para asegurar que tus aportes sigan nuestros estándares actuales.

## 🛠️ Requisitos del Entorno

- **Node.js**: v22.x o superior.
- **pnpm**: v10.x o superior.
- **PostgreSQL**: Instancia local o vía Docker.
- **Motores**: Definidos en `package.json` (Node 22+, pnpm 10+).

## 🚀 Flujo de Trabajo (Git Flow Simplificado)

1. **Sincronización**: Asegúrate de estar en `main` o `develop` y haz un `pnpm install`.
2. **Rama de Trabajo**:
   - Funcionalidades: `feat/<descripcion-breve>`
   - Correcciones: `fix/<descripcion-breve>`
   - Refactor: `refactor/<descripcion-breve>`
3. **Calidad Continua**: Antes de hacer commit, el sistema ejecutará `husky` para validar:
   - Formato con Prettier.
   - Linting con ESLint.
4. **Pull Request**: Abre un PR contra la rama `develop`. Asegúrate de completar el checklist de `docs/PR_CHECKLIST.md`.

## 🏗️ Arquitectura: Vertical Slicing

Nuestra arquitectura se basa en agrupar el código por **lo que hace** (funcionalidad) y no por **lo que es** (capa técnica).

### 1. Estructura de una Feature (`src/features/<feature>/`)
Cada slice funcional debe ser autocontenido:
- `controllers/`: Endpoints HTTP y validación de entrada (DTOs).
- `services/`: Lógica de negocio y orquestación.
- `entities/`: Modelos de base de datos (TypeORM).
- `dto/`: Objetos de transferencia y validación (`class-validator`).
- `<feature>.module.ts`: Punto de entrada y configuración del módulo.

### 2. Capa Shared (`src/shared/`)
Solo para código transversal y agnóstico a las features:
- Configuración de base de datos, adaptadores de storage genéricos (S3), seguridad (hashing) y utilidades comunes.
- **Regla Estricta**: `Shared` **NUNCA** debe importar nada de `Features`.

### 3. Reglas de Dependencia
- ✅ **Feature A -> Shared**: Permitido.
- ❌ **Shared -> Feature A**: Prohibido (causa acoplamiento circular).
- ⚠️ **Feature A -> Feature B**: Evitar. Si es necesario, importar el módulo de la Feature B en el módulo de la Feature A y usar sus servicios exportados.

## 📝 Estándares de Código

- **TypeScript Estricto**: No usar `any`. Definir tipos de retorno en funciones públicas.
- **Alias de Importación**: Usar siempre `@features/*`, `@shared/*` y `@config/*`.
- **Validación**: Todos los inputs de controladores deben usar DTOs con decoradores de `class-validator`.
- **Logging**: Usar el `Logger` de NestJS (respaldado por Pino). Evitar `console.log`.
- **Commits**: Seguir la convención de [Conventional Commits](https://www.conventionalcommits.org/).

## ✅ Comandos Útiles

```bash
# Verificación completa (Recomendado antes de PR)
pnpm run typecheck && pnpm run lint && pnpm run test

# Formatear código
pnpm run format

# Generar migraciones tras cambios en entidades
pnpm run migration:generate --name=NombreDeLaMigracion
```

## 📚 Documentación de Referencia

- [Detalle de Arquitectura](./docs/ARCHITECTURE.md)
- [Guía del Desarrollador (Recetas)](./docs/DEVELOPER_GUIDE.md)
- [API Reference](./docs/FULL_API_DOCUMENTATION.md)

---
Al contribuir, aceptas que tu código estará bajo la **Licencia MIT** y que cumples con los estándares de calidad del proyecto.
