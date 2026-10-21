export default function TrackRow({ track, rank, onClick, isSelected }) {
  const cover = track.album?.images?.[0]?.url;
  const artist = track.artists?.map((a) => a.name).join(', ');

  return (
    <button
      className={`track-row ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
      type="button"
    >
      <span className="track-rank">{rank}</span>
      <div className="track-cover">
        {cover ? <img src={cover} alt="" /> : <div className="cover-ph">♫</div>}
      </div>
      <div className="track-info">
        <div className="track-name">{track.name}</div>
        <div className="track-artist">{artist}</div>
      </div>
      <div className="track-meta">
        <span className="track-pop">{track.popularity}</span>
        <div className="pop-bar">
          <div
            className="pop-fill"
            style={{ width: `${track.popularity}%` }}
          />
        </div>
      </div>
    </button>
  );
}