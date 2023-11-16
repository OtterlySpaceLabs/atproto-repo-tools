import Image from "next/image"
import Link from "next/link"
import { type SVGProps } from "react"

import BlueskyLogo from "~/assets/bluesky.svg"

export default function Footer() {
	const navigation = [
		{
			name: "GitHub",
			href: "https://github.com/OtterlySpaceLabs/atproto-repo-tools",
			icon: (props: SVGProps<SVGSVGElement>) => (
				<svg fill="currentColor" viewBox="0 0 24 24" {...props}>
					<path
						fillRule="evenodd"
						d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
						clipRule="evenodd"
					/>
				</svg>
			)
		}
	]
	return (
		<footer className="relative bottom-0 mt-auto w-full">
			<div className="mx-auto max-w-7xl px-6 py-6 md:flex md:items-center md:justify-between lg:px-8">
				<div className="mb-4 flex justify-center md:order-1 md:mb-0">
					<p className="inline-flex items-center text-center align-middle text-xs leading-5 text-gray-500 dark:text-gray-400">
						Made with ❤️ and 🦦 by{" "}
						<Link
							href="https://otterly.space"
							target="_blank"
							className="ml-1 inline-flex items-center align-middle underline"
						>
							<Image src="/logo-otterly.png" alt="Otterly Space" width={32} height={32} />
							<span className="ml-1">Otterly Space</span>
						</Link>
					</p>
				</div>
				<div className="flex justify-center space-x-6 md:order-2">
					<div className="flex">
						<div className="flex text-gray-300">
							<BlueskyLogo className="h-6 w-6 shrink-0 rounded" aria-hidden="true" />
							<div className="-mt-0.5 ml-1.5 mr-1 cursor-default">/</div>
						</div>
						<div className="flex gap-1">
							<Link
								target="_blank"
								href="https://bsky.app/profile/alex73630.xyz"
								className="flex flex-row opacity-80 hover:opacity-100"
							>
								<span className="sr-only">Bluesky Alexandre Sanchez</span>
								<Image
									src="/alexandre.png"
									alt="Alexandre Sanchez"
									className="rounded-full"
									width={24}
									height={24}
								/>
							</Link>
							<Link
								target="_blank"
								href="https://bsky.app/profile/hiboux.bsky.social"
								className="flex flex-row opacity-80 hover:opacity-100"
							>
								<span className="sr-only">Bluesky Nicolas Feroux</span>

								<Image
									src="/nicolas.png"
									alt="Nicolas Feroux"
									className="rounded-full"
									width={24}
									height={24}
								/>
							</Link>
							<Link
								target="_blank"
								href="https://bsky.app/profile/otterly.space"
								className="flex flex-row rounded-full bg-slate-200 opacity-80 hover:opacity-100"
							>
								<span className="sr-only">Bluesky Otterly Space</span>

								<Image
									src="/logo-otterly.png"
									alt="Otterly Space"
									className=""
									width={24}
									height={24}
								/>
							</Link>
						</div>
					</div>

					{navigation.map((item) => (
						<Link
							target="_blank"
							key={item.name}
							href={item.href}
							className="text-gray-400 hover:text-gray-500"
						>
							<span className="sr-only">{item.name}</span>
							<item.icon className="h-6 w-6" aria-hidden="true" />
						</Link>
					))}
				</div>
			</div>
		</footer>
	)
}
