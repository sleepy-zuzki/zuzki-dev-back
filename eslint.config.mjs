// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs', 'tools/migration-*.js', 'package.json'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  // Reglas globales
  {
    rules: {
      // Calidad y consistencia
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      '@typescript-eslint/consistent-type-imports': 'warn',
      'no-duplicate-imports': 'error',
      'no-console': ['error', { allow: ['warn', 'error'] }],
    },
  },
  // Interfaces (HTTP): no deben importar infraestructura; elevar promesas flotantes
  {
    files: ['src/interfaces/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-floating-promises': 'error',
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            // Evitar infraestructura desde Interfaces
            {
              group: ['@infra/*'],
              message:
                'Interfaces no puede importar desde infrastructure; usa application.',
            },
            {
              group: ['src/infrastructure/**'],
              message:
                'Interfaces no puede importar desde infrastructure; usa application.',
            },
            {
              group: ['**/infrastructure/**'],
              message:
                'Interfaces no puede importar desde infrastructure; usa application.',
            },
            // Evitar entidades/ORM directos
            {
              group: ['typeorm', '@nestjs/typeorm'],
              message: 'No usar ORM directamente en Interfaces.',
            },
          ],
        },
      ],
    },
  },
  // Application: no debe importar Interfaces/Infrastructure; evitar Nest/ORM directo
  {
    files: ['src/application/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'warn',
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            // Bloquear capas externas
            {
              group: ['@interfaces/*'],
              message: 'Application no puede depender de Interfaces.',
            },
            {
              group: ['@infra/*'],
              message:
                'Application no puede depender de Infrastructure; usa Ports/Tokens.',
            },
            {
              group: ['src/interfaces/**', 'src/infrastructure/**'],
              message:
                'Application no puede depender de Interfaces/Infrastructure.',
            },
            {
              group: ['**/interfaces/**', '**/infrastructure/**'],
              message:
                'Application no puede depender de Interfaces/Infrastructure.',
            },
            // Evitar dependencias técnicas directas
            {
              group: ['@nestjs/*'],
              message:
                'Evita dependencias de Nest en Application; usa puertos/abstracciones.',
            },
            {
              group: ['typeorm', '@nestjs/typeorm'],
              message: 'No usar ORM en Application; usa puertos.',
            },
          ],
        },
      ],
    },
  },
  // Domain: no debe depender de frameworks ni de otras capas
  {
    files: ['src/domain/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'warn',
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@nestjs/*'],
              message: 'Domain debe permanecer puro (sin NestJS).',
            },
            {
              group: ['typeorm', '@nestjs/typeorm'],
              message: 'Domain no debe conocer el ORM/persistencia.',
            },
            {
              group: ['@infra/*', '@interfaces/*', '@application/*'],
              message: 'Domain no depende de otras capas.',
            },
            {
              group: [
                'src/infrastructure/**',
                'src/interfaces/**',
                'src/application/**',
              ],
              message: 'Domain no depende de otras capas.',
            },
            {
              group: [
                '**/infrastructure/**',
                '**/interfaces/**',
                '**/application/**',
              ],
              message: 'Domain no depende de otras capas.',
            },
          ],
        },
      ],
    },
  },
  // Infrastructure: puede depender de Application (puertos), no de Interfaces
  {
    files: ['src/infrastructure/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@interfaces/*', 'src/interfaces/**', '**/interfaces/**'],
              message: 'Infrastructure no puede depender de Interfaces.',
            },
          ],
        },
      ],
    },
  },
  // Shared: no debe depender de capas superiores (Application/Interfaces/Infrastructure)
  {
    files: ['src/shared/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@application/*', '@interfaces/*', '@infra/*'],
              message: 'Shared no debe depender de capas superiores.',
            },
            {
              group: [
                'src/application/**',
                'src/interfaces/**',
                'src/infrastructure/**',
              ],
              message: 'Shared no debe depender de capas superiores.',
            },
            {
              group: [
                '**/application/**',
                '**/interfaces/**',
                '**/infrastructure/**',
              ],
              message: 'Shared no debe depender de capas superiores.',
            },
          ],
        },
      ],
    },
  },
);
