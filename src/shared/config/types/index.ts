export type AppConfig = {
  host: string;
  port: number;
  nodeEnv: 'development' | 'production' | 'test';
  logLevel: string;
};

export type AuthConfig = {
  jwtSecret: string;
  jwtTtl: number;
  jwtIssuer: string;
  jwtAudience: string;
  accessTokenTtl: number;
  refreshTokenTtl: number;
  hashDriver: 'argon2' | 'bcrypt';
  loginRateLimitWindow: number;
  loginRateLimitMax: number;
};

export type CacheConfig = {
  ttl: number;
  max: number;
};

export type CloudflareR2Config = {
  endpoint: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  publicUrl: string;
};

export type PostgresSslConfig = boolean | 'require';

export type DatabaseConfig = {
  host: string;
  port: number;
  user: string;
  pass: string;
  dbName: string;
  schema: string;
  sync: boolean;
  logging: boolean;
  ssl: PostgresSslConfig;
};

export type SeedConfig = {
  allowInProduction: boolean;
};
