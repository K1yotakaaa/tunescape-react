export function LoadingState({ label = 'Loading…' }) {
  return (
    <div className="state">
      <div className="equalizer">
        <span /><span /><span /><span /><span />
      </div>
      <p className="state-label">{label}</p>
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="state state-error">
      <div className="state-icon">⚠</div>
      <p className="state-label">{message}</p>
      {onRetry && (
        <button className="btn btn-outline" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}

export function EmptyState({ message, hint }) {
  return (
    <div className="state state-empty">
      <div className="state-icon">∅</div>
      <p className="state-label">{message}</p>
      {hint && <p className="state-hint">{hint}</p>}
    </div>
  );
}