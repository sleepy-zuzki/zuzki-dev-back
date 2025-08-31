# Guía de Importación de Postman

## Pasos para Importar las Colecciones

### 1. Importar Variables de Entorno

1. Abre Postman
2. Ve a la pestaña "Environments" en la barra lateral izquierda
3. Haz clic en "Import"
4. Selecciona los archivos:
   - `environments/development.postman_environment.json`
   - `environments/production.postman_environment.json`
5. Haz clic en "Import"

### 2. Importar Colecciones

Tienes dos opciones:

#### Opción A: Importar Colección Completa (Recomendado)

1. Haz clic en "Import" en la parte superior
2. Selecciona `Zuzki-Dev-API-Complete.postman_collection.json`
3. Haz clic en "Import"

#### Opción B: Importar Colecciones Modulares

1. Haz clic en "Import"
2. Selecciona todos los archivos del directorio `collections/`
3. Haz clic en "Import"

### 3. Configurar Entorno

1. En la esquina superior derecha, selecciona el entorno "Zuzki Dev - Development"
2. Verifica que las variables estén configuradas correctamente

### 4. Probar la Configuración

1. Ve a la carpeta "🔐 Authentication"
2. Ejecuta el request "Login" con credenciales válidas
3. Verifica que el token se haya guardado automáticamente
4. Prueba cualquier endpoint que requiera autenticación

## Flujo de Trabajo Recomendado

### Primer Uso

1. **Autenticación**: Ejecuta "Login" para obtener el token
2. **Verificación**: Ejecuta "Health Check" para verificar conexión
3. **Exploración**: Prueba los diferentes endpoints según tus necesidades

### Uso Diario

1. Si el token ha expirado, usa "Refresh Token" para renovarlo
2. Para cerrar sesión, usa "Logout"

## Variables de Entorno Disponibles

- `{{baseUrl}}` - URL base de la API
- `{{version}}` - Versión de la API (v1)
- `{{accessToken}}` - Token de acceso (se actualiza automáticamente)
- `{{refreshToken}}` - Token de renovación (se actualiza automáticamente)
- `{{userId}}` - ID del usuario autenticado

## Consejos

- Los scripts automáticos manejan la autenticación
- Los endpoints públicos no requieren token
- Los tokens se guardan automáticamente después del login
- Usa el entorno de desarrollo para pruebas locales
- Usa el entorno de producción para el servidor en vivo

## Solución de Problemas

### Token No Válido

- Ejecuta "Login" nuevamente
- Verifica que las credenciales sean correctas

### Error de Conexión

- Verifica que el servidor esté ejecutándose
- Confirma que la URL base sea correcta
- Revisa los puertos y configuración de red

### Errores 401/403

- Asegúrate de estar autenticado
- Verifica que el token no haya expirado
- Confirma que tu usuario tenga los permisos necesarios
