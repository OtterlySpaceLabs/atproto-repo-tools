import { type FormEvent, useCallback, useState } from "react"

import BlueskyStatusCard from "~/components/common/status-card"
import { Button } from "~/components/shadcn/ui/button"
import { Input } from "~/components/shadcn/ui/input"
import { Label } from "~/components/shadcn/ui/label"
import { api } from "~/utils/api"

export default function UserLikes() {
	const [login, setLogin] = useState<string>("")
	const [password, setPassword] = useState<string>("")
	const [session, setSession] = useState<{
		accessJwt: string
		refreshJwt: string
		handle: string
		did: string
	} | null>(null)
	const [pds, setPds] = useState<string | null>(null)
	const [errorAuthMsg, setErrorAuthMsg] = useState<string | null>(null)

	const {
		mutateAsync: authMutate,
		isLoading: isAuthLoading,
		isError: isAuthError,
		error: authError
	} = api.bsky.getAuth.useMutation()

	const handleAuth = useCallback(
		async (e: FormEvent) => {
			e.preventDefault()
			if (!login || !password) {
				setErrorAuthMsg("Login and password are required")
				return
			}
			setErrorAuthMsg(null)

			try {
				const result = await authMutate({ handle: login, password })
				setSession(result.auth)
				setPds(result.pds)
			} catch (err) {
				const errorVal = err as { message: string; statusCode: number }
				if ("message" in errorVal && errorVal.message) {
					setErrorAuthMsg(errorVal.message)
				} else {
					if (isAuthError && authError) {
						setErrorAuthMsg(authError.message)
					} else {
						setErrorAuthMsg("Something went wrong")
					}
				}
			}
		},
		[authMutate, authError, isAuthError, login, password, setErrorAuthMsg, setPds, setSession]
	)

	const [handle, setHandle] = useState<string>("")
	const [errorMsg, setErrorMsg] = useState<string | null>(null)
	const [fetchLikes, setFetchLikes] = useState<boolean>(false)

	const {
		data: likes,
		isLoading,
		isError,
		error
	} = api.bsky.getUserLikes.useInfiniteQuery(
		{
			handle,
			session,
			sessionPds: pds
		},
		{
			enabled: fetchLikes,
			refetchOnWindowFocus: false,
			refetchOnMount: false,
			refetchOnReconnect: false
		}
	)

	const handleGetUserLikes = useCallback(
		(e: FormEvent) => {
			e.preventDefault()

			if (!handle) {
				setErrorMsg("Handle is required")
				return
			}

			if (!session || !pds) {
				setErrorMsg("Authenticate first before trying to get likes")
				return
			}

			setErrorMsg(null)
			setFetchLikes(true)
		},
		[handle, session, pds, setErrorMsg]
	)

	return (
		<div className="mx-auto flex max-h-[85vh] w-full max-w-2xl flex-col items-center justify-center gap-4">
			<div className="flex gap-4">
				<div className="flex w-full flex-col gap-4">
					<form method="post" onSubmit={handleAuth}>
						<div className="grid w-full max-w-sm items-center gap-1.5">
							<Label htmlFor="handle">Auth</Label>

							<div className="flex w-full max-w-sm items-center space-x-2">
								<Input
									id="login"
									placeholder="alice.xyz"
									onChange={(e) => setLogin(e.target.value)}
									disabled={isAuthLoading || !!session}
								/>
								<Input
									id="password"
									placeholder="App password"
									type="password"
									onChange={(e) => setPassword(e.target.value)}
									disabled={isAuthLoading || !!session}
								/>
							</div>
							<Button type="submit" disabled={isAuthLoading || !!session}>
								Auth
							</Button>
						</div>
					</form>
					{errorAuthMsg && <div className="text-red-500 dark:text-red-400">{errorMsg}</div>}
					{session && <div>Authenticated as {session.handle}</div>}
				</div>
				<div className="flex w-full flex-col gap-4">
					<form method="post" onSubmit={handleGetUserLikes}>
						<div className="grid w-full max-w-sm items-center gap-1.5">
							<Label htmlFor="handle">Handle</Label>

							<div className="flex w-full max-w-sm items-center space-x-2">
								<Input
									id="handle"
									placeholder="alice.xyz"
									onChange={(e) => {
										setHandle(e.target.value)
										setFetchLikes(false)
									}}
									disabled={!session}
								/>

								<Button type="submit" disabled={!session}>
									Get Likes
								</Button>
							</div>
							{!session ? <div>Authenticate first before trying to get likes</div> : null}
						</div>
					</form>
					{errorMsg && <div className="text-red-500 dark:text-red-400">{errorMsg}</div>}
				</div>
			</div>
			<div className="grid h-full w-full gap-1.5 overflow-auto rounded pr-2">
				{likes?.pages.map((page) => page.likes.map((like) => <BlueskyStatusCard key={like.cid} post={like} />))}
			</div>
		</div>
	)
}
