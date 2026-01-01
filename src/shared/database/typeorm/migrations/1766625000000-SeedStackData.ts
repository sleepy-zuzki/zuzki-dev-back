import type { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedStackData1766625000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Helper para insertar área y sus tecnologías
    const insertStack = async (
      area: { name: string; slug: string; icon: string },
      techs: {
        name: string;
        slug: string;
        url: string;
        icon: string;
        color: string;
      }[],
    ) => {
      // 1. Insertar Área
      await queryRunner.query(`
        INSERT INTO "stack"."areas" ("name", "slug", "icon_code")
        VALUES ('${area.name}', '${area.slug}', '${area.icon}')
        ON CONFLICT ("slug") DO NOTHING;
      `);

      // 2. Insertar Tecnologías vinculadas al Área
      if (techs.length > 0) {
        const values = techs
          .map(
            (t) =>
              `('${t.name}', '${t.slug}', '${t.url}', '${t.icon}', '${t.color}')`,
          )
          .join(',');

        await queryRunner.query(`
          INSERT INTO "stack"."technologies" ("area_id", "name", "slug", "website_url", "icon_class", "primary_color")
          SELECT a.id, v.name, v.slug, v.url, v.icon, v.color
          FROM "stack"."areas" a
          CROSS JOIN (VALUES ${values}) AS v(name, slug, url, icon, color)
          WHERE a.slug = '${area.slug}'
          ON CONFLICT ("slug") DO NOTHING;
        `);
      }
    };

    // --- 1. Frontend ---
    await insertStack(
      { name: 'Frontend Development', slug: 'frontend', icon: 'monitor' },
      [
        {
          name: 'Angular',
          slug: 'angular',
          url: 'https://angular.dev',
          icon: 'devicon-angularjs-plain',
          color: '#dd0031',
        },
        {
          name: 'React',
          slug: 'react',
          url: 'https://react.dev',
          icon: 'devicon-react-original',
          color: '#61dafb',
        },
        {
          name: 'TypeScript',
          slug: 'typescript',
          url: 'https://www.typescriptlang.org',
          icon: 'devicon-typescript-plain',
          color: '#3178c6',
        },
        {
          name: 'Tailwind CSS',
          slug: 'tailwindcss',
          url: 'https://tailwindcss.com',
          icon: 'devicon-tailwindcss-original',
          color: '#06b6d4',
        },
        {
          name: 'Next.js',
          slug: 'nextjs',
          url: 'https://nextjs.org',
          icon: 'devicon-nextjs-original',
          color: '#000000',
        },
        {
          name: 'Svelte',
          slug: 'svelte',
          url: 'https://svelte.dev',
          icon: 'devicon-svelte-plain',
          color: '#ff3e00',
        },
        {
          name: 'Bun',
          slug: 'bun',
          url: 'https://bun.sh',
          icon: 'devicon-bun-plain',
          color: '#fbf0df',
        },
        {
          name: 'Swiper',
          slug: 'swiper',
          url: 'https://swiperjs.com',
          icon: 'devicon-swiper-plain', // Note: Check if exists, else generic
          color: '#6332f6',
        },
      ],
    );

    // --- 2. Backend ---
    await insertStack(
      { name: 'Backend Development', slug: 'backend', icon: 'server' },
      [
        {
          name: 'NestJS',
          slug: 'nestjs',
          url: 'https://nestjs.com',
          icon: 'devicon-nestjs-plain',
          color: '#e0234e',
        },
        {
          name: 'Node.js',
          slug: 'nodejs',
          url: 'https://nodejs.org',
          icon: 'devicon-nodejs-plain',
          color: '#339933',
        },
        {
          name: 'Python',
          slug: 'python',
          url: 'https://www.python.org',
          icon: 'devicon-python-plain',
          color: '#3776ab',
        },
        {
          name: 'Go',
          slug: 'go',
          url: 'https://go.dev',
          icon: 'devicon-go-original-wordmark',
          color: '#00add8',
        },
        {
          name: 'Flask',
          slug: 'flask',
          url: 'https://flask.palletsprojects.com',
          icon: 'devicon-flask-original',
          color: '#000000',
        },
        {
          name: 'Django',
          slug: 'django',
          url: 'https://www.djangoproject.com',
          icon: 'devicon-django-plain',
          color: '#092e20',
        },
        {
          name: 'Java',
          slug: 'java',
          url: 'https://www.java.com',
          icon: 'devicon-java-plain',
          color: '#007396',
        },
        {
          name: 'Spring',
          slug: 'spring',
          url: 'https://spring.io',
          icon: 'devicon-spring-original',
          color: '#6db33f',
        },
        {
          name: 'Spring Boot',
          slug: 'spring-boot',
          url: 'https://spring.io/projects/spring-boot',
          icon: 'devicon-spring-plain',
          color: '#6db33f',
        },
        {
          name: 'TypeORM',
          slug: 'typeorm',
          url: 'https://typeorm.io',
          icon: 'devicon-typeorm-plain', // Note: Check if exists or use generic
          color: '#fe0709', // TypeORM Red
        },
        {
          name: 'RxJS',
          slug: 'rxjs',
          url: 'https://rxjs.dev',
          icon: 'devicon-rxjs-plain',
          color: '#b7178c',
        },
      ],
    );

    // --- 3. Database ---
    await insertStack(
      { name: 'Database', slug: 'database', icon: 'database' },
      [
        {
          name: 'PostgreSQL',
          slug: 'postgresql',
          url: 'https://www.postgresql.org',
          icon: 'devicon-postgresql-plain',
          color: '#4169e1',
        },
        {
          name: 'MySQL',
          slug: 'mysql',
          url: 'https://www.mysql.com',
          icon: 'devicon-mysql-plain',
          color: '#4479a1',
        },
        {
          name: 'MongoDB',
          slug: 'mongodb',
          url: 'https://www.mongodb.com',
          icon: 'devicon-mongodb-plain',
          color: '#47a248',
        },
        {
          name: 'Redis',
          slug: 'redis',
          url: 'https://redis.io',
          icon: 'devicon-redis-plain',
          color: '#d82c20',
        },
      ],
    );

    // --- 4. DevOps & Cloud ---
    await insertStack(
      { name: 'DevOps & Cloud', slug: 'devops', icon: 'cloud' },
      [
        {
          name: 'Docker',
          slug: 'docker',
          url: 'https://www.docker.com',
          icon: 'devicon-docker-plain',
          color: '#2496ed',
        },
        {
          name: 'AWS',
          slug: 'aws',
          url: 'https://aws.amazon.com',
          icon: 'devicon-amazonwebservices-original',
          color: '#ff9900',
        },
        {
          name: 'Google Cloud',
          slug: 'gcp',
          url: 'https://cloud.google.com',
          icon: 'devicon-googlecloud-plain',
          color: '#4285f4',
        },
        {
          name: 'Azure',
          slug: 'azure',
          url: 'https://azure.microsoft.com',
          icon: 'devicon-azure-plain',
          color: '#007fff',
        },
        {
          name: 'Kubernetes',
          slug: 'kubernetes',
          url: 'https://kubernetes.io',
          icon: 'devicon-kubernetes-plain',
          color: '#326ce5',
        },
        {
          name: 'Terraform',
          slug: 'terraform',
          url: 'https://www.terraform.io',
          icon: 'devicon-terraform-plain',
          color: '#7b42bc',
        },
        {
          name: 'Ansible',
          slug: 'ansible',
          url: 'https://www.ansible.com',
          icon: 'devicon-ansible-plain',
          color: '#ee0000',
        },
        {
          name: 'GitLab',
          slug: 'gitlab',
          url: 'https://about.gitlab.com',
          icon: 'devicon-gitlab-plain',
          color: '#fc6d26',
        },
        {
          name: 'Cloudflare',
          slug: 'cloudflare',
          url: 'https://www.cloudflare.com',
          icon: 'devicon-cloudflare-plain',
          color: '#f38020',
        },
        {
          name: 'Wrangler',
          slug: 'wrangler',
          url: 'https://developers.cloudflare.com/workers/wrangler/',
          icon: 'devicon-cloudflare-plain', // Sharing icon or CLI generic
          color: '#f38020',
        },
      ],
    );

    // --- 5. Tools ---
    await insertStack(
      { name: 'Tools & Workflow', slug: 'tools', icon: 'tool' },
      [
        {
          name: 'Git',
          slug: 'git',
          url: 'https://git-scm.com',
          icon: 'devicon-git-plain',
          color: '#f05032',
        },
        {
          name: 'Postman',
          slug: 'postman',
          url: 'https://www.postman.com',
          icon: 'devicon-postman-plain',
          color: '#ff6c37',
        },
        {
          name: 'Figma',
          slug: 'figma',
          url: 'https://www.figma.com',
          icon: 'devicon-figma-plain',
          color: '#f24e1e',
        },
        {
          name: 'Jest',
          slug: 'jest',
          url: 'https://jestjs.io',
          icon: 'devicon-jest-plain',
          color: '#c21325',
        },
        {
          name: 'ESLint',
          slug: 'eslint',
          url: 'https://eslint.org',
          icon: 'devicon-eslint-plain',
          color: '#4b32c3',
        },
        {
          name: 'Prettier',
          slug: 'prettier',
          url: 'https://prettier.io',
          icon: 'devicon-prettier-plain', // Note: Often distinct, sometimes generic code icon
          color: '#f7b93e',
        },
        {
          name: 'Husky',
          slug: 'husky',
          url: 'https://typicode.github.io/husky/',
          icon: 'devicon-git-plain', // Fallback as Husky doesn't have a standard devicon usually. Or use custom. I'll use git for now or skip icon.
          color: '#000000',
        },
        {
          name: 'pnpm',
          slug: 'pnpm',
          url: 'https://pnpm.io',
          icon: 'devicon-pnpm-plain',
          color: '#f69220',
        },
        {
          name: 'Karma',
          slug: 'karma',
          url: 'https://karma-runner.github.io',
          icon: 'devicon-karma-plain',
          color: '#52c8b0',
        },
        {
          name: 'Jasmine',
          slug: 'jasmine',
          url: 'https://jasmine.github.io',
          icon: 'devicon-jasmine-plain',
          color: '#8a4182',
        },
      ],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const areas = ['frontend', 'backend', 'database', 'devops', 'tools'];
    const areasList = areas.map((s) => `'${s}'`).join(',');

    // Borramos primero las tecnologías (aunque hay cascade, es más seguro explícito)
    await queryRunner.query(`
      DELETE FROM "stack"."technologies"
      WHERE "area_id" IN (
        SELECT id FROM "stack"."areas" WHERE slug IN (${areasList})
      );
    `);

    // Borramos las áreas
    await queryRunner.query(`
      DELETE FROM "stack"."areas" WHERE slug IN (${areasList});
    `);
  }
}
