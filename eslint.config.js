import globals from 'globals';
import pluginJs from '@eslint/js';
import importPlugin from 'eslint-plugin-import';

export default [
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.jest,
        ...globals.browser,
      },
    },
    plugins: { import: importPlugin },
  },
  {
    rules: {
      'import/extensions': [
        'error',
        {
          js: 'always',
        },
      ],
      'no-console': 'off',
    },
  },
  pluginJs.configs.recommended,
];
