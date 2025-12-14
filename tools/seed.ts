#!/usr/bin/env ts-node
import 'reflect-metadata';
import dataSource from '@shared/database/data-source';
import { StackEntity } from '@features/catalog/entities/stack.entity';
import { TechnologyEntity } from '@features/catalog/entities/technology.entity';

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

async function seedCatalog() {
  const stackRepo = dataSource.getRepository(StackEntity);
  const techRepo = dataSource.getRepository(TechnologyEntity);

  type StackArea = 'front' | 'back' | 'mobile' | 'devops' | 'design';
  const stacks: Array<{
    name: string;
    slug: string;
    area: StackArea;
    description: null;
  }> = [
      { name: 'Frontend', slug: 'frontend', area: 'front', description: null },
      { name: 'Backend', slug: 'backend', area: 'back', description: null },
      { name: 'Mobile', slug: 'mobile', area: 'mobile', description: null },
      { name: 'DevOps', slug: 'devops', area: 'devops', description: null },
      { name: 'Design', slug: 'design', area: 'design', description: null },
    ];

  const technologies = [
    {
      name: 'TypeScript',
      slug: 'typescript',
      website: 'https://www.typescriptlang.org/',
    },
    { name: 'NestJS', slug: 'nestjs', website: 'https://nestjs.com/' },
    { name: 'React', slug: 'react', website: 'https://react.dev/' },
    {
      name: 'PostgreSQL',
      slug: 'postgresql',
      website: 'https://www.postgresql.org/',
    },
    { name: 'Docker', slug: 'docker', website: 'https://www.docker.com/' },
  ];

  // Idempotente por slug
  await stackRepo.upsert(stacks, ['slug']);
  await techRepo.upsert(technologies, ['slug']);

  console.log(
    `Semillas cargadas: ${stacks.length} stacks, ${technologies.length} technologies`,
  );
}

async function main() {
  ensureNotProd();
  await dataSource.initialize();
  try {
    await seedCatalog();
  } finally {
    await dataSource.destroy();
  }
}

main().catch((err) => {
  console.error('Error ejecutando seeds:', err);
  process.exit(1);
});
