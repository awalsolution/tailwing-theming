import typescript from "@typescript-eslint/eslint-plugin";
import parser from "@typescript-eslint/parser";
import prettierPlugin from "eslint-plugin-prettier";

export default [
    {
        ignores: ["dist", "node_modules"],
    },
    {
        files: ["lib/**/*.{ts,js}"],
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: "module",
            parser,
        },
        plugins: {
            "@typescript-eslint": typescript,
            prettier: prettierPlugin,
        },
        rules: {
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
            "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
            "no-console": "error",
            "no-debugger": "error",
            "prefer-const": "error",
            // eqeqeq: ["error", "always"],
            curly: "error",
            "prettier/prettier": "error",
        },
    },
];
