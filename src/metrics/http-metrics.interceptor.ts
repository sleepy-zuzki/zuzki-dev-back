import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

import { MetricsService } from './metrics.service';

import type { Request, Response } from 'express';

function hrtimeToSeconds(hr: [number, number]): number {
  return hr[0] + hr[1] / 1e9;
}

function getStatusFromError(e: unknown): number | undefined {
  if (typeof e === 'object' && e !== null) {
    const maybe = e as { status?: unknown; statusCode?: unknown };
    if (typeof maybe.status === 'number') return maybe.status;
    if (typeof maybe.statusCode === 'number') return maybe.statusCode;
  }
  return undefined;
}

@Injectable()
export class HttpMetricsInterceptor implements NestInterceptor {
  constructor(private readonly metrics: MetricsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const start = process.hrtime();
    const http = context.switchToHttp();
    const req = http.getRequest<Request>();
    const res = http.getResponse<Response>();

    const method = (req.method || 'GET').toUpperCase();

    // Evitar acceder a req.route sin usar any/unknown, usando aserción estructural tipada
    type RouteLike = { path?: string };
    const maybeRoute: RouteLike | undefined = (req as { route?: RouteLike })
      .route;
    let route = 'unknown';
    if (
      typeof maybeRoute === 'object' &&
      maybeRoute !== null &&
      typeof maybeRoute.path === 'string'
    ) {
      route = (maybeRoute as { path: string }).path;
    } else if (typeof req.path === 'string' && req.path.length > 0) {
      route = req.path;
    } else if (typeof req.url === 'string') {
      route = req.url;
    }

    const record = (status: number) => {
      const duration = hrtimeToSeconds(process.hrtime(start));
      const labels = {
        method,
        route,
        status_code: String(status),
      };
      this.metrics.httpRequestsTotal.inc(labels, 1);
      this.metrics.httpRequestDuration.observe(labels, duration);
    };

    return next.handle().pipe(
      tap(() => record(res.statusCode || 200)),
      catchError((err) => {
        const status = getStatusFromError(err) ?? res.statusCode ?? 500;
        record(status);
        const errorToThrow =
          err instanceof Error ? err : new Error(String(err));
        return throwError(() => errorToThrow);
      }),
    );
  }
}
