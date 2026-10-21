import FavoriteRow from './FavoriteRow';
import { EmptyState } from './States';

export default function FavoriteList({ favorites, onRemove, readOnly, onSelect }) {
  if (favorites.length === 0) {
    return (
      <EmptyState
        message="No favorites found."
        hint={readOnly ? "Log in to add your own." : "Try a different search, or add a new track."}
      />
    );
  }
  return (
    <div className="favorite-list">
      {favorites.map((fav) => (
        <FavoriteRow 
          key={fav.id} 
          fav={fav} 
          onRemove={onRemove} 
          readOnly={readOnly} 
          onSelect={() => onSelect(fav)}
        />
      ))}
    </div>
  );
}