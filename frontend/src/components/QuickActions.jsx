// frontend/src/pages/tracking/components/QuickActions.jsx
import React from "react";

export default function QuickActions() {
  return (
    <div className="hb-quick-actions">
      <div className="hb-section-title-row"><div className="hb-section-title">Quick Actions</div></div>

      <div style={{display:"flex", flexDirection:"column", gap:12, marginTop:12}}>
        <button className="hb-quick-btn">+ Add a new habit</button>
        <button className="hb-quick-btn">Review missed tasks</button>
        <button className="hb-quick-btn">Search for habit</button>
      </div>
    </div>
  );
}
