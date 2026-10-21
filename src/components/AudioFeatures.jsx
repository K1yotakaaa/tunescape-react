import { LoadingState, ErrorState } from './States';

const FEATURES = [
  { key: 'danceability', label: 'Danceability' },
  { key: 'energy', label: 'Energy' },
  { key: 'valence', label: 'Positivity' },
  { key: 'acousticness', label: 'Acousticness' },
  { key: 'speechiness', label: 'Speechiness' },
  { key: 'instrumentalness', label: 'Instrumental' },
];

export default function AudioFeatures({ features, loading, error }) {
  if (loading) return <LoadingState label="Analyzing audio DNA…" />;
  if (error) return <ErrorState message={error} />;
  if (!features) {
    return <p className="muted">No audio features available for this track.</p>;
  }

  return (
    <div className="features">
      <div className="features-title">Audio DNA</div>
      {FEATURES.map(({ key, label }) => {
        const value = features[key] ?? 0;
        const pct = Math.round(value * 100);
        return (
          <div key={key} className="feature-row">
            <span className="feature-label">{label}</span>
            <div className="feature-bar">
              <div
                className="feature-fill"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="feature-value">{pct}</span>
          </div>
        );
      })}
      <div className="feature-extra">
        <span>Tempo {Math.round(features.tempo)} BPM</span>
        <span>Loudness {Math.round(features.loudness)} dB</span>
      </div>
    </div>
  );
}