/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "@vercel/og"
import { type NextRequest } from "next/server"

export const config = {
	runtime: "edge"
}

export default function OpenGraphImage(req: NextRequest) {
	const { searchParams, host, protocol } = req.nextUrl

	let lang = searchParams.get("lang") ?? "en"
	const supportedLangs = ["en", "fr"]

	if (!supportedLangs.includes(lang)) {
		lang = "en"
	}

	const imageSrc = `${protocol}//${host}/android-chrome-512x512.png`

	// eslint-disable-next-line @next/next/no-img-element
	return new ImageResponse(
		(
			<div
				style={{
					height: "100%",
					width: "100%",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					backgroundColor: "#000",
					color: "#fff",
					fontSize: 32,
					fontWeight: 600
				}}
			>
				<img src={imageSrc} alt="Open Graph Image" width={330} height={330} tw="rounded-3xl" />
				<div style={{ marginTop: 40 }}>AT Protocol Repo Tools</div>
			</div>
		),
		{
			width: 1200,
			height: 600
		}
	)
}
