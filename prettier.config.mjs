// prettier.config.mjs

/** @type {import("prettier").Config} */
const config = {
  tabWidth: 2,
  trailingComma: "all",
  printWidth: 120,
  plugins: ["@prettier/plugin-xml"],
  overrides: [
    {
      files: ["*.flexmi"],
      options: {
        parser: "xml",
        xmlWhitespaceSensitivity: "ignore",
      },
    },
  ],
};

export default config;
