import { LoggerService } from '@nestjs/common';
import * as fs from 'node:fs';
import * as path from 'node:path';
import type { LogLevel } from '../../core/models/log-level.type';

export class AppLogger implements LoggerService {
  private readonly baseDir: string;

  constructor(private readonly appName = 'app') {
    this.baseDir = path.resolve(process.cwd(), 'logs');
    this.ensureLogDir();
  }

  log(message: any, context?: string): void {
    this.write('log', message, context);
    console.log(this.formatLine('log', message, context));
  }

  error(message: any, trace?: string, context?: string): void {
    this.write('error', message, context, trace);
    console.error(this.formatLine('error', message, context, trace));
  }

  warn(message: any, context?: string): void {
    this.write('warn', message, context);
    console.warn(this.formatLine('warn', message, context));
  }

  debug(message: any, context?: string): void {
    this.write('debug', message, context);
    if (process.env.NODE_ENV !== 'production') {
      console.debug(this.formatLine('debug', message, context));
    }
  }

  verbose(message: any, context?: string): void {
    this.write('verbose', message, context);
    if (process.env.NODE_ENV !== 'production') {
      console.debug(this.formatLine('verbose', message, context));
    }
  }

  private ensureLogDir(): void {
    if (!fs.existsSync(this.baseDir)) {
      fs.mkdirSync(this.baseDir, { recursive: true });
    }
  }

  private currentDate(): string {
    return new Date().toISOString().slice(0, 10);
  }

  private logFilePath(level: LogLevel): string {
    const date = this.currentDate();
    return path.join(this.baseDir, `${this.appName}-${level}-${date}.log`);
  }

  private formatLine(
    level: LogLevel,
    message: any,
    context?: string,
    trace?: string,
  ): string {
    const ts = new Date().toISOString();
    const ctx = context ? `[${context}]` : '';
    const msg = typeof message === 'string' ? message : JSON.stringify(message);
    const tr = trace ? `\nTRACE: ${trace}` : '';
    return `${ts} ${level.toUpperCase()} ${ctx} ${msg}${tr}`;
  }

  private write(
    level: LogLevel,
    message: any,
    context?: string,
    trace?: string,
  ): void {
    try {
      const line = this.formatLine(level, message, context, trace) + '\n';
      fs.appendFileSync(this.logFilePath(level), line, { encoding: 'utf8' });
    } catch {
      // Evitar que un fallo de escritura tumbe la app
    }
  }
}
