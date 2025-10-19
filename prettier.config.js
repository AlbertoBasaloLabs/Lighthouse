/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
  trailingComma: 'all',
  tabWidth: 2,
  semi: true,
  singleQuote: true,
  printWidth: 100,
  arrowParens: 'always',
  bracketSameLine: true,
  bracketSpacing: true,
  overrides: [
    {
      files: '*.md',
      options: {
        proseWrap: 'always',
      },
    },
  ],
};

export default config;
