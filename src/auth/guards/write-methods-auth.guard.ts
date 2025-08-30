import { ExecutionContext, Injectable } from '@nestjs/common';

import { JwtAuthGuard } from './jwt-auth.guard';

@Injectable()
export class WriteMethodsAuthGuard extends JwtAuthGuard {
  canActivate(context: ExecutionContext) {
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
