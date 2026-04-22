export default function EmptyState({ title, message, action }) {
  return (
    <div className="card">
      <div className="card-body" style={{ textAlign: "center", padding: "60px 20px" }}>
        <p style={{ fontSize: "48px", marginBottom: "15px" }}>📭</p>
        <h3 style={{ marginBottom: "10px" }}>{title}</h3>
        <p style={{ color: "#666", marginBottom: "20px" }}>{message}</p>
        {action && (
          <button className="btn btn-primary" onClick={action.onClick}>
            {action.label}
          </button>
        )}
      </div>
    </div>
  );
}
