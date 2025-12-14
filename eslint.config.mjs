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
                '@{features,shared,config,metrics,health}/**',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: 'src/**',
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
  // Shared: no debe depender de features ni del root de la aplicación
  {
    files: ['src/shared/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                'src/features/**',
                '@features/*',
                'src/app.module.ts',
                'src/main.ts',
              ],
              message:
                'Shared no debe depender de Features ni de la aplicación principal.',
            },
          ],
        },
      ],
    },
  },
  // Features: Pueden importar @shared, libs externas, etc.
  // Evitamos que importen el root para no crear ciclos.
  {
    files: ['src/features/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['src/app.module.ts', 'src/main.ts'],
              message: 'Features no deben importar el root de la aplicación.',
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
  // Composition root / Entrypoints: permitir todo
  {
    files: ['src/main.ts', 'src/app.module.ts'],
    rules: {
      'no-restricted-imports': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
    },
  },
);