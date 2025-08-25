# Estructura de carpetas propuesta (NestJS + TypeORM)

Objetivo: r por dominio: cada feature como un módulo autocontenido (controllers, services, dtos, guards, etc.).

- Dependencias hacia “dentro”: los módulos no deben depender entre sí salvo mediante interfaces públicas y exports explícitos.
- Transversal minimalista: concentrar utilidades y building blocks de NestJS en `common/` y capacidades de plataforma en `core/`.
- Infraestructura separada: integraciones externas (correo, colas, storage, terceros) en `integrations/`.
- Testing claro: separar unit y e2e; opcionalmente co-localizar pruebas pequeñas dentro del módulo.

Árbol recomendado
