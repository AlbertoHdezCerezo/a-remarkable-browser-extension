import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import jest from "eslint-plugin-jest";
import globals from "globals";

export default defineConfig([
	{
		files: ["./src/**/*.js", "./test/**/*.js"],
		plugins: { js, jest },
		extends: [
			"js/recommended",
			"jest/recommended"
		],
		rules: {
			"jest/no-disabled-tests": "warn",
			"jest/no-focused-tests": "error",
			"jest/no-identical-title": "error",
			"jest/prefer-to-have-length": "warn",
			"jest/valid-expect": "error"
		},
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.jest,
				Buffer: "readonly",
				global: "writable",
				process: "readonly",
				response: "readonly",
			},
		},
	},
	{
		rules: {
			"no-unused-vars": "warn",
			"no-undef": "warn",
		},
	},
]);
