// frontend/src/pages/tracking/components/QuickActions.jsx
import React from "react";

/**
 * QuickActions component
 * props:
 *  - onAddHabit: function to call when "+ Add a new habit" is clicked
 *  - compact: boolean for compact styling (optional)
 */
export default function QuickActions({ onAddHabit, compact = false }) {
  return (
    <div className="hb-quick-actions">
      <div className="hb-section-title-row">
        <div className="hb-section-title">Quick Actions</div>
      </div>

      <div style={{display:"flex", flexDirection:"column", gap:12, marginTop:12}}>
        <button className="hb-quick-btn" onClick={onAddHabit}>
          + Add a new habit
        </button>
        <button className="hb-quick-btn">Review missed tasks</button>
        <button className="hb-quick-btn">Search for habit</button>
      </div>
    </div>
  );
}