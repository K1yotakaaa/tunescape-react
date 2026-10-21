import { useEffect, useRef } from 'react';

export default function SpotifyEmbed({ trackId }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.src = `https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`;
    }
  }, [trackId]);

  return (
    <iframe
      ref={ref}
      title="Spotify player"
      width="100%"
      height="152"
      frameBorder="0"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      style={{ borderRadius: 12, border: 0, marginTop: 16 }}
    />
  );
}