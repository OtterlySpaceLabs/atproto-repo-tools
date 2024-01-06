import { AppBskyFeedPost } from "@atproto/api"
import { type PostView } from "@atproto/api/dist/client/types/app/bsky/feed/defs"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { useMemo, useState } from "react"
import Markdown from "react-markdown"
import Lightbox from "yet-another-react-lightbox"

import {
	atPostUriToUrl,
	getExternalEmbedFromPost,
	getMediasFromPost,
	getQuotedPostFromPost,
	postRecordToMarkdown
} from "~/utils/bsky"
import { formatStatusDate } from "~/utils/date-format"
import { cn } from "~/utils/shadcn"

interface BlueskyStatusCardProps {
	post: PostView
}

export default function BlueskyStatusCard({ post }: BlueskyStatusCardProps) {
	const [open, setOpen] = useState(false)

	const router = useRouter()

	const text = useMemo(() => {
		if (AppBskyFeedPost.isRecord(post.record)) {
			return postRecordToMarkdown(post.record)
		}
		return ""
	}, [post.record])

	const medias = useMemo(() => {
		return getMediasFromPost(post)
	}, [post])

	const external = useMemo(() => {
		return getExternalEmbedFromPost(post)
	}, [post])

	const quoted = useMemo(() => {
		return getQuotedPostFromPost(post)
	}, [post])

	return (
		<div className="items-center">
			<div className="w-full rounded border border-gray-300 p-4">
				<div className="flex flex-row gap-2">
					<div>
						<Link href={post.uri ? atPostUriToUrl(post.uri) : ""} target="_blank">
							<Image
								unoptimized
								src={post.author.avatar ?? ""}
								alt={post.author.displayName ?? post.author.handle}
								width={48}
								height={48}
								className="rounded"
							/>
						</Link>
					</div>
					<div className="flex flex-col truncate">
						<span className="truncate font-semibold">
							<Link href={post.uri ? atPostUriToUrl(post.uri) : ""} target="_blank">
								{post.author.displayName ?? post.author.handle}
							</Link>
						</span>
						<span className="truncate text-gray-600">
							<Link href={post.uri ? atPostUriToUrl(post.uri) : ""} target="_blank">
								@{post.author.handle}
							</Link>
						</span>
					</div>

					<div className="ml-auto">
						{AppBskyFeedPost.isRecord(post.record) && (
							<span className="truncate text-gray-600">
								{formatStatusDate(post.record.createdAt, router.locale)}
							</span>
						)}
					</div>
				</div>
				<div className="css-card my-2 break-words">
					<Markdown>{text}</Markdown>
				</div>
				{medias.length > 0 && (
					<div
						className={medias.length > 1 ? "grid grid-cols-2 justify-center gap-2" : "flex justify-center"}
					>
						{medias.map((media, index) => (
							<div
								key={media.fullsize}
								className={cn(
									"max-h-48 w-full cursor-pointer",
									medias.length === 3 && index === 2 ? "col-span-2 max-h-32" : ""
								)}
								onClick={() => setOpen(true)}
							>
								<Image
									unoptimized
									src={media.thumb}
									alt={media.alt ?? "Bluesky media"}
									className="h-full w-full rounded object-cover"
									width={media.aspectRatio?.width ?? 128}
									height={media.aspectRatio?.height ?? 128}
								/>
							</div>
						))}
						{medias.length > 0 && (
							<Lightbox
								controller={{
									closeOnBackdropClick: true,
									closeOnPullDown: true
								}}
								carousel={{
									finite: true
								}}
								open={open}
								close={() => setOpen(false)}
								slides={medias.map((media) => ({
									src: media.fullsize,
									title: media.alt ?? "Bluesky media",
									width: media.aspectRatio?.width,
									height: media.aspectRatio?.height
								}))}
							/>
						)}
					</div>
				)}
				{quoted && (
					<div className="my-2 rounded border border-gray-300 p-2">
						<div className="flex flex-row gap-1">
							<Link href={quoted.uri ? atPostUriToUrl(quoted.uri) : ""} target="_blank">
								<Image
									unoptimized
									src={quoted.author.avatar ?? ""}
									alt={quoted.author.displayName ?? quoted.author.handle}
									width={24}
									height={24}
									className="rounded"
								/>
							</Link>
							<span className="truncate font-semibold">
								{quoted.author.displayName ?? quoted.author.handle}
							</span>
							<span className="truncate text-gray-600">@{quoted.author.handle}</span>
							{AppBskyFeedPost.isRecord(quoted.value) && (
								<>
									<span className="truncate text-gray-600">·</span>
									<span className="truncate text-gray-600">
										{formatStatusDate(quoted.value.createdAt, router.locale)}
									</span>
								</>
							)}
						</div>
						<div className="css-card my-2 break-words">
							{AppBskyFeedPost.isRecord(quoted.value) && (
								<Markdown>{postRecordToMarkdown(quoted.value)}</Markdown>
							)}
						</div>
					</div>
				)}
				{external && (
					<div className="my-2 rounded border border-gray-300 p-2">
						<Link href={external.uri} target="_blank">
							<div className="flex flex-row items-center gap-2">
								<div className="relative h-24 w-24 flex-shrink-0 flex-grow-0">
									<Image
										unoptimized
										src={external.thumb ?? ""}
										alt={external.title}
										className="rounded object-contain"
										fill
									/>
								</div>
								<div className="flex min-w-0 flex-auto flex-col">
									<span className="truncate text-sm text-gray-600">{new URL(external.uri).host}</span>
									<span className="font-semibold">{external.title}</span>
									<p className="line-clamp-2 text-gray-600">{external.description}</p>
								</div>
							</div>
						</Link>
					</div>
				)}
			</div>
		</div>
	)
}
