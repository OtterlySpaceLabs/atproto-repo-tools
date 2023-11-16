import { Head, Html, Main, NextScript } from "next/document"

export default function Document() {
	return (
		<Html className="scroll-smooth bg-white antialiased dark:bg-slate-800">
			<Head />
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	)
}
