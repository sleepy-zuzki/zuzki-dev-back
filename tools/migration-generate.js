#!/usr/bin/env node
'use strict';

const { spawnSync } = require('child_process');

const [name, ...extraArgs] = process.argv.slice(2);

if (!name) {
  console.error('Uso: pnpm migration:generate <NombreDeMigracion> [opciones]');
  console.error('Ejemplo: pnpm migration:generate SyncPortfolio -- -p');
  process.exit(1);
}

// Ruta destino incluyendo el nombre solicitado.
// TypeORM agregará el prefijo de timestamp automáticamente.
const targetPath = `./src/shared/database/typeorm/migrations/${name}`;

const args = [
  '--env-file=.env',
  '--require',
  'ts-node/register',
  '--require',
  'tsconfig-paths/register',
  './node_modules/typeorm/cli.js',
  '-d',
  './src/shared/database/data-source.ts',
  'migration:generate',
  targetPath,
  // Reenviar argumentos adicionales al CLI (p. ej. --pretty, --dr, etc.)
  ...extraArgs,
];

const result = spawnSync('node', args, { stdio: 'inherit', shell: true });

process.exit(result.status ?? 0);
