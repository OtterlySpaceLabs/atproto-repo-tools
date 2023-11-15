import Head from "next/head"
import { useCallback, useState } from "react"

import Header from "~/components/header/header"
import { Button } from "~/components/shadcn/ui/button"
import { Input } from "~/components/shadcn/ui/input"
import { Label } from "~/components/shadcn/ui/label"
import { Textarea } from "~/components/shadcn/ui/textarea"
import { api } from "~/utils/api"

export default function Home() {
	const [handle, setHandle] = useState<string>("")
	const [errorMsg, setErrorMsg] = useState<string | null>(null)
	const [repo, setRepo] = useState<string | null>(null)

	const archiveRepoMutation = api.repo.getRepoArchive.useMutation()

	const handleArchiveRepo = useCallback(async () => {
		if (!handle) return

		try {
			const result = await archiveRepoMutation.mutateAsync({ handle })
			setRepo(JSON.stringify(result.contents, null, 2))
		} catch (error) {
			const errorVal = error as { message: string; statusCode: number }
			if ("message" in errorVal && errorVal.message) {
				setErrorMsg(errorVal.message)
			}
		}
	}, [handle, archiveRepoMutation])

	return (
		<>
			<Head>
				<title>AT Proto repo tools</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main className="min-h-screen bg-white dark:bg-black">
				<Header />

				<div className="mx-auto flex w-full max-w-3xl flex-col items-center justify-center gap-4">
					<div>
						<div className="grid w-full max-w-sm items-center gap-1.5">
							<Label htmlFor="handle">Handle</Label>

							<div className="flex w-full max-w-sm items-center space-x-2">
								<Input
									id="handle"
									placeholder="alice.xyz"
									onChange={(e) => setHandle(e.target.value)}
								/>
								<Button type="button" onClick={handleArchiveRepo}>
									Get Archive
								</Button>
							</div>
						</div>
					</div>
					<div className="w-full">
						<Textarea value={repo ?? ""} rows={15} readOnly />
					</div>
				</div>
			</main>
		</>
	)
}
