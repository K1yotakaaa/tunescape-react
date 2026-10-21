import {
	SPOTIFY_CLIENT_ID,
	REDIRECT_URI,
	SCOPES,
	SPOTIFY_AUTH_URL,
	SPOTIFY_TOKEN_URL,
	SPOTIFY_API,
	STORAGE_KEYS,
} from '../config'

function randomString(length) {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
	const values = crypto.getRandomValues(new Uint8Array(length))
	return Array.from(values, x => chars[x % chars.length]).join('')
}

async function sha256(plain) {
	const encoder = new TextEncoder()
	const data = encoder.encode(plain)
	return crypto.subtle.digest('SHA-256', data)
}

function base64urlencode(buffer) {
	return btoa(String.fromCharCode(...new Uint8Array(buffer)))
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=+$/, '')
}

export async function buildLoginUrl() {
	const verifier = randomString(64)
	const challenge = base64urlencode(await sha256(verifier))
	const state = randomString(16)

	sessionStorage.setItem(STORAGE_KEYS.verifier, verifier)
	sessionStorage.setItem(STORAGE_KEYS.state, state)

	const params = new URLSearchParams({
		client_id: SPOTIFY_CLIENT_ID,
		response_type: 'code',
		redirect_uri: REDIRECT_URI,
		scope: SCOPES,
		code_challenge_method: 'S256',
		code_challenge: challenge,
		state,
	})

	return `${SPOTIFY_AUTH_URL}?${params.toString()}`
}

export async function handleCallback(code, state) {
	const savedState = sessionStorage.getItem(STORAGE_KEYS.state)
	const verifier = sessionStorage.getItem(STORAGE_KEYS.verifier)

	if (!savedState || state !== savedState) {
		throw new Error('State mismatch — possible CSRF.')
	}
	if (!verifier) {
		throw new Error('Missing PKCE verifier.')
	}

	const body = new URLSearchParams({
		grant_type: 'authorization_code',
		code,
		redirect_uri: REDIRECT_URI,
		client_id: SPOTIFY_CLIENT_ID,
		code_verifier: verifier,
	})

	const res = await fetch(SPOTIFY_TOKEN_URL, {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body,
	})

	if (!res.ok) {
		const text = await res.text()
		throw new Error(`Token exchange failed (${res.status}): ${text}`)
	}

	const data = await res.json()
	sessionStorage.removeItem(STORAGE_KEYS.verifier)
	sessionStorage.removeItem(STORAGE_KEYS.state)

	return {
		access_token: data.access_token,
		refresh_token: data.refresh_token,
		expires_at: Date.now() + data.expires_in * 1000,
	}
}

export async function refreshAccessToken(refresh_token) {
	const body = new URLSearchParams({
		grant_type: 'refresh_token',
		refresh_token,
		client_id: SPOTIFY_CLIENT_ID,
	})
	const res = await fetch(SPOTIFY_TOKEN_URL, {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body,
	})
	if (!res.ok) throw new Error('Refresh failed')
	const data = await res.json()
	return {
		access_token: data.access_token,
		refresh_token: data.refresh_token || refresh_token,
		expires_at: Date.now() + data.expires_in * 1000,
	}
}

export async function spotifyFetch(path, token, signal) {
	const res = await fetch(`${SPOTIFY_API}${path}`, {
		headers: { Authorization: `Bearer ${token}` },
		signal,
	})
	if (!res.ok) {
		const text = await res.text()
		throw new Error(`Spotify ${path} → ${res.status}: ${text}`)
	}
	return res.json()
}

export async function fetchTopTracks(range, token, signal) {
	const data = await spotifyFetch(
		`/me/top/tracks?time_range=${range}&limit=50`,
		token,
		signal,
	)
	return data.items || []
}

export async function fetchMe(token, signal) {
	return spotifyFetch('/me', token, signal)
}

export async function createPlaylist(token, userId, name, uris, signal) {
	const res = await fetch(`${SPOTIFY_API}/users/${userId}/playlists`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			name,
			description: 'Created by Tunescape',
			public: false,
		}),
		signal,
	})
	if (!res.ok) throw new Error(`Create playlist → ${res.status}`)
	const playlist = await res.json()

	for (let i = 0; i < uris.length; i += 100) {
		const batch = uris.slice(i, i + 100)
		const addRes = await fetch(
			`${SPOTIFY_API}/playlists/${playlist.id}/tracks`,
			{
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ uris: batch }),
				signal,
			},
		)
		if (!addRes.ok) throw new Error(`Add tracks → ${addRes.status}`)
	}

	return playlist
}
