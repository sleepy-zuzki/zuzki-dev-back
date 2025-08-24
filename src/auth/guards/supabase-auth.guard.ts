import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PinoLogger } from 'nestjs-pino';
import { Counter, register } from 'prom-client';
import type { SupabaseJwtPayload } from '../strategies/supabase.strategy';

@Injectable()
export class SupabaseAuthGuard extends AuthGuard('supabase-jwt') {
  private readonly counter: Counter<string>;

  constructor(private readonly logger: PinoLogger) {
    super();
    this.logger.setContext(SupabaseAuthGuard.name);
    const existing = register.getSingleMetric('auth_jwt_requests_total') as
      | Counter<string>
      | undefined;
    this.counter =
      existing ??
      new Counter({
        name: 'auth_jwt_requests_total',
        help: 'Total de resultados de autenticación JWT',
        labelNames: ['status'] as const,
      });
  }

  // Se ejecuta después de la validación de la estrategia.
  // Si hay error o no hay usuario, registramos y lanzamos 401.
  handleRequest(
    err: Error | null,
    user: SupabaseJwtPayload | false,
    info?: string | Error,
  ): SupabaseJwtPayload {
    if (err || !user) {
      this.counter.inc({ status: 'unauthorized' });
      this.logger.warn({ err, info }, 'Acceso no autorizado');
      throw (
        err ||
        new UnauthorizedException(typeof info === 'string' ? info : undefined)
      );
    }
    this.counter.inc({ status: 'success' });
    return user;
  }
}
