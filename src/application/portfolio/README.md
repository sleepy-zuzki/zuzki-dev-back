# Application · Portfolio

Responsabilidades:

- Orquestar casos de uso de Portafolio (Projects y Files).
- Mantenerse agnóstico de ORM/framework; depender de puertos (ports) tipados.
- Transformaciones a modelos de vista a través de mappers (en application/portfolio/mappers).

Puertos y servicios:

- ports/projects-repository.port.ts: contrato para persistencia de Projects.
- ports/files-repository.port.ts: contrato para persistencia de Files.
- services/projects.service.ts: orquesta creación/actualización de proyectos y setea relaciones.
- services/files.service.ts: operaciones CRUD de archivos.

Orquestación de relaciones (ProjectsService):

- technologyIds:
  - undefined: no toca las relaciones.
  - null o []: limpia todas las tecnologías asociadas.
  - number[]: reemplaza por el conjunto indicado.
- previewImageId:
  - undefined: no toca la asociación.
  - null: elimina la imagen de preview.
  - number: establece el archivo indicado como nueva imagen de preview.

Reglas de capa:

- No importar entidades ni módulos de infraestructura.
- Inyectar puertos a través de tokens en los módulos HTTP.
- Manejo de errores: se delega a capas superiores (HTTP) para excepciones HTTP.
