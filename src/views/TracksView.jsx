import { useMemo, useState } from 'react';
import { useTopTracks } from '../hooks/useTopTracks';
import FilterBar from '../components/FilterBar';
import TrackList from '../components/TrackList';
import Pagination from '../components/Pagination';
import TrackDetail from '../components/TrackDetail';
import { LoadingState, ErrorState, EmptyState } from '../components/States';

export default function TracksView() {
  const { tracks, loading, error } = useTopTracks();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('popularity');
  const [rangeFilter, setRangeFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedTrack, setSelectedTrack] = useState(null);

  const filtered = useMemo(() => {
    let list = tracks;

    if (rangeFilter !== 'all') {
      list = list.filter((t) => t.ranges?.includes(rangeFilter));
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.artists?.some((a) => a.name.toLowerCase().includes(q))
      );
    }

    const sorted = [...list];
    switch (sortBy) {
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'artist':
        sorted.sort((a, b) =>
          (a.artists?.[0]?.name || '').localeCompare(b.artists?.[0]?.name || '')
        );
        break;
      case 'duration':
        sorted.sort((a, b) => b.duration_ms - a.duration_ms);
        break;
      case 'popularity':
      default:
        sorted.sort((a, b) => b.popularity - a.popularity);
    }
    return sorted;
  }, [tracks, search, sortBy, rangeFilter]);

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  if (loading) return <LoadingState label="Fetching your top tracks…" />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="view">
      <header className="view-header">
        <h1 className="view-title">Top Tracks</h1>
        <p className="view-sub">
          Aggregated from short, medium, and long term — {tracks.length} unique
          tracks.
        </p>
      </header>

      <FilterBar
        search={search}
        setSearch={(v) => {
          setSearch(v);
          setPage(1);
        }}
        sortBy={sortBy}
        setSortBy={setSortBy}
        rangeFilter={rangeFilter}
        setRangeFilter={(v) => {
          setRangeFilter(v);
          setPage(1);
        }}
      />

      {filtered.length === 0 ? (
        <EmptyState
          message="No tracks match your filters."
          hint="Try clearing the search or changing the range."
        />
      ) : (
        <>
          <TrackList
            tracks={paged}
            startIndex={(page - 1) * pageSize}
            selectedId={selectedTrack?.id}
            onSelect={setSelectedTrack}
          />
          <Pagination
            page={page}
            pageSize={pageSize}
            total={filtered.length}
            setPage={setPage}
            setPageSize={setPageSize}
          />
        </>
      )}

      {selectedTrack && (
        <TrackDetail
          track={selectedTrack}
          onClose={() => setSelectedTrack(null)}
        />
      )}
    </div>
  );
}