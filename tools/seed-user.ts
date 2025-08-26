#!/usr/bin/env ts-node
import 'reflect-metadata';
import dataSource from '@infra/database/data-source';
import { UserEntity } from '@infra/database/typeorm/entities/user/user.entity';
import argon2 from 'argon2';

type SeedArgs = {
  email: string;
  password: string;
  roles: string[];
  active: boolean;
  update: boolean;
};

function ensureNotProd() {
  const isProd = process.env.NODE_ENV === 'production';
  const allow = process.env.SEED_ALLOW_IN_PROD === 'true';
  if (isProd && !allow) {
    console.error(
      'Seeding bloqueado en producción. Usa SEED_ALLOW_IN_PROD=true bajo tu propio riesgo.',
    );
    process.exit(1);
  }
}

function parseBoolean(val?: string): boolean {
  if (!val) return true;
  const v = val.toLowerCase();
  if (v === 'true' || v === '1' || v === 'yes' || v === 'on') return true;
  if (v === 'false' || v === '0' || v === 'no' || v === 'off') return false;
  return true;
}

function parseArgs(argv: string[]): SeedArgs {
  const args: Record<string, string> = {};
  for (const part of argv.slice(2)) {
    if (part.startsWith('--')) {
      const eqIdx = part.indexOf('=');
      if (eqIdx > -1) {
        const key = part.slice(2, eqIdx);
        const value = part.slice(eqIdx + 1);
        args[key] = value;
      } else {
        const key = part.slice(2);
        args[key] = 'true';
      }
    }
  }

  const email = args['email'];
  const password = args['password'];
  const roles = (args['roles'] || 'user')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean) || ['user'];
  const active = parseBoolean(args['active'] ?? 'true');
  const update = parseBoolean(args['update'] ?? 'false');

  if (!email) {
    console.error('Falta el parámetro --email=correo@dominio.com');
    process.exit(1);
  }
  if (!password) {
    console.error('Falta el parámetro --password=TuPasswordSeguro');
    process.exit(1);
  }

  return { email, password, roles, active, update };
}

async function upsertUser({
  email,
  password,
  roles,
  active,
  update,
}: SeedArgs): Promise<void> {
  const repo = dataSource.getRepository(UserEntity);

  const existing = await repo.findOne({ where: { email } });
  const passwordHash = await argon2.hash(password, { type: argon2.argon2id });

  if (existing) {
    if (!update) {
      console.log(
        `Usuario ya existe con email=${email}. Usa --update=true para actualizar.`,
      );
      return;
    }
    existing.passwordHash = passwordHash;
    existing.roles = roles;
    existing.isActive = active;
    await repo.save(existing);
    console.log(
      `Usuario actualizado: id=${existing.id} email=${existing.email} roles=[${roles.join(', ')}] activo=${active}`,
    );
  } else {
    const user = repo.create({
      email,
      passwordHash,
      roles,
      isActive: active,
    });
    const saved = await repo.save(user);
    console.log(
      `Usuario creado: id=${saved.id} email=${saved.email} roles=[${roles.join(', ')}] activo=${active}`,
    );
  }
}

async function main() {
  ensureNotProd();
  const params = parseArgs(process.argv);
  await dataSource.initialize();
  try {
    await upsertUser(params);
  } finally {
    await dataSource.destroy();
  }
}

main().catch((err) => {
  console.error('Error ejecutando seed de usuario:', err);
  process.exit(1);
});
