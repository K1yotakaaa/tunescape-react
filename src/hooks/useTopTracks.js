import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { fetchTopTracks } from '../lib/spotify'
import demoData from '../data/demo-tracks.json'

const RANGES = ['short_term', 'medium_term', 'long_term']

export function useTopTracks() {
	const { tokens, isAuthenticated, demoMode, getValidToken } = useAuth()
	const [tracks, setTracks] = useState([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)

	useEffect(() => {
		if (!isAuthenticated) {
			setTracks([])
			return
		}

		if (demoMode) {
			setTracks(demoData.tracks || [])
			return
		}

		let aborted = false
		const ctrl = new AbortController()

		async function run() {
			setLoading(true)
			setError(null)
			try {
				const token = await getValidToken()
				const results = await Promise.all(
					RANGES.map(r =>
						fetchTopTracks(r, token, ctrl.signal).then(items =>
							items.map(t => ({ ...t, _range: r })),
						),
					),
				)

				const merged = new Map()
				results.flat().forEach(t => {
					const existing = merged.get(t.id)
					if (existing) {
						existing.ranges.add(t._range)
					} else {
						merged.set(t.id, { ...t, ranges: new Set([t._range]) })
					}
				})
				const list = Array.from(merged.values()).map(t => ({
					...t,
					ranges: Array.from(t.ranges),
				}))

				if (!aborted) setTracks(list)
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
	}, [tokens?.access_token, demoMode, isAuthenticated])

	return { tracks, loading, error }
}
