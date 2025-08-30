# Checklist de Pull Request

## Resumen

- [ ] Descripción clara del cambio y motivación.
- [ ] Impacto: endpoints/entidades afectadas.
- [ ] ¿Requiere migración de base de datos? Sí/No (si Sí, detallar).

## Calidad de código

- [ ] Compila sin errores (`pnpm build`).
- [ ] Lint y formato aplicados (`pnpm lint`).
- [ ] Sin `any` innecesarios y tipado estricto respetado.
- [ ] Sin `console.log` en producción (usar Logger).

## Arquitectura

- [ ] Cumple reglas de arquitectura hexagonal (.aiassistant/rules/hexagonal_architecture_rules.md).
- [ ] Interfaces NO importan infraestructura directamente.
- [ ] Services de Application no dependen de frameworks/librerías técnicas.
- [ ] Wiring de infraestructura ↔ application centralizado en módulos de Composition.

## Seguridad y versionado

- [ ] No se exponen secretos/credenciales en el código.
- [ ] Validaciones de DTO en Interfaces con class-validator.
- [ ] Errores mapeados a excepciones HTTP coherentes.
- [ ] Controladores declaran versión correcta y siguen el prefijo de API vigente.
- [ ] Endpoints protegidos por autenticación global, con uso del decorador público cuando corresponda.

## Pruebas

- [ ] Tests unitarios relevantes añadidos/actualizados (Application y Interfaces).
- [ ] Tests de integración focalizados en adaptadores críticos (si aplica).
- [ ] Todos los tests en verde (`pnpm test`).

## Documentación

- [ ] Documentación/README actualizados cuando hay cambios arquitectónicos o de contratos.
- [ ] Ejemplos y notas de uso si es necesario.

## Otros

- [ ] Sin nuevas dependencias (o justificadas con alternativas y plan de rollback).
- [ ] Revisión de imports no usados y limpieza general.
