#!/usr/bin/env node
'use strict';

const { spawnSync } = require('child_process');

const name = process.argv[2];

if (!name) {
  console.error('Uso: pnpm migration:create <NombreDeMigracion>');
  console.error('Ejemplo: pnpm migration:create InitPortfolioSchema');
  process.exit(1);
}

// Ruta destino incluyendo el nombre solicitado.
// TypeORM agregará el prefijo de timestamp automáticamente.
const targetPath = `./src/shared/database/typeorm/migrations/${name}`;

const result = spawnSync(
  'node',
  [
    '--env-file=.env',
    '--require',
    'ts-node/register',
    '--require',
    'tsconfig-paths/register',
    './node_modules/typeorm/cli.js',
    'migration:create',
    targetPath,
  ],
  { stdio: 'inherit', shell: true },
);

process.exit(result.status ?? 0);
