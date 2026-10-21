import { useAuth } from '../context/AuthContext';

const NAV = [
  { id: 'tracks', label: 'Top Tracks', icon: '♫' },
  { id: 'favorites', label: 'Favorites', icon: '★' },
  { id: 'report', label: 'Report', icon: '⤓' },
];

export default function Sidebar({ activeView, setActiveView }) {
  const { user, logout, demoMode } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="brand-dot" />
        TUNESCAPE
      </div>

      <div className="sidebar-user">
        <div className="user-avatar">
          {user?.images?.[0]?.url ? (
            <img src={user.images[0].url} alt="" />
          ) : (
            (user?.display_name || '?')[0].toUpperCase()
          )}
        </div>
        <div>
          <div className="user-name">{user?.display_name || 'Listener'}</div>
          <div className="user-tag">
            {demoMode ? 'Demo mode' : 'Spotify connected'}
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {NAV.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activeView === item.id ? 'active' : ''}`}
            onClick={() => setActiveView(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <button className="btn btn-ghost btn-sm sidebar-exit" onClick={logout}>
        Sign out
      </button>
    </aside>
  );
}