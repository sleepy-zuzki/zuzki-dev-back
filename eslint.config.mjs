// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';

export default tseslint.config(
  {
    ignores: [
      'eslint.config.mjs',
      'tools/migration-*.js',
      'package.json',
      'dist/**',
      'coverage/**',
      'reports/**',
    ],
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
      sourceType: 'module',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  // Reglas globales
  {
    plugins: {
      import: importPlugin,
    },
    settings: {
      'import/resolver': {
        typescript: {
          // Respeta tsconfig paths y proyectos monorepo si aplica
          project: true,
          alwaysTryTypes: true,
        },
        node: {
          extensions: ['.js', '.ts', '.tsx'],
        },
      },
    },
    rules: {
      // Calidad y consistencia
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      '@typescript-eslint/consistent-type-imports': 'warn',

      // Import ergonomics
      'import/no-duplicates': 'error',
      'import/newline-after-import': ['warn', { count: 1 }],
      'import/no-useless-path-segments': ['warn', { noUselessIndex: true }],
      'import/order': [
        'warn',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'object',
            'type',
          ],
          pathGroups: [
            {
              pattern:
                '@{app,application,domain,infra,interfaces,shared,config,metrics,health}/**',
              group: 'internal',
              position: 'after',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],

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
            // Evitar infraestructura específica desde Interfaces (permitir composition)
            {
              group: [
                '@infra/database/*',
                '@infra/security/*',
                '@infra/http/*',
                '@infra/cache/*',
                '@infra/storage/*',
                '@infra/logging/*',
              ],
              message:
                'Interfaces no puede importar infrastructure específica; usa @infra/composition/* o application.',
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
            {
              group: ['@app/infrastructure/*'],
              message:
                'No usar alias @app para importar infrastructure desde Interfaces.',
            },
            // Evitar entidades/ORM directos y config interna
            {
              group: ['typeorm', '@nestjs/typeorm'],
              message: 'No usar ORM directamente en Interfaces.',
            },
            // Permitir @application/* (incluyendo health) pero no @health/* directo
            {
              group: ['@health/*'],
              message:
                'Interfaces no debe usar @health/* directamente; usa @application/health/* en su lugar.',
            },
            {
              group: ['@config/*', 'src/config/**'],
              message:
                'Interfaces no debe importar config interna directamente; delega al composition root.',
            },
          ],
        },
      ],
    },
  },
  // Application Modules: REGLA ESPECÍFICA PRIMERO - pueden importar composition modules y usar @nestjs/common
  {
    files: ['src/application/**/*.application.module.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-floating-promises': 'error',
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            // Solo bloquear interfaces
            {
              group: ['@interfaces/*', 'src/interfaces/**', '**/interfaces/**'],
              message: 'Application Modules no pueden depender de Interfaces.',
            },
            // Bloquear infrastructure específicos (composition está permitido implícitamente)
            {
              group: [
                '@infra/database/*',
                '@infra/security/*',
                '@infra/http/*',
                '@infra/cache/*',
                '@infra/storage/*',
                '@infra/logging/*',
              ],
              message:
                'Application Modules solo pueden importar desde @infra/composition/*.',
            },
            {
              group: ['typeorm', '@nestjs/typeorm'],
              message: 'No usar ORM directamente en Application Modules.',
            },
            {
              group: ['@app/interfaces/*', '@app/infrastructure/*'],
              message: 'No usar alias @app en Application Modules.',
            },
          ],
        },
      ],
    },
  },
  // Application Services y otros: REGLA GENERAL DESPUÉS - excluye Application Modules
  {
    files: ['src/application/**/*.{ts,tsx}'],
    ignores: ['!src/application/**/*.application.module.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/explicit-function-return-type': [
        'error',
        {
          allowExpressions: true,
          allowTypedFunctionExpressions: true,
          allowHigherOrderFunctions: true,
        },
      ],
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            // Bloquear capas externas y dependencias técnicas
            {
              group: [
                '@interfaces/*',
                '@infra/database/*',
                '@infra/security/*',
              ],
              message:
                'Application Services no pueden depender de Interfaces/Infrastructure.',
            },
            {
              group: ['src/interfaces/**', 'src/infrastructure/**'],
              message:
                'Application Services no pueden depender de Interfaces/Infrastructure.',
            },
            {
              group: ['typeorm', '@nestjs/typeorm'],
              message: 'No usar ORM en Application Services; usa puertos.',
            },
            // Evitar dependencias cross-cutting y atajos de alias
            {
              group: ['@config/*', '@metrics/*', '@health/*'],
              message:
                'Application no debe depender de config/metrics/health; usa puertos.',
            },
            {
              group: ['src/config/**', 'src/metrics/**', 'src/health/**'],
              message: 'Application no debe depender de config/metrics/health.',
            },
            // Patrones más específicos para evitar conflictos con interfaces/health
            {
              group: ['src/health/**', 'src/config/**', 'src/metrics/**'],
              message: 'Application no debe depender de config/metrics; usa puertos.',
            },
            {
              group: ['@app/interfaces/*', '@app/infrastructure/*'],
              message:
                'No usar alias @app para importar otras capas en Application.',
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
      '@typescript-eslint/explicit-function-return-type': [
        'error',
        {
          allowExpressions: true,
          allowTypedFunctionExpressions: true,
          allowHigherOrderFunctions: true,
        },
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector: 'Decorator',
          message: 'Domain no debe usar decoradores.',
        },
      ],
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
              group: ['@config/*', '@metrics/*', '@health/*'],
              message: 'Domain no debe depender de config/metrics/health.',
            },
            {
              group: ['src/config/**', 'src/metrics/**', 'src/health/**'],
              message: 'Domain no debe depender de config/metrics/health.',
            },
            {
              group: [
                '@app/application/*',
                '@app/infrastructure/*',
                '@app/interfaces/*',
              ],
              message:
                'No usar alias @app para acceder a otras capas desde Domain.',
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
            {
              group: ['@app/interfaces/*'],
              message:
                'No usar alias @app para importar Interfaces desde Infrastructure.',
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
            // Cross-cutting y atajos @app no permitidos en Shared
            {
              group: ['@config/*', '@metrics/*', '@health/*'],
              message: 'Shared no debe depender de config/metrics/health.',
            },
            {
              group: ['src/config/**', 'src/metrics/**', 'src/health/**'],
              message: 'Shared no debe depender de config/metrics/health.',
            },
            {
              group: [
                '@app/application/*',
                '@app/interfaces/*',
                '@app/infrastructure/*',
              ],
              message:
                'No usar alias @app para acceder a capas superiores desde Shared.',
            },
          ],
        },
      ],
    },
  },
  // Tests (unit y e2e): DX mejorada y dependencias de dev permitidas
  {
    files: [
      '**/*.spec.ts',
      '**/*.test.ts',
      'test/**/*.ts',
      'src/**/*.spec.ts',
      'src/**/*.test.ts',
    ],
    rules: {
      'no-console': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: true,
        },
      ],
    },
  },
  // Composition root / Entrypoints: permitir orquestación de capas
  {
    files: ['src/main.ts', 'src/app.module.ts'],
    rules: {
      'no-restricted-imports': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
    },
  },
);
