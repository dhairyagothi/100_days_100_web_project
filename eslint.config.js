const js = require("@eslint/js");
const eslintConfigPrettier = require("eslint-config-prettier");
const eslintPluginHtml = require("eslint-plugin-html");
const globals = require("globals");

module.exports = [
  js.configs.recommended,
  {
    files: ["**/*.js", "**/*.jsx", "**/*.html"],
    plugins: {
      html: eslintPluginHtml,
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      "no-unused-vars": "warn",
      "no-console": "off",
      "no-undef": "error",
    },
  },
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "package-lock.json",
      "package.json",
      "projects.json",
      "**/eslint.config.js",
      "**/.eslintrc.js",
      "**/.eslintrc.cjs",
      "**/.eslintrc.json",
      "**/.eslintrc.yml",
      "**/.eslintrc",
    ],
  },
  eslintConfigPrettier,
];
