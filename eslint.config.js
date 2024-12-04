const antfu = require('@antfu/eslint-config').default

module.exports = antfu(
  {
    stylistic: {
      'indent': 2,
      'quotes': 'single',
      'max-len': 80,
    },
    typescript: true,
  },
  {
    rules: {
      'no-console': 'off',
      'unused-imports/no-unused-vars': 'warn',
      'unused-imports/no-unused-imports': 'warn',
      'no-template-curly-in-string': 'off',
      // 'no-unused-imports': 'error',

      'ts/consistent-type-imports': 'off',
      'node/prefer-global/process': 'off',
      'node/prefer-global/buffer': 'off',
      'regexp/no-super-linear-backtracking': 'off',
      'regexp/no-contradiction-with-assertion': 'off',
      'ts/no-unused-expressions': 'warn',
      'style/brace-style': ['error', '1tbs'],
      'style/max-len': ['error', { code: 120, ignoreStrings: true }],
    },
  },
)
