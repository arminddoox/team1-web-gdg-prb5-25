import React from "react";

export default function StatCard({ title, value, desc, compact = false }) {
  return (
    <div className={`hb-card stat-card ${compact ? "compact" : ""}`}>
      <div className="hb-card-head">
        <div className="hb-card-title" style={{ fontSize: compact ? 12 : 14 }}>{title}</div>
      </div>
      <div style={{ fontSize: compact ? 22 : 36, fontWeight:700, marginTop:8 }}>{value}</div>
      <p className="hb-card-desc" style={{ marginTop:8, fontSize: compact ? 11 : 12 }}>{desc}</p>
    </div>
  );
}
