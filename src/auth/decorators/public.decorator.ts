import { type CustomDecorator, SetMetadata } from '@nestjs/common';

/**
 * Clave de metadata para marcar rutas como públicas (sin autenticación).
 */
export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Decorador para indicar que un endpoint no requiere autenticación.
 * Un guard global debe verificar esta metadata y omitir la autenticación si está presente.
 */
export const Public = (): CustomDecorator<string> =>
  SetMetadata(IS_PUBLIC_KEY, true);
