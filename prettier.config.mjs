/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').options} */
const config = {
	printWidth: 120,
	useTabs: true,
	semi: false,
	singleQuote: false,
	trailingComma: "none",
	plugins: ["prettier-plugin-tailwindcss"]
}

export default config
