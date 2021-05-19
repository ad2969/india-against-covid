module.exports = {
	env: {
		browser: true,
		es2021: true,
		jest: true
	},
	extends: [
		"plugin:react/recommended",
		"standard"
	],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaFeatures: {
			jsx: true
		},
		ecmaVersion: 12,
		sourceType: "module"
	},
	settings: {
		react: {
			version: "detect",
		},
	},
	plugins: [
		"react",
		"react-hooks",
		"@typescript-eslint"
	],
	rules: {
		// Disable console logs on production branch
		// "no-console": process.env.REACT_APP_ENVIRONMENT === "production" ? 2 : 1,
		"no-console": 0,
		"no-debugger": process.env.REACT_APP_ENVIRONMENT === "production" ? 2 : 1,

		// React rules
		"react-hooks/rules-of-hooks": 2, // Checks rules of Hooks
		"react-hooks/exhaustive-deps": 1, // Checks effect dependencies
		"react/prop-types": 0,
		"react/display-name": 0,

		// Typescript fixes
		"no-unused-vars": 0,
		"no-use-before-define": "off",
		"@typescript-eslint/no-unused-vars": 1,
		"@typescript-eslint/no-use-before-define": ["error"],

		// Non-react rules
		"comma-dangle": [1, "only-multiline"],
		indent: [2, "tab", {
			SwitchCase: 1,
			VariableDeclarator: "first",
			// "outerIIFEBody": 1,
			// "MemberExpression": 1,
			// "ArrayExpression": 1,
			// "ObjectExpression": 1,
			// "ImportDeclaration": 1,
			// "flatTernaryExpressions": false,
			// "offsetTernaryExpressions": false,
			// "ignoreComments": false
		}],
		"no-tabs": 0,
		"no-mixed-spaces-and-tabs": 1,
		"object-curly-spacing": [
			1,
			"always",
			{ arraysInObjects: true, objectsInObjects: true },
		],
		quotes: [1, "double"],
		semi: [1, "always"],
		"prefer-const": [1, { destructuring: "any" }],
	}
};
