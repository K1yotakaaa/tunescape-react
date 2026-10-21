import { useEffect, useState } from 'react'
import { fetchAudioFeatures, idFromHref } from '../lib/reccobeats'
import { useAuth } from '../context/AuthContext'
import demoData from '../data/demo-tracks.json'

export function useAudioFeatures(trackId) {
	const { demoMode } = useAuth()
	const [features, setFeatures] = useState(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)

	useEffect(() => {
		if (!trackId) {
			setFeatures(null)
			return
		}

		if (demoMode) {
			const f = (demoData.features || {})[trackId] || null
			setFeatures(f)
			return
		}

		let aborted = false
		const ctrl = new AbortController()

		async function run() {
			setLoading(true)
			setError(null)
			setFeatures(null)
			try {
				const list = await fetchAudioFeatures([trackId], ctrl.signal)
				if (aborted) return
				const found = list.find(f => idFromHref(f.href) === trackId)
				setFeatures(found || null)
			} catch (e) {
				if (!aborted && e.name !== 'AbortError') setError(e.message)
			} finally {
				if (!aborted) setLoading(false)
			}
		}

		run()
		return () => {
			aborted = true
			ctrl.abort()
		}
	}, [trackId, demoMode])

	return { features, loading, error }
}
