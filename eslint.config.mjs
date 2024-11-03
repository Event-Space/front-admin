// eslint.config.mjs
import { defineConfig } from 'eslint';

export default defineConfig({
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended', // Рекомендации ESLint для TypeScript
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser', // Указываем парсер для TypeScript
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json'], // Указываем путь к вашему tsconfig файлу
  },
  plugins: [
    '@typescript-eslint', // Используем плагин для TypeScript
    'prettier',
  ],
  rules: {
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
        singleQuote: true,
        trailingComma: 'es5',
        bracketSpacing: true,
        jsxBracketSameLine: false,
        tabWidth: 2,
        semi: true,
      },
    ],
    '@typescript-eslint/explicit-module-boundary-types': 'off', // Отключаем требование явного возвращаемого типа для функций
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }], // Игнорирование неиспользованных переменных, начинающихся с _
    '@typescript-eslint/no-explicit-any': 'off', // Разрешаем использование типа 'any'
  },
  settings: {
    react: {
      version: 'detect', // Автоматическое определение версии React, если вы используете React
    },
  },
});
