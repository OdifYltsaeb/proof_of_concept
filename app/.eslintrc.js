module.exports = {
    extends: ['@thorgate/eslint-config-typescript', 'next/core-web-vitals'],
    parserOptions: {
        project: './tsconfig.json',
    },
    settings: {
        'import/ignore': [
            '^@winston$'
        ],
        'import/resolver': {
            node: {
                paths: [
                    'src'
                ],
            },
        },
    },
    rules: {
        // Allow @winston magic import
        'import/no-unresolved': [
            2,
            {
                ignore: [
                    '^@winston$'
                ],
            },
        ],
    },
};
