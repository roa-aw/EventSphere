import { useEffect, useState } from "react";
import API from "../services/api";

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    const res = await API.get("/events/logs");
    setLogs(res.data || []);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Audit Logs</h1>

      <div className="space-y-2">
        {logs.map((log) => (
          <div key={log.id} className="p-3 bg-white rounded shadow">
            <p>{log.action}</p>
            <p className="text-sm text-gray-500">
              {new Date(log.timestamp).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}