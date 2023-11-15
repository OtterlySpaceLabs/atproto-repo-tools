import { type AppType } from "next/app"
import { ThemeProvider } from "next-themes"

import { api } from "~/utils/api"

import "~/styles/globals.css"

const MyApp: AppType = ({ Component, pageProps }) => {
	return (
		<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
			<Component {...pageProps} />
		</ThemeProvider>
	)
}

export default api.withTRPC(MyApp)
