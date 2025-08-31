# Colecciones de Postman para Zuzki Dev Back

Este directorio contiene las colecciones de Postman para probar todos los endpoints de la API de Zuzki Dev Back.

## ⚠️ **IMPORTANTE - REGLA DE SINCRONIZACIÓN AUTOMÁTICA**

### 📋 **REGLA OBLIGATORIA**

**Estos archivos se actualizan automáticamente cada vez que se crea o elimina un endpoint en cualquier controlador.**

- ✅ **NO modifiques manualmente** los archivos JSON de este directorio
- ✅ **Los cambios se generan automáticamente** mediante hooks de Git
- ✅ **Cualquier modificación manual será sobrescrita** en el próximo commit
- ✅ **Si necesitas personalizar**, edita la configuración en `tools/postman-sync/config/`

### 🔄 Proceso Automático

1. **Desarrollador modifica controlador** → Agrega/elimina endpoint
2. **Git commit ejecutado** → Pre-commit hook detecta cambios
3. **Validación automática** → Verifica consistencia de endpoints
4. **Sincronización forzada** → Actualiza archivos de Postman
5. **Commit completado** → Post-commit agrega archivos actualizados

### 🚨 Si algo sale mal

- Revisa los logs en `tools/postman-sync/logs/errors.log`
- Ejecuta `pnpm run postman:validate` para verificar estado
- Ejecuta `pnpm run postman:sync` para forzar sincronización

## Estructura de Archivos

- `environments/` - Variables de entorno para diferentes ambientes
- `collections/` - Colecciones organizadas por módulo (**AUTO-GENERADAS**)
- `Zuzki-Dev-API-Complete.postman_collection.json` - Colección completa (**AUTO-GENERADA**)

## Cómo Importar

1. Abre Postman
2. Haz clic en "Import" (Importar)
3. Arrastra y suelta los archivos `.json` o selecciona "Choose Files"
4. Importa primero los ambientes (`environments/`)
5. Luego importa las colecciones (`collections/`)

## Variables de Entorno

### Development

- `baseUrl`: http://localhost:3000/api
- `version`: v1
- `accessToken`: (se establece automáticamente después del login)

### Production

- `baseUrl`: https://api.zuzki-dev.com/api
- `version`: v1
- `accessToken`: (se establece automáticamente después del login)

## Autenticación

La mayoría de endpoints requieren autenticación JWT. Los endpoints de autenticación (login, refresh) tienen scripts que automáticamente guardan el token en las variables de entorno.

## Endpoints Disponibles

### Autenticación (`/api/v1/auth`)

- POST `/login` - Iniciar sesión
- POST `/refresh` - Renovar token
- POST `/logout` - Cerrar sesión

### Health Check (`/api/v1/health`)

- GET `/` - Verificar estado de la aplicación

### Usuarios (`/api/v1/users`)

- GET `/:id` - Obtener usuario por ID
- POST `/` - Crear usuario

### Proyectos (`/api/v1/portfolio/projects`)

- GET `/` - Listar proyectos
- GET `/:slug` - Obtener proyecto por slug
- POST `/` - Crear proyecto
- PATCH `/:id` - Actualizar proyecto
- DELETE `/:id` - Eliminar proyecto

### Archivos (`/api/v1/portfolio/files`)

- GET `/` - Listar archivos
- GET `/:id` - Obtener archivo por ID
- POST `/` - Crear archivo
- PATCH `/:id` - Actualizar archivo
- DELETE `/:id` - Eliminar archivo

### Tecnologías (`/api/v1/catalog/technologies`)

- GET `/` - Listar tecnologías
- GET `/:slug` - Obtener tecnología por slug
- POST `/` - Crear tecnología
- PATCH `/:id` - Actualizar tecnología
- DELETE `/:id` - Eliminar tecnología

### Stacks (`/api/v1/catalog/stacks`)

- GET `/` - Listar stacks
- GET `/:slug` - Obtener stack por slug
- POST `/` - Crear stack
- PATCH `/:id` - Actualizar stack
- DELETE `/:id` - Eliminar stack

### Métricas (`/metrics`)

- GET `/` - Obtener métricas de Prometheus

## Notas Importantes

- Los endpoints públicos no requieren autenticación
- Los endpoints privados requieren el header `Authorization: Bearer <token>`
- Los scripts automáticos manejan la autenticación en los endpoints correspondientes
- Se incluyen ejemplos de datos de prueba en cada request
