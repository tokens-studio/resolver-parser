const studioConfig = require('@tokens-studio/configs/eslint');

module.exports = [
  {
    ignores: ['dist/', 'coverage/'],
  },
  ...studioConfig,
  {
    rules: {
      'sort-imports': 0,
    },
  },
];
