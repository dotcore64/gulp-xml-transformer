import js from "@eslint/js";
import node from "eslint-plugin-n";
import mocha from "eslint-plugin-mocha";
import imprt from "eslint-plugin-import";
import unicorn from "eslint-plugin-unicorn";
import comments from "@eslint-community/eslint-plugin-eslint-comments/configs";
import prettier from "eslint-plugin-prettier/recommended";
import { configs as yml } from "eslint-plugin-yml";

const testFiles = ["test/{,**}/*.?(c)js"];

export default [
  js.configs.recommended,
  node.configs["flat/recommended-script"],
  comments.recommended,
  unicorn.configs.recommended,
  imprt.flatConfigs.recommended,
  prettier,
  ...yml.recommended,
  {
    languageOptions: {
      sourceType: "module",
      ecmaVersion: "latest",
    },
    rules: {
      "unicorn/prevent-abbreviations": 0,
      "unicorn/no-array-callback-reference": 0,
      "unicorn/no-anonymous-default-export": 0,
      "unicorn/import-style": 0,
      "unicorn/no-array-for-each": 0,
      "@eslint-community/eslint-comments/no-unused-disable": "error",
      // GitHub Actions workflows rely on empty mapping values, e.g. `pull_request:`
      "yml/no-empty-mapping-value": "off",
    },
  },
  {
    ...mocha.configs.recommended,
    files: testFiles,
  },
  {
    files: testFiles,
    rules: {
      "mocha/no-mocha-arrows": "off",
      "mocha/no-setup-in-describe": 0,
    },
  },
  {
    ignores: ["coverage/", "node_modules/"],
  },
];
