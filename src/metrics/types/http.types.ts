/**
 * Interfaces mínimas para HTTP request/response
 * Evitan dependencia directa de Express manteniendo tipado estricto
 */

export interface HttpRequest {
  method?: string;
  path?: string;
  url?: string;
  route?: { path?: string };
}

export interface HttpResponse {
  statusCode?: number;
  setHeader(name: string, value: string | number | string[]): this;
  send(body?: never): this;
}
