import baseConfig from "../prettier.config.mjs"

/**
 * @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions &
 *        import("@ianvs/prettier-plugin-sort-imports").PluginConfig}
 */
const config = {
  ...baseConfig,
  arrowParens: "always",
  plugins: [
    "@ianvs/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
  ],
  trailingComma: "es5",
  importOrder: ["<THIRD_PARTY_MODULES>", "", "^@/", "", "^[.][.]/", "^[.]/"],
  importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
  importOrderTypeScriptVersion: "5.0.0",
}

export default config
