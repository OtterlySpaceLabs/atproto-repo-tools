import { AppBskyFeedLike, BskyAgent } from "@atproto/api"
import { type PostView } from "@atproto/api/dist/client/types/app/bsky/feed/defs"
import { z } from "zod"

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc"
import { resolveHandle } from "~/utils/atproto"

export const bskyRouter = createTRPCRouter({
	getAuth: publicProcedure
		.input(
			z.object({
				handle: z.string().transform((input) => (input.startsWith("@") ? input.slice(1) : input)),
				password: z.string().min(1)
			})
		)
		.mutation(async ({ input }) => {
			const { handle } = input
			const resolved = await resolveHandle(handle)

			if (!resolved) {
				throw new Error(`Could not resolve handle ${handle}`)
			}

			const { did, pds } = resolved
			const agent = new BskyAgent({ service: pds })

			const { success, data: auth } = await agent.login({ identifier: handle, password: input.password })

			if (!success) {
				throw new Error(`Could not get auth for ${handle} (${did})`)
			}

			return {
				auth,
				pds,
				did
			}
		}),

	getUserLikes: publicProcedure
		.input(
			z.object({
				handle: z.string().transform((input) => (input.startsWith("@") ? input.slice(1) : input)),
				session: z
					.object({
						accessJwt: z.string(),
						refreshJwt: z.string(),
						did: z.string(),
						handle: z.string()
					})
					.nullable(),
				sessionPds: z.string().url().nullable(),
				cursor: z.string().optional()
			})
		)
		.query(async ({ input }) => {
			const { handle, session, sessionPds, cursor } = input

			if (!session || !sessionPds) {
				throw new Error(`No session provided`)
			}

			const resolved = await resolveHandle(handle)

			if (!resolved) {
				throw new Error(`Could not resolve handle ${handle}`)
			}

			const { did, pds } = resolved
			const repoAgent = new BskyAgent({ service: pds })

			const { success, data: likesList } = await repoAgent.com.atproto.repo.listRecords({
				repo: did,
				collection: "app.bsky.feed.like",
				cursor
			})

			if (!success) {
				throw new Error(`Could not get likes for ${handle} (${did})`)
			}

			let currSession = session

			const agent = new BskyAgent({
				service: sessionPds,
				persistSession: (evt, sess) => {
					if (evt === "update" && sess) {
						currSession = sess
					}
					if (evt === "expired") {
						throw new Error("Session expired")
					}
				}
			})

			try {
				await agent.resumeSession(currSession)
			} catch (error) {
				console.error("Error setting up auth", error)
				throw error
			}

			// Fetch by group of 25 uris
			const likes: PostView[] = []
			for (let i = 0; i < likesList.records.length; i += 25) {
				const uris = likesList.records
					.slice(i, i + 25)
					.map((record) => {
						if (AppBskyFeedLike.isRecord(record.value)) {
							return record.value.subject.uri
						}
					})
					.filter(Boolean) as string[]
				const { success: fetchSuccess, data: likesChunk } = await agent.getPosts({
					uris: uris
				})

				if (!fetchSuccess) {
					throw new Error(`Could not get likes for ${handle} (${did})`)
				}

				console.log("Got likes chunk", likesChunk.posts.length, i)

				likes.push(...likesChunk.posts)
			}

			return {
				likes,
				pds,
				did,
				cursor: likesList.cursor,
				session: currSession
			}
		}),
	getPosts: publicProcedure
		.input(
			z.object({
				postsUris: z.array(z.string().url()),
				pds: z.string().url()
			})
		)
		.mutation(async ({ input }) => {
			const { postsUris, pds } = input

			const agent = new BskyAgent({ service: pds })

			const { success, data: posts } = await agent.getPosts({
				uris: postsUris
			})

			if (!success) {
				throw new Error(`Could not get posts`)
			}

			return {
				posts
			}
		})
})
