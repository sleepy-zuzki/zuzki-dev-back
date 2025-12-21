import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedCatalogData1766315036202 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // ---------------------------------------------------------
    // 1. Insertar Tipos de Catálogo (Catalog Types)
    // ---------------------------------------------------------
    // Los nombres de los tipos también los pongo en español para que en el admin se vean bien.
    await queryRunner.query(`
      INSERT INTO "catalog"."types" ("name", "slug") VALUES
      ('Categoría de Proyecto', 'project-category'),
      ('Estado del Proyecto', 'project-status'),
      ('Tipo de Proyecto', 'project-type'),
      ('Categoría de Blog', 'blog-category'),
      ('Asunto de Contacto', 'contact-subject'),
      ('Contexto de Archivo', 'file-context')
      ON CONFLICT ("id") DO NOTHING;
    `);

    // ---------------------------------------------------------
    // 2. Insertar Items por Categoría
    // ---------------------------------------------------------

    const insertItems = async (typeSlug: string, items: { name: string; slug: string }[]) => {
      const values = items
        .map((item) => `('${item.name}', '${item.slug}')`)
        .join(',');

      await queryRunner.query(`
        INSERT INTO "catalog"."items" ("type_id", "name", "slug")
        SELECT id, name, slug FROM (
          VALUES ${values}
        ) AS items(name, slug),
        (SELECT id FROM "catalog"."types" WHERE slug = '${typeSlug}') AS type_id
        ON CONFLICT DO NOTHING;
      `);
    };

    // --- A. Categoría de Proyecto ---
    await insertItems('project-category', [
      { name: 'Desarrollo Web', slug: 'web-development' },
      { name: 'Aplicaciones Móviles', slug: 'mobile-app' },
      { name: 'Diseño UI/UX', slug: 'ui-ux-design' },
      { name: 'DevOps y Cloud', slug: 'devops-cloud' },
      { name: 'Ciencia de Datos', slug: 'data-science' },
    ]);

    // --- B. Estado del Proyecto ---
    await insertItems('project-status', [
      { name: 'En Progreso', slug: 'in-progress' },
      { name: 'Completado', slug: 'completed' },
      { name: 'En Mantenimiento', slug: 'maintenance' },
      { name: 'Archivado', slug: 'archived' },
      { name: 'Concepto / MVP', slug: 'mvp' },
    ]);

    // --- C. Tipo de Proyecto ---
    await insertItems('project-type', [
      { name: 'Proyecto Personal', slug: 'personal' },
      { name: 'Freelance / Cliente', slug: 'freelance' },
      { name: 'Corporativo / Tiempo Completo', slug: 'corporate' },
      { name: 'Open Source', slug: 'open-source' },
    ]);

    // --- D. Categoría de Blog ---
    await insertItems('blog-category', [
      { name: 'Tutorial', slug: 'tutorial' },
      { name: 'Arquitectura de Software', slug: 'architecture' },
      { name: 'Carrera y Soft Skills', slug: 'career' },
      { name: 'Noticias Tech', slug: 'news' },
      { name: 'Tips y Trucos', slug: 'tips' },
    ]);

    // --- E. Asunto de Contacto ---
    await insertItems('contact-subject', [
      { name: 'Consulta de Proyecto', slug: 'project-inquiry' },
      { name: 'Oportunidad Laboral', slug: 'job-opportunity' },
      { name: 'Mentoría', slug: 'mentorship' },
      { name: 'Consulta General', slug: 'general' },
    ]);

    // --- F. Contexto de Archivo (Aquí están tus carruseles) ---
    await insertItems('file-context', [
      { name: 'Avatar / Perfil', slug: 'avatar' },
      { name: 'Imagen de Portada', slug: 'cover' },       
      { name: 'Slide Principal (Hero)', slug: 'hero-slide' }, // Para tu carrousel Home
      { name: 'Imagen de Galería', slug: 'gallery' },         // Para carrousels internos
      { name: 'Documento / Adjunto', slug: 'document' },
      { name: 'Video', slug: 'video' },
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const targetSlugs = [
      'project-category',
      'project-status',
      'project-type',
      'blog-category',
      'contact-subject',
      'file-context'
    ].map(s => `'${s}'`).join(',');

    await queryRunner.query(`
      DELETE FROM "catalog"."items" 
      WHERE "type_id" IN (
        SELECT id FROM "catalog"."types" WHERE slug IN (${targetSlugs})
      );
    `);

    await queryRunner.query(`
      DELETE FROM "catalog"."types" WHERE slug IN (${targetSlugs});
    `);
  }
}