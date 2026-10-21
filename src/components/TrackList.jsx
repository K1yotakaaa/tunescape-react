import TrackRow from './TrackRow';

export default function TrackList({ tracks, selectedId, onSelect, startIndex = 0 }) {
  return (
    <div className="track-list">
      {tracks.map((track, i) => (
        <TrackRow
          key={track.id}
          track={track}
          rank={startIndex + i + 1}
          isSelected={selectedId === track.id}
          onClick={() => onSelect(track)}
        />
      ))}
    </div>
  );
}