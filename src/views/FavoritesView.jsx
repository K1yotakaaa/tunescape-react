import { useMemo, useState } from 'react';
import { useTopTracks } from '../hooks/useTopTracks';
import { useAuth } from '../context/AuthContext';
import FavoriteForm from '../components/FavoriteForm';
import FavoriteList from '../components/FavoriteList';
import TrackDetail from '../components/TrackDetail';
import { loadFavorites, saveFavorites, makeId } from '../lib/storage';
import { LoadingState } from '../components/States';

export default function FavoritesView() {
  const { demoMode } = useAuth();
  const { tracks, loading } = useTopTracks();
  
  const [favorites, setFavorites] = useState(() => loadFavorites(demoMode));
  
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedFav, setSelectedFav] = useState(null);

  const addFavorite = (data) => {
    if (demoMode) return;
    const newFav = {
      id: makeId(),
      addedAt: new Date().toISOString(),
      ...data,
    };
    const next = [newFav, ...favorites];
    setFavorites(next);
    saveFavorites(next, demoMode);
  };

  const removeFavorite = (id) => {
    if (demoMode) return;
    const next = favorites.filter((f) => f.id !== id);
    setFavorites(next);
    saveFavorites(next, demoMode);
  };

  const filteredAndSorted = useMemo(() => {
    let list = favorites;

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (f) =>
          f.trackName.toLowerCase().includes(q) ||
          f.artistName.toLowerCase().includes(q) ||
          f.mood.toLowerCase().includes(q)
      );
    }

    const sorted = [...list];
    switch (sortBy) {
      case 'rating':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
        sorted.sort((a, b) => a.trackName.localeCompare(b.trackName));
        break;
      case 'newest':
      default:
        sorted.sort((a, b) => b.addedAt.localeCompare(a.addedAt));
    }
    return sorted;
  }, [favorites, search, sortBy]);

  if (loading) return <LoadingState label="Loading tracks…" />;

  return (
    <div className="view">
      <header className="view-header">
        <h1 className="view-title">Favorites</h1>
        <p className="view-sub">
          Rate and remember the tracks that hit different.
        </p>
      </header>

      <div className="favorites-layout">
        <FavoriteForm tracks={tracks} onAdd={addFavorite} readOnly={demoMode} />
        
        <div>
          <div className="filter-bar" style={{ marginBottom: '16px', gridTemplateColumns: '2fr 1fr' }}>
            <input
              className="input search-input"
              placeholder="Search favorites by track, artist, or mood…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="input select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="rating">Highest Rated</option>
              <option value="name">Name A→Z</option>
            </select>
          </div>

          <FavoriteList 
            favorites={filteredAndSorted} 
            onRemove={removeFavorite} 
            readOnly={demoMode} 
            onSelect={setSelectedFav}
          />
        </div>
      </div>

      {selectedFav && (
        <TrackDetail
          track={{
            id: selectedFav.trackId,
            name: selectedFav.trackName,
            artists: [{ name: selectedFav.artistName }],
            album: { images: [{ url: selectedFav.imageUrl }] },
            popularity: 0,
            duration_ms: 0,
          }}
          onClose={() => setSelectedFav(null)}
        />
      )}
    </div>
  );
}