export default function FavoriteRow({ fav, onRemove, readOnly, onSelect }) {
  return (
    <div 
      className="favorite-row" 
      onClick={onSelect}
      style={{ cursor: 'pointer' }}
      title="Click to view details & play"
    >
      {fav.imageUrl ? (
        <img className="fav-img" src={fav.imageUrl} alt="" />
      ) : (
        <div className="fav-img cover-ph">♫</div>
      )}
      <div className="fav-body">
        <div className="fav-name">{fav.trackName}</div>
        <div className="fav-artist">{fav.artistName}</div>
        <div className="fav-meta">
          <span className="tag tag-mood">{fav.mood}</span>
          <span className="fav-stars">{'★'.repeat(fav.rating)}</span>
        </div>
        {fav.note && <div className="fav-note">“{fav.note}”</div>}
      </div>
      
      {!readOnly && (
        <button
          className="btn btn-ghost btn-sm fav-remove"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(fav.id);
          }}
        >
          Remove
        </button>
      )}
    </div>
  );
}