import { Injectable } from '@nestjs/common';
import type { TlsOptions } from 'node:tls';

@Injectable()
export class ConfigurationService {
  getString(name: string, defaultValue?: string): string {
    const value = process.env[name];
    if (value === undefined || value === null || value === '') {
      if (defaultValue !== undefined) return defaultValue;
      throw new Error(`Missing environment variable: ${name}`);
    }
    return value;
  }

  getNumber(name: string, defaultValue?: number): number {
    const raw = process.env[name];
    if (raw === undefined || raw === null || raw === '') {
      if (defaultValue !== undefined) return defaultValue;
      throw new Error(`Missing numeric environment variable: ${name}`);
    }
    const parsed = Number(raw);
    if (Number.isNaN(parsed)) {
      throw new Error(`Invalid number for environment variable ${name}: "${raw}"`);
    }
    return parsed;
  }

  getBoolean(name: string, defaultValue?: boolean): boolean {
    const raw = process.env[name];
    if (raw === undefined) {
      if (defaultValue !== undefined) return defaultValue;
      return false;
    }
    const v = raw.toLowerCase();
    if (v === 'true' || v === '1' || v === 'yes' || v === 'on') return true;
    if (v === 'false' || v === '0' || v === 'no' || v === 'off') return false;
    // Cualquier otro valor no vacío lo consideramos true
    return true;
  }

  // Regresa el valor adecuado para la opción "ssl" de TypeORM: boolean | TlsOptions
  getPostgresSsl(): boolean | TlsOptions {
    const sslEnv = process.env.POSTGRES_SSL?.toLowerCase();
    if (!sslEnv || sslEnv === 'false' || sslEnv === '0') {
      return false;
    }
    if (sslEnv === 'require') {
      return { rejectUnauthorized: false };
    }
    return true;
  }
}
