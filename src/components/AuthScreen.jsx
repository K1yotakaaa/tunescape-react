import { useAuth } from '../context/AuthContext';

export default function AuthScreen() {
  const { login, enterDemoMode, error } = useAuth();

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="brand-mark">
          <span className="brand-dot" />
          TUNESCAPE
        </div>
        
        <div className="cassette-illustration">
          <div className="cassette-window">
            <div className="cassette-reel"></div>
            <div className="cassette-reel"></div>
          </div>
          <div className="cassette-bottom"></div>
        </div>

        <h1 className="auth-title">
          Your <span className="text-glow">Wrapped</span>, on demand.
        </h1>
        <p className="auth-sub">
          Spotify shows your year in music once. Tunescape shows it anytime.
          Connect your account, browse your top tracks, save favorites, and
          download a shareable PDF report.
        </p>

        <button className="btn btn-spotify btn-lg" onClick={login}>
          <SpotifyIcon /> Log in with Spotify
        </button>

        <button className="btn btn-ghost btn-lg" onClick={enterDemoMode}>
          Browse demo →
        </button>

        {error && <p className="auth-error">{error}</p>}

        <p className="auth-note">
          Your data stays in your browser. No account, no server, no tracking.
        </p>
      </div>
    </div>
  );
}

function SpotifyIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.52 17.34c-.24.36-.66.48-1.02.24-2.82-1.74-6.36-2.1-10.56-1.14-.42.12-.78-.18-.9-.54-.12-.42.18-.78.54-.9 4.56-1.02 8.52-.6 11.64 1.32.42.18.48.66.3 1.02zm1.44-3.3c-.3.42-.84.6-1.26.3-3.24-1.98-8.16-2.58-11.94-1.38-.48.12-1.02-.12-1.14-.6-.12-.48.12-1.02.6-1.14 4.38-1.32 9.78-.66 13.5 1.62.36.18.54.78.24 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.3c-.54.18-1.14-.18-1.32-.72-.18-.54.18-1.14.72-1.32 4.26-1.26 11.28-1.02 15.72 1.62.48.3.66.96.36 1.44-.3.36-.96.54-1.44.24z" />
    </svg>
  );
}