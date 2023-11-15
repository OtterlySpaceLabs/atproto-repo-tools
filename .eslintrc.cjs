/** @type {import("eslint").Linter.Config} */
const config = {
	parser: "@typescript-eslint/parser",
	parserOptions: {
		project: true
	},
	settings: {
		"import/resolver": {
			typescript: {
				project: "./tsconfig.json"
			}
		}
	},
	plugins: ["@typescript-eslint"],
	extends: [
		"next/core-web-vitals",
		"plugin:@typescript-eslint/recommended-type-checked",
		"plugin:@typescript-eslint/stylistic-type-checked",
		"plugin:prettier/recommended",
		"prettier"
	],
	rules: {
		// These opinionated rules are enabled in stylistic-type-checked above.
		// Feel free to reconfigure them to your own preference.
		"@typescript-eslint/array-type": "off",
		"@typescript-eslint/consistent-type-definitions": "off",

		"@typescript-eslint/consistent-type-imports": [
			"warn",
			{
				prefer: "type-imports",
				fixStyle: "inline-type-imports"
			}
		],
		"@typescript-eslint/no-misused-promises": [
			2,
			{
				checksVoidReturn: { attributes: false }
			}
		],
		"prettier/prettier": ["error", {}, { usePrettierrc: true }], // Includes .prettierrc.js rules
		"@typescript-eslint/no-unused-vars": [
			"warn",
			{ args: "after-used", ignoreRestSiblings: true, argsIgnorePattern: "^_" }
		],
		"no-unused-vars": ["warn", { args: "after-used", ignoreRestSiblings: true, argsIgnorePattern: "^_" }],
		"no-multi-spaces": "error",
		"no-trailing-spaces": "error",
		"arrow-spacing": "error",
		"sort-imports": [
			"error",
			{
				ignoreCase: false,
				ignoreDeclarationSort: true, // don"t want to sort import lines, use eslint-plugin-import instead
				ignoreMemberSort: false,
				memberSyntaxSortOrder: ["none", "all", "multiple", "single"],
				allowSeparatedGroups: true
			}
		],
		"import/order": [
			"error",
			{
				groups: [
					"builtin", // Built-in imports (come from NodeJS native) go first
					"external", // <- External imports
					"internal", // <- Absolute imports
					["sibling", "parent"], // <- Relative imports, the sibling and parent types they can be mingled together
					"index", // <- index imports
					"unknown" // <- unknown
				],
				"newlines-between": "always",
				alphabetize: {
					/* sort in ascending order. Options: ["ignore", "asc", "desc"] */
					order: "asc",
					/* ignore case. Options: [true, false] */
					caseInsensitive: true
				}
			}
		]
	}
}

module.exports = config
