# Tunescape - API Architecture Overview

**Tunescape** is a frontend-only React Single Page Application (SPA) that acts as an "on-demand Spotify Wrapped." Because the application is completely serverless (deployed via Vercel), it relies on two external APIs to function.

Here is a breakdown of the data sources, request types, and how they are integrated.

---

## 1. Primary Data Source: Spotify Web API
The Spotify API is the core of the application. It handles authentication and provides all the track metadata.

### Authentication (OAuth 2.0 with PKCE)
Since there is no backend to securely store a client secret, the app uses the **PKCE (Proof Key for Code Exchange)** flow. 
*   **Scopes requested:** `user-top-read`, `user-read-private`
*   **Token Management:** The app handles short-lived access tokens (1 hour) and uses a silent refresh mechanism via refresh tokens. Tokens are managed globally via React Context.

### Endpoints Used

| Request Type | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/v1/me` | Fetches the user's profile (display name, avatar, country). |
| `GET` | `/v1/me/top/tracks?limit=50&time_range={range}` | Fetches the user's top tracks. The app makes three parallel requests (`short_term`, `medium_term`, `long_term`). |

### Data Merging
Because a single track can appear in multiple time ranges (e.g., a song might be your #1 for the last 4 weeks *and* the last 6 months), the app **deduplicates** the results by the track's `id`. It injects a custom `ranges` array into each track object (e.g., `["short_term", "medium_term"]`) so the UI can filter by specific timeframes.

---

## 2. Enrichment Data Source: ReccoBeats API
> **Note:** Spotify deprecated the `/audio-features` endpoint for new applications in November 2024. 

To replace this lost data and power the "Audio DNA" features of the app, we use **ReccoBeats**. It accepts Spotify Track IDs and returns the numerical audio features that Spotify no longer provides.

### Endpoints Used

| Request Type | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/v1/audio-features?ids={spotify_ids}` | Fetches audio features (Danceability, Energy, Valence, Acousticness, etc.) based on Spotify IDs. |

### Implementation Details
*   **Batch Limits:** The ReccoBeats API has a maximum batch limit of **40 IDs per request**. The app automatically chunks larger requests to respect this limit.
*   **URL Parsing:** Because ReccoBeats does not return the original Spotify ID directly in its payload, the app parses the Spotify ID from the last segment of the `href` string provided in the response (e.g., `https://api.reccobeats.com/v1/track/{spotify_id}`) to map the features back to the correct track.
*   **Graceful Degradation:** If a specific track is not found in the ReccoBeats database, the API returns a 404 for that ID. The app handles this by skipping missing tracks and rendering the UI for the tracks that *were* found.

---

## 3. Data Flow Summary

1.  User authenticates via Spotify (`GET /authorize`).
2.  App fetches Top Tracks from Spotify (3 parallel `GET` requests).
3.  App merges and deduplicates the tracks by `id`.
4.  App extracts the Spotify IDs from the tracks.
5.  App sends the IDs to ReccoBeats in batches of 40 (`GET`) to get the Audio Features.
6.  The React UI merges both datasets together for the list, detail views, and PDF report.

---

## 4. Error Handling & Race Conditions
Because the app relies on two asynchronous external networks, robust error handling is built into every layer:

*   **`AbortController`:** Every API fetch is tied to an `AbortController`. If the user navigates away from a component before the fetch resolves, the request is aborted. This prevents React memory leaks and eliminates race conditions (e.g., clicking between tracks rapidly).
*   **Four UI States:** The UI explicitly handles **Loading**, **Error** (with a retry button), **Empty** (e.g., no search results), and **Success** states for every data source.
*   **Rate Limiting:** Spotify returns a `429 Too Many Requests` if the API is hit too frequently. The app's fetch wrapper catches this and surfaces a clean error message to the user rather than crashing.

---

## 5. Read-Only Demo Mode (Sandbox)
To ensure the application can be reviewed and graded without requiring a Spotify Developer account whitelist, the app includes a **Demo Mode**.

*   **Bypassing Network:** When Demo Mode is activated, the API fetching hooks bypass network requests and load a static `demo-tracks.json` file.
*   **Strict Sandboxing:** Demo mode is strictly read-only. This prevents reviewers from accidentally modifying their real Spotify accounts (e.g., saving tracks or creating playlists).
*   **Storage Isolation:** User-added Favorites in Demo Mode are stored in a separate `localStorage` namespace (`tunescape_favorites_demo`) from real user data (`tunescape_favorites_real`).