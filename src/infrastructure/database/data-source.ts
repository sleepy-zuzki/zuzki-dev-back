import 'reflect-metadata';
import { DataSource } from 'typeorm';

function parseSsl(val?: string) {
  if (!val) return undefined;
  const v = val.toLowerCase();
  if (v === 'true' || v === '1') return true;
  if (v === 'false' || v === '0') return false;
  if (v === 'require') return { rejectUnauthorized: false };
  return undefined;
}

// Log seguro para CLI/migraciones (no expone secretos)
(() => {
  const safeVal = (v?: string) => (v ? '***' : 'undefined');
  // eslint-disable-next-line no-console
  console.log('[DB Init][CLI] Configuración de conexión', {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: Number(process.env.POSTGRES_PORT || 5432),
    database: process.env.POSTGRES_DB || 'postgres',
    schema: process.env.POSTGRES_SCHEMA || 'portfolio',
    ssl: process.env.POSTGRES_SSL || 'false',
    usernameDefined: Boolean(process.env.POSTGRES_USER),
    passwordDefined: Boolean(process.env.POSTGRES_PASSWORD),
    username: safeVal(process.env.POSTGRES_USER),
    password: safeVal(process.env.POSTGRES_PASSWORD),
  });
})();

export default new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: Number(process.env.POSTGRES_PORT || 5432),
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  database: process.env.POSTGRES_DB || 'postgres',
  schema: process.env.POSTGRES_SCHEMA || 'portfolio',
  entities: ['src/infrastructure/database/typeorm/entities/**/*.entity.ts'],
  migrations: ['src/infrastructure/database/typeorm/migrations/**/*.ts'],
  synchronize: false,
  logging: process.env.TYPEORM_LOGGING === 'true',
  ssl: parseSsl(process.env.POSTGRES_SSL),
});
