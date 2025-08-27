# Application · Catalog

Responsabilidades:

- Orquestar casos de uso de Catálogo (Technologies, Stacks).
- Mantenerse agnóstico de ORM/framework; depender de puertos tipados.
- Ofrecer mapeos a view models a través de mappers.

Puertos y servicios:

- ports/technology-repository.port.ts: contrato de persistencia para tecnologías.
- ports/stack-repository.port.ts: contrato de persistencia para stacks.
- services/technologies.service.ts y services/stacks.service.ts: CRUD y consultas.
- mappers/technology.mappers.ts y mappers/stack.mappers.ts: dominio -> view.

Reglas de capa:

- Sin imports de infraestructura o entidades ORM.
- Los controladores HTTP consumen los servicios y aplican DTOs/validación en la capa interfaces.
