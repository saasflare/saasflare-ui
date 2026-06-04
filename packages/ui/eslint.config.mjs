// @reviewed
/**
 * Flat ESLint config for @saasflare/ui.
 *
 * Scope: lints `src/` (the published source) for correctness — TypeScript
 * hygiene, the Rules of Hooks, and unknown-DOM-property leaks — while staying
 * green on the existing codebase. Stylistic/opinionated React rules are off
 * (TypeScript already covers prop types; formatting is not enforced here).
 *
 * Build output (`dist/`), generated bundles, and font presets are ignored.
 */
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

export default tseslint.config(
    {
        ignores: ['dist/**', 'node_modules/**', 'fonts/**', '**/*.d.ts'],
    },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ['src/**/*.{ts,tsx}'],
        languageOptions: {
            globals: { ...globals.browser, ...globals.es2021 },
            parserOptions: { ecmaFeatures: { jsx: true } },
        },
        plugins: { react, 'react-hooks': reactHooks },
        settings: { react: { version: 'detect' } },
        rules: {
            ...react.configs.flat.recommended.rules,
            ...react.configs.flat['jsx-runtime'].rules,

            // Correctness — keep as errors.
            'react-hooks/rules-of-hooks': 'error',
            'react/no-unknown-property': 'error',
            '@typescript-eslint/no-explicit-any': 'error',

            // Idiomatic here: empty `interface FooProps extends X {}` creates a
            // named, extendable props type even when it adds no members.
            '@typescript-eslint/no-empty-object-type': 'off',
            // Active so the deliberate `dangerouslySetInnerHTML` disable in
            // code-block.tsx is meaningful (and future sinks get flagged).
            'react/no-danger': 'warn',

            // Signal, not blockers.
            'react-hooks/exhaustive-deps': 'warn',
            'no-console': 'warn',
            '@typescript-eslint/no-unused-vars': [
                'warn',
                { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrors: 'none' },
            ],

            // TypeScript owns these; the React plugin's versions are redundant noise.
            'react/prop-types': 'off',
            'react/display-name': 'off',
            'react/no-unescaped-entities': 'off',
        },
    },
    {
        // Node tooling — build scripts and config files may use the console.
        files: ['scripts/**/*.{js,mjs}', '*.config.{js,mjs,ts}'],
        languageOptions: { globals: { ...globals.node } },
        rules: { 'no-console': 'off' },
    },
);
