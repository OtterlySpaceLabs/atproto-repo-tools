import { repoArchiveRouter } from "~/server/api/routers/repo/archive"
import { mergeRouters } from "~/server/api/trpc"

export const repoRouter = mergeRouters(repoArchiveRouter)
