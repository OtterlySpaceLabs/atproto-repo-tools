import { MemoryBlockstore, Repo, readCarWithRoot, verifyRepo } from "@atproto/repo"
import { z } from "zod"

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc"
import { getAtClient, resolveHandle } from "~/utils/atproto"

export const repoArchiveRouter = createTRPCRouter({
	getRepoArchive: publicProcedure
		.input(z.object({ handle: z.string().transform((input) => (input.startsWith("@") ? input.slice(1) : input)) }))
		.mutation(async ({ input }) => {
			const { handle } = input
			const resolved = await resolveHandle(handle)

			if (!resolved) {
				throw new Error(`Could not resolve handle ${handle}`)
			}

			const { did, pds, signingKey } = resolved

			const client = getAtClient(pds)

			const repoPayload = await client.com.atproto.sync.getRepo({ did })

			if (!repoPayload.success) {
				throw new Error(`Could not get repo for ${handle} (${did})`)
			}

			const repoData = repoPayload.data

			const car = await readCarWithRoot(repoData)

			const verified = await verifyRepo(car.blocks, car.root, did, signingKey)

			const syncStorage = new MemoryBlockstore()
			await syncStorage.applyCommit(verified.commit)
			const loadedRepo = await Repo.load(syncStorage, car.root)
			const contents = await loadedRepo.getContents()

			return {
				// repoData,
				contents
			}
		})
})
