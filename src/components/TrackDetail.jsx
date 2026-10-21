import { useAuth } from '../context/AuthContext';
import SpotifyEmbed from './SpotifyEmbed';
import AudioFeatures from './AudioFeatures';
import { useAudioFeatures } from '../hooks/useAudioFeatures';

export default function TrackDetail({ track, onClose }) {
  const { demoMode } = useAuth();
  const { features, loading, error } = useAudioFeatures(track?.id);

  if (!track) return null;

  const cover = track.album?.images?.[0]?.url;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        style={{ '--album-art': cover ? `url(${cover})` : 'none' }}
      >
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ✕
        </button>

        <div className="detail-left">
          <div className="detail-header">
            <div className="detail-media">
              <span className="detail-vinyl" aria-hidden="true" />
              {cover && <img className="detail-cover" src={cover} alt="" />}
              <span className="detail-arm" aria-hidden="true" />
            </div>

            <div className="detail-text">
              <h2 className="detail-title">{track.name}</h2>
              <p className="detail-artist">
                {track.artists?.map((a) => a.name).join(', ')}
              </p>
              <p className="detail-album">{track.album?.name}</p>
              <div className="detail-tags">
                <span className="tag">Popularity {track.popularity}</span>
                {track.duration_ms > 0 && (
                  <span className="tag">
                    {Math.floor(track.duration_ms / 60000)}:
                    {String(Math.floor((track.duration_ms % 60000) / 1000)).padStart(2, '0')}
                  </span>
                )}
              </div>
            </div>
          </div>

          {demoMode ? (
            <div className="play-lock">🎧 LOG IN TO PLAY TRACKS</div>
          ) : (
            <SpotifyEmbed trackId={track.id} />
          )}
        </div>

        <div className="detail-right">
          <AudioFeatures features={features} loading={loading} error={error} />
        </div>
      </div>
    </div>
  );
}