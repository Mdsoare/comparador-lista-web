import js from '@eslint/js';
import globals from 'globals';

export default [
  // 1. Aplica as regras recomendadas base do ESLint
  js.configs.recommended,

  // 2. Configurações específicas e regras estritas para o projeto
  {
    files: ['assets/js/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      'no-undef': 'error',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-eval': 'error',
      'no-implied-eval': 'error',
      semi: ['error', 'always'],
      quotes: ['warn', 'single'],
      eqeqeq: ['error', 'always'],
    },
  },
];