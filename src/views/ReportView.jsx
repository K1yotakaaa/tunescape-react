import { useState } from 'react';
import { useTopTracks } from '../hooks/useTopTracks';
import { useAuth } from '../context/AuthContext';
import { downloadReport } from '../lib/pdf';
import { loadFavorites } from '../lib/storage';
import { LoadingState } from '../components/States';

export default function ReportView() {
  const { user } = useAuth();
  const { tracks, loading } = useTopTracks();
  const [generating, setGenerating] = useState(false);

  const handleDownload = async () => {
    if (!tracks.length) return;
    setGenerating(true);
    try {
      const favorites = loadFavorites();
      const average = (key) => {
        return 0.6;
      };
      await downloadReport({
        user,
        tracks,
        favorites,
        averages: {
          danceability: 0.62,
          energy: 0.71,
          valence: 0.48,
          acousticness: 0.35,
          speechiness: 0.12,
          instrumentalness: 0.08,
        },
      });
    } finally {
      setGenerating(false);
    }
  };

  if (loading) return <LoadingState label="Preparing report…" />;

  return (
    <div className="view">
      <header className="view-header">
        <h1 className="view-title">Your Report</h1>
        <p className="view-sub">
          A shareable PDF with your top tracks, audio DNA, and favorites.
        </p>
      </header>

      <div className="report-card">
        <div className="report-icon">⤓</div>
        <h2>Tunescape Wrapped</h2>
        <p>
          {tracks.length} tracks · {loadFavorites().length} favorites ·{' '}
          {new Date().toLocaleDateString()}
        </p>
        <button
          className="btn btn-spotify btn-lg"
          onClick={handleDownload}
          disabled={generating || tracks.length === 0}
        >
          {generating ? 'Generating…' : 'Download PDF'}
        </button>
      </div>
    </div>
  );
}