import { RECCOBEATS_API } from '../config'

const BATCH_SIZE = 40

export async function fetchAudioFeatures(spotifyIds, signal) {
	const all = []
	for (let i = 0; i < spotifyIds.length; i += BATCH_SIZE) {
		const batch = spotifyIds.slice(i, i + BATCH_SIZE)
		const url = `${RECCOBEATS_API}/audio-features?ids=${batch.join(',')}`
		const res = await fetch(url, { signal })
		if (!res.ok) {
			if (res.status === 404) continue
			throw new Error(`ReccoBeats → ${res.status}`)
		}
		const data = await res.json()
		if (Array.isArray(data.content)) all.push(...data.content)
	}
	return all
}

export function idFromHref(href) {
	if (!href) return null
	const parts = href.split('/').filter(Boolean)
	return parts[parts.length - 1] || null
}
