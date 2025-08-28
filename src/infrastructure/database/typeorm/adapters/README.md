# adapters por feature

Este directorio contiene los adapters de infraestructura (TypeORM) para cada feature.
Para facilitar la organización y los imports, se proveen "barrels" (index.ts) por feature:

- auth/
- users/
- catalog/
- health/
- portfolio/

Cómo usar (recomendado):

- Importa desde el barrel del feature en lugar de rutas sueltas de archivos.

Ejemplos:
