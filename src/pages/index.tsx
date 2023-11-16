import Head from "next/head"
import { useTheme } from "next-themes"
import { type FormEvent, useCallback, useMemo, useState } from "react"
import { CodeBlock, atomOneDark, atomOneLight } from "react-code-blocks"

import Header from "~/components/header/header"
import { Button } from "~/components/shadcn/ui/button"
import { Input } from "~/components/shadcn/ui/input"
import { Label } from "~/components/shadcn/ui/label"
import { api } from "~/utils/api"

export default function Home() {
	const [handle, setHandle] = useState<string>("")
	const [errorMsg, setErrorMsg] = useState<string | null>(null)
	const [repo, setRepo] = useState<string | null>(null)
	const [repoFetched, setRepoFetched] = useState<string | null>(null)

	const theme = useTheme()

	const codeTheme = useMemo(() => {
		if (theme.resolvedTheme === "dark" || theme.theme === "dark") {
			return atomOneDark
		} else {
			return atomOneLight
		}
	}, [theme])

	const { mutateAsync, isLoading, isError, error } = api.repo.getRepoArchive.useMutation()

	const handleArchiveRepo = useCallback(
		async (e: FormEvent) => {
			e.preventDefault()

			if (!handle) {
				setErrorMsg("Handle is required")
				return
			}
			setErrorMsg(null)

			if (repoFetched === handle) {
				return
			}

			try {
				const result = await mutateAsync({ handle })
				setRepo(JSON.stringify(result.contents, null, 2))
				setRepoFetched(handle)
			} catch (err) {
				const errorVal = err as { message: string; statusCode: number }
				if ("message" in errorVal && errorVal.message) {
					setErrorMsg(errorVal.message)
				} else {
					if (isError && error) {
						setErrorMsg(error.message)
					} else {
						setErrorMsg("Something went wrong")
					}
				}
			}
		},
		[handle, repoFetched, mutateAsync, isError, error]
	)

	return (
		<>
			<Head>
				<title>AT Proto repo tools</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main className="min-h-screen bg-white dark:bg-black">
				<Header />

				<div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-center gap-4">
					<div className="flex flex-col gap-4">
						<form method="post" onSubmit={handleArchiveRepo}>
							<div className="grid w-full max-w-sm items-center gap-1.5">
								<Label htmlFor="handle">Handle</Label>

								<div className="flex w-full max-w-sm items-center space-x-2">
									<Input
										id="handle"
										placeholder="alice.xyz"
										onChange={(e) => setHandle(e.target.value)}
										disabled={isLoading}
									/>
									<Button type="submit" disabled={isLoading}>
										Get Archive
									</Button>
								</div>
							</div>
						</form>
						{errorMsg && <div className="text-red-500 dark:text-red-400">{errorMsg}</div>}
					</div>
					<div className="max-h-[75vh] w-full overflow-auto">
						{repo && (
							<CodeBlock
								text={repo}
								language="json"
								theme={codeTheme}
								showLineNumbers={false}
								wrapLongLines
							/>
						)}
					</div>
				</div>
			</main>
		</>
	)
}
