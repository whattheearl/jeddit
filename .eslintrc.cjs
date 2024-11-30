/** @type { import("eslint").Linter.Config } */
module.exports = {
    ignores: [
        '.DS_Store',
        'node_modules',
        'scripts',
        '**/lib/components/ui/*',
        '**/excalidraw*',
        '/build',
        '/.svelte-kit',
        '/package',
        '.env',
        '.env.*',
        '!.env.example',
        'package-lock.json'
    ],
    root: true,
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:svelte/recommended',
        'prettier'
    ],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    parserOptions: {
        sourceType: 'module',
        ecmaVersion: 2020,
        extraFileExtensions: ['.svelte']
    },
    env: {
        browser: true,
        es2017: true,
        node: true
    },
    overrides: [
        {
            files: ['*.svelte'],
            parser: 'svelte-eslint-parser',
            parserOptions: {
                parser: '@typescript-eslint/parser'
            }
        }
    ]
};
