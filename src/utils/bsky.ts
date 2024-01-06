import {
	AppBskyEmbedExternal,
	AppBskyEmbedImages,
	AppBskyEmbedRecord,
	AppBskyEmbedRecordWithMedia,
	type AppBskyFeedDefs,
	AppBskyFeedPost,
	RichText
} from "@atproto/api"

export function atPostUriToUrl(uri: string, service = "https://bsky.app") {
	return uri.replace("at://", service + "/profile/").replace("app.bsky.feed.", "")
}

export function getMediasFromPost(post: AppBskyFeedDefs.PostView) {
	const { embed } = post

	const medias: AppBskyEmbedImages.ViewImage[] = []

	if (AppBskyEmbedImages.isView(embed)) {
		medias.push(...embed.images)
	}

	if (AppBskyEmbedRecordWithMedia.isView(embed)) {
		if (AppBskyEmbedImages.isView(embed.media)) {
			medias.push(...embed.media.images)
		}
	}

	return medias
}

export function getExternalEmbedFromPost(post: AppBskyFeedDefs.PostView) {
	const { embed } = post

	let externalEmbed: AppBskyEmbedExternal.ViewExternal | undefined

	if (AppBskyEmbedExternal.isView(embed)) {
		externalEmbed = embed.external
	}

	if (AppBskyEmbedRecordWithMedia.isView(embed)) {
		if (AppBskyEmbedExternal.isView(embed.media)) {
			externalEmbed = embed.media.external
		}
	}

	return externalEmbed
}

export function getQuotedPostFromPost(post: AppBskyFeedDefs.PostView) {
	const { embed } = post

	let quotedPost: AppBskyEmbedRecord.ViewRecord | undefined

	if (AppBskyEmbedRecord.isView(embed)) {
		if (AppBskyEmbedRecord.isViewRecord(embed.record)) {
			quotedPost = embed.record
		}
	}

	if (AppBskyEmbedRecordWithMedia.isView(embed)) {
		if (AppBskyEmbedRecord.isViewRecord(embed.record)) {
			quotedPost = embed.record
		}
	}

	if (quotedPost && AppBskyFeedPost.isRecord(quotedPost.value)) {
		return quotedPost
	}

	return undefined
}

export function postRecordToMarkdown(record: AppBskyFeedPost.Record) {
	if (AppBskyFeedPost.isRecord(record)) {
		const rt = new RichText({
			text: record.text,
			entities: record.entities,
			facets: record.facets
		})
		let markdown = ``
		for (const segment of rt.segments()) {
			if (segment.isLink()) {
				markdown += `[${segment.text}](${segment.link?.uri})`
			} else if (segment.isMention()) {
				markdown += `[${segment.text}](https://bsky.app/profile/${segment.mention?.did})`
			} else if (segment.isTag()) {
				markdown += `[${segment.text}](https://bsky.app/search?q=%23${segment.tag?.tag})`
			} else {
				markdown += segment.text
			}
		}
		markdown = markdown.replace(/\n/g, "\n\n")
		return markdown
	}
	return ""
}
