import Head from "next/head"
import { useRouter } from "next/router"
import { type DefaultSeoProps, NextSeo } from "next-seo"
import { useMemo } from "react"

import { env } from "~/env.mjs"

interface HeadProps {
	title?: string
	seo?: DefaultSeoProps
}

export default function CustomHead(props: HeadProps) {
	const name = "AT Protocol Repo Tools"
	const description = "Tools to explore AT Protocol repos"
	const title = useMemo(() => {
		return `${props.title ? `${props.title} | ` : ""}${name}`
	}, [props.title])

	const router = useRouter()
	const canonicalUrl = (env.NEXT_PUBLIC_URL + (router.asPath === "/" ? "" : router.asPath)).split("?")[0]!

	const defaultSeoProps: DefaultSeoProps = useMemo(() => {
		return {
			title,
			description,
			canonical: canonicalUrl,
			openGraph: {
				title,
				site_name: name,
				description,
				url: canonicalUrl,
				type: "website",
				locale: "en",
				images: [
					{
						url: `${env.NEXT_PUBLIC_URL}/api/og`,
						width: 1200,
						height: 600,
						alt: "AT Protocol repo tools"
					}
				]
			},
			twitter: {
				site: "@OtterlySpace",
				cardType: "summary_large_image"
			}
		}
	}, [title, description, canonicalUrl])

	const computedSeoProps: DefaultSeoProps = useMemo(() => {
		return {
			...defaultSeoProps,
			...props.seo
		}
	}, [defaultSeoProps, props.seo])

	return (
		<Head>
			<title>{title}</title>

			<link rel="icon" href="/favicon.ico" />
			<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
			<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
			<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
			<link rel="manifest" href="/site.webmanifest" />
			<meta name="theme-color" content="#ffffff" />

			<NextSeo {...computedSeoProps} />
		</Head>
	)
}
