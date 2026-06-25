import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: { globals: globals.browser },
    ignores: ['coverage', '**/dist', 'pnpm-lock.yaml', 'pnpm-workspace.yaml'],
  },
  tseslint.configs.recommended,
  eslintConfigPrettier,
]);
