import { AtpBaseClient } from "@atproto/api"
import { DidResolver, HandleResolver } from "@atproto/identity"

const xrpc = new AtpBaseClient()
const didres = new DidResolver({})
const hdlres = new HandleResolver()

export async function resolveHandle(handle: string) {
	try {
		const did = await hdlres.resolve(handle)

		if (!did) {
			return null
		}

		const data = await didres.resolveAtprotoData(did)

		if (!data) {
			return null
		}

		return data
	} catch (error) {
		return null
	}
}

export function getAtClient(pds: string) {
	return xrpc.service(pds)
}
