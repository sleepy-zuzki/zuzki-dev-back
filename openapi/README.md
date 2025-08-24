# OpenAPI (spec modular)

Comandos disponibles (usando pnpm):

- Generar bundle YAML:
  pnpm openapi:bundle

- Generar bundle JSON:
  pnpm openapi:bundle:json

Entradas y salidas:

- Entrada: openapi/openapi.yaml (índice con $ref a paths/components).
- Salidas:
  - YAML: openapi/bundle.yaml
  - JSON: openapi/bundle.json

Notas:

- Asegúrate de mantener las rutas relativas correctas en los $ref.
- El bundle se utiliza para distribuir o publicar la especificación en una sola pieza (por ejemplo, Swagger UI, Redoc, etc.).
