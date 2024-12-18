/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */

const config = {
  tabWidth: 2,
  semi: false,
  printWidth: 130,
  singleQuote: true,
  trailingComma: 'all',
  bracketSpacing: true,
  jsxSingleQuote: true,
  proseWrap: 'preserve',
  arrowParens: 'always',
  quoteProps: 'as-needed',
  htmlWhitespaceSensitivity: 'strict',
  embeddedLanguageFormatting: 'auto',

  // Plugins for additional functionality
  plugins: ['@trivago/prettier-plugin-sort-imports'],

  // Import sorting options
  importOrderSortSpecifiers: true,
  importOrder: ['<THIRD_PARTY_MODULES>', '^types$', '^[./]'],
}

export default config
