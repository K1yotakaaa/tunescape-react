export default function Pagination({
  page,
  pageSize,
  total,
  setPage,
  setPageSize,
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return (
    <div className="pagination">
      <div className="pagination-info">
        {start}–{end} of {total}
      </div>

      <div className="pagination-controls">
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          ←
        </button>
        <span className="pagination-page">
          {page} / {totalPages}
        </span>
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page >= totalPages}
        >
          →
        </button>
      </div>

      <select
        className="input select select-sm"
        value={pageSize}
        onChange={(e) => {
          setPageSize(Number(e.target.value));
          setPage(1);
        }}
      >
        <option value={5}>5 / page</option>
        <option value={10}>10 / page</option>
        <option value={25}>25 / page</option>
        <option value={50}>50 / page</option>
      </select>
    </div>
  );
}