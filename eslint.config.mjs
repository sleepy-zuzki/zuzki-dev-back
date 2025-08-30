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
            {
              group: ['@config/*', 'src/config/**', '**/config/**'],
              message:
                'Interfaces no debe importar config interna directamente; delega al composition root.',
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
            // Evitar dependencias cross-cutting y atajos de alias
            {
              group: ['@config/*', '@metrics/*', '@health/*'],
              message:
                'Application no debe depender de config/metrics/health; usa puertos o inyección desde el composition root.',
            },
            {
              group: ['src/config/**', 'src/metrics/**', 'src/health/**'],
              message: 'Application no debe depender de config/metrics/health.',
            },
            {
              group: ['**/config/**', '**/metrics/**', '**/health/**'],
              message: 'Application no debe depender de config/metrics/health.',
            },
            {
              group: ['@app/interfaces/*', '@app/infrastructure/*'],
              message:
                'No usar alias @app para importar Interfaces/Infrastructure en Application.',
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
              group: [
                '**/infrastructure/**',
                '**/interfaces/**',
                '**/application/**',
              ],
              message: 'Domain no depende de otras capas.',
            },
            // Evitar dependencias cross-cutting y atajos de alias
            {
              group: ['@config/*', '@metrics/*', '@health/*'],
              message: 'Domain no debe depender de config/metrics/health.',
            },
            {
              group: ['src/config/**', 'src/metrics/**', 'src/health/**'],
              message: 'Domain no debe depender de config/metrics/health.',
            },
            {
              group: ['**/config/**', '**/metrics/**', '**/health/**'],
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
            {
              group: [
                '**/application/**',
                '**/interfaces/**',
                '**/infrastructure/**',
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
              group: ['**/config/**', '**/metrics/**', '**/health/**'],
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
