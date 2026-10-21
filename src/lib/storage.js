import { STORAGE_KEYS } from '../config'

export function loadJSON(key, fallback = null) {
	try {
		const raw = localStorage.getItem(key)
		return raw ? JSON.parse(raw) : fallback
	} catch {
		return fallback
	}
}

export function saveJSON(key, value) {
	try {
		localStorage.setItem(key, JSON.stringify(value))
	} catch {}
}

export function removeKey(key) {
	try {
		localStorage.removeItem(key)
	} catch {}
}

export function loadFavorites(isDemo = false) {
	const key = isDemo
		? `${STORAGE_KEYS.favorites}_demo`
		: `${STORAGE_KEYS.favorites}_real`
	return loadJSON(key, [])
}

export function saveFavorites(list, isDemo = false) {
	const key = isDemo
		? `${STORAGE_KEYS.favorites}_demo`
		: `${STORAGE_KEYS.favorites}_real`
	saveJSON(key, list)
}

export function makeId() {
	return crypto.randomUUID
		? crypto.randomUUID()
		: String(Date.now()) + Math.random().toString(16).slice(2)
}
