import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

import { JwtAuthGuard } from './jwt-auth.guard';

@Injectable()
export class WriteMethodsAuthGuard extends JwtAuthGuard {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // Verificamos si la ruta está marcada como pública
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const req = context
      .switchToHttp()
      .getRequest<Request & { method?: string }>();
    const method = (req?.method || '').toUpperCase();
    const noAuthMethods = ['GET', 'HEAD', 'OPTIONS'];

    // Permitimos libremente métodos de lectura y preflight
    if (noAuthMethods.includes(method)) {
      return true;
    }

    // Para creación/edición/borrado requerimos JWT válido
    return super.canActivate(context);
  }
}
