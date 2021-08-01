module.exports = {
    env: {
        es6: true,
        node: true,
        jest: true,
    },
    extends: 'eslint:recommended',
    plugins: ['prettier', 'jest'],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
    },
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
    },
    rules: {
        'arrow-parens': ['error', 'as-needed'],
        // indent: ["error", "tab", { SwitchCase: 1 }],
        'comma-dangle': [
            'error',
            {
                arrays: 'always-multiline',
                objects: 'always-multiline',
                imports: 'always-multiline',
                exports: 'always-multiline',
                functions: 'ignore',
            },
        ],
        'linebreak-style': ['error', 'unix'],
        'no-async-promise-executor': 'warn',
        'no-case-declarations': 'off',
        'no-const-assign': 'error',
        'no-console': [
            'off',
            {
                allow: ['warn', 'error', 'info', 'debug'],
            },
        ],
        'no-empty': 0,
        'no-mixed-spaces-and-tabs': 'off',
        'no-redeclare': ['off', { builtinGlobals: true }],
        'no-undef': 'warn',
        'no-unused-vars': [
            'warn',
            { args: 'after-used', argsIgnorePattern: '^_|err' },
        ],
        'no-var': 'error',
        'prettier/prettier': ['error'],
        'prefer-const': ['error', { destructuring: 'all' }],
        // quotes: ['error', 'double'],
        // semi: ['error', 'always'],
    },
}
