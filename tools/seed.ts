#!/usr/bin/env ts-node
import 'reflect-metadata';
import { StackAreaEntity } from '@features/stack/entities/area.entity';
import { StackTechnologyEntity } from '@features/stack/entities/technology.entity';
import dataSource from '@shared/database/data-source';

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
  const areaRepo = dataSource.getRepository(StackAreaEntity);
  const techRepo = dataSource.getRepository(StackTechnologyEntity);

  const areasData = [
    { name: 'Frontend', slug: 'frontend', iconCode: 'monitor' },
    { name: 'Backend', slug: 'backend', iconCode: 'server' },
    { name: 'Mobile', slug: 'mobile', iconCode: 'smartphone' },
    { name: 'DevOps', slug: 'devops', iconCode: 'cloud' },
    { name: 'Design', slug: 'design', iconCode: 'pen-tool' },
  ];

  const savedAreas: StackAreaEntity[] = [];

  for (const area of areasData) {
    let entity = await areaRepo.findOneBy({ slug: area.slug });
    if (!entity) {
      entity = areaRepo.create(area);
      await areaRepo.save(entity);
    }
    savedAreas.push(entity);
  }

  const frontend = savedAreas.find((a) => a.slug === 'frontend');
  const backend = savedAreas.find((a) => a.slug === 'backend');
  const devops = savedAreas.find((a) => a.slug === 'devops');

  if (!frontend || !backend || !devops) return;

  const technologies = [
    {
      name: 'TypeScript',
      slug: 'typescript',
      websiteUrl: 'https://www.typescriptlang.org/',
      area: frontend,
    },
    {
      name: 'NestJS',
      slug: 'nestjs',
      websiteUrl: 'https://nestjs.com/',
      area: backend,
    },
    {
      name: 'React',
      slug: 'react',
      websiteUrl: 'https://react.dev/',
      area: frontend,
    },
    {
      name: 'PostgreSQL',
      slug: 'postgresql',
      websiteUrl: 'https://www.postgresql.org/',
      area: backend,
    },
    {
      name: 'Docker',
      slug: 'docker',
      websiteUrl: 'https://www.docker.com/',
      area: devops,
    },
  ];

  for (const tech of technologies) {
    const exists = await techRepo.findOneBy({ slug: tech.slug });
    if (!exists) {
      await techRepo.save(techRepo.create(tech));
    }
  }
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
