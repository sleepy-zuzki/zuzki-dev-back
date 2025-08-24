import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { MetricsService } from './metrics.service';

function hrtimeToSeconds(hr: [number, number]): number {
  return hr[0] + hr[1] / 1e9;
}

@Injectable()
export class HttpMetricsInterceptor implements NestInterceptor {
  constructor(private readonly metrics: MetricsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const start = process.hrtime();
    const http = context.switchToHttp();
    const req = http.getRequest<Request>();
    const res = http.getResponse<Response>();

    const method = (req.method || 'GET').toUpperCase();
    // route.path está solo si hay coincidencia de ruta; si no, usar path/url
    const route = (req as any).route?.path || req.path || req.url || 'unknown';

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
      catchError((err, caught) => {
        record(err?.status || err?.statusCode || res.statusCode || 500);
        throw err;
      }),
    );
  }
}
