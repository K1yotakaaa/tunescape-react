export const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID
export const REDIRECT_URI =
	import.meta.env.VITE_SPOTIFY_REDIRECT_URI ||
	`${window.location.origin}/callback`

export const SCOPES = [
	'user-top-read',
	'user-read-private',
	'user-read-email',
	'playlist-modify-private',
	'playlist-modify-public',
].join(' ')

export const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/authorize'
export const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token'
export const SPOTIFY_API = 'https://api.spotify.com/v1'
export const RECCOBEATS_API = 'https://api.reccobeats.com/v1'

export const STORAGE_KEYS = {
	tokens: 'tunescape_tokens',
	verifier: 'tunescape_pkce_verifier',
	state: 'tunescape_oauth_state',
	demoMode: 'tunescape_demo_mode',
	favorites: 'tunescape_favorites',
}
