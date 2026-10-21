export default function FilterBar({
  search,
  setSearch,
  sortBy,
  setSortBy,
  rangeFilter,
  setRangeFilter,
  showRangeFilter = true,
}) {
  return (
    <div className="filter-bar">
      <input
        className="input search-input"
        placeholder="Search by track or artist…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {showRangeFilter && (
        <select
          className="input select"
          value={rangeFilter}
          onChange={(e) => setRangeFilter(e.target.value)}
          aria-label="Filter by time range"
        >
          <option value="all">All ranges</option>
          <option value="short_term">Last 4 weeks</option>
          <option value="medium_term">Last 6 months</option>
          <option value="long_term">All time</option>
        </select>
      )}

      <select
        className="input select"
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        aria-label="Sort by"
      >
        <option value="popularity">Popularity ↓</option>
        <option value="name">Name A→Z</option>
        <option value="artist">Artist A→Z</option>
        <option value="duration">Duration ↓</option>
      </select>
    </div>
  );
}