export default function EventFilters({ searchTerm, onSearchChange, onReset }) {
  return (
    <div className="card" style={{ marginBottom: "30px" }}>
      <div className="card-body">
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label>Search Events</label>
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              type="text"
              placeholder="Search by event name or description..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              style={{ flex: 1 }}
            />
            {searchTerm && (
              <button className="btn btn-secondary" onClick={onReset}>
                Clear
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
