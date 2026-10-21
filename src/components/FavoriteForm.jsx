import { useState } from 'react';

const MOODS = ['chill', 'hype', 'sad', 'focus', 'party'];

export default function FavoriteForm({ tracks, onAdd, readOnly }) {
  const [trackId, setTrackId] = useState('');
  const [rating, setRating] = useState(5);
  const [note, setNote] = useState('');
  const [mood, setMood] = useState('chill');
  const [submitted, setSubmitted] = useState(false);

  const selected = tracks.find((t) => t.id === trackId);

  if (readOnly) {
    return (
      <div className="favorite-form" style={{ textAlign: 'center', justifyContent: 'center' }}>
        <h3 className="form-title">Demo Mode</h3>
        <p className="muted" style={{ marginBottom: '16px' }}>
          Log in with Spotify to save your own favorites.
        </p>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selected) return;
    onAdd({
      trackId: selected.id,
      trackName: selected.name,
      artistName: selected.artists?.map((a) => a.name).join(', ') || '—',
      imageUrl: selected.album?.images?.[0]?.url || '',
      rating,
      note: note.trim(),
      mood,
    });
    setTrackId('');
    setRating(5);
    setNote('');
    setMood('chill');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
  };

  return (
    <form className="favorite-form" onSubmit={handleSubmit}>
      <h3 className="form-title">Add to Favorites</h3>

      <label className="form-field">
        <span>Track</span>
        <select
          className="input"
          value={trackId}
          onChange={(e) => setTrackId(e.target.value)}
          required
        >
          <option value="">— Select a track —</option>
          {tracks.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name} — {t.artists?.[0]?.name}
            </option>
          ))}
        </select>
      </label>

      <label className="form-field">
        <span>Rating</span>
        <div className="stars">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              className={`star ${rating >= n ? 'on' : ''}`}
              onClick={() => setRating(n)}
              aria-label={`${n} stars`}
            >
              ★
            </button>
          ))}
        </div>
      </label>

      <label className="form-field">
        <span>Mood</span>
        <div className="mood-pills">
          {MOODS.map((m) => (
            <button
              key={m}
              type="button"
              className={`pill ${mood === m ? 'active' : ''}`}
              onClick={() => setMood(m)}
            >
              {m}
            </button>
          ))}
        </div>
      </label>

      <label className="form-field">
        <span>Note</span>
        <textarea
          className="input textarea"
          rows={3}
          maxLength={200}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Why does this track matter to you?"
        />
      </label>

      <button className="btn btn-primary" type="submit" disabled={!trackId}>
        {submitted ? '✓ Saved' : 'Save favorite'}
      </button>
    </form>
  );
}