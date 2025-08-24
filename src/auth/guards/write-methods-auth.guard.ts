import { ExecutionContext, Injectable } from '@nestjs/common';
import { SupabaseAuthGuard } from './supabase-auth.guard';

@Injectable()
export class WriteMethodsAuthGuard extends SupabaseAuthGuard {
  canActivate(context: ExecutionContext) {
    const req = context
      .switchToHttp()
      .getRequest<Request & { method?: string }>();
    const method = (req?.method || '').toUpperCase();

    // Permitimos libremente métodos de lectura y preflight
    if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') {
      return true;
    }

    // Para creación/edición/borrado requerimos JWT válido
    return super.canActivate(context);
  }
}
