// frontend/src/pages/tracking/components/HabitsList.jsx
import React from "react";
import HabitListItem from "./HabitListItem";

/**
 * HabitsList - left panel list (scrollable)
 * props: habits, selectedId, onSelect, viewMode, onAdd, onDelete
 */

export default function HabitsList({ habits = [], selectedId, onSelect, viewMode = "cards", onAdd, onDelete, onUpdate }) {
  return (
    <div className="hb-habits-list">
      <div className="hb-habits-actions">
        <button className="hb-quick-btn" onClick={onAdd}>Add a new habit</button>
      </div>

      <div className="hb-habits-scroll" role="list">
        {habits.length === 0 && <div className="empty">No habits found</div>}
        {habits.map((h) => (
          <HabitListItem
            key={h.id}
            habit={h}
            selected={h.id === selectedId}
            onSelect={() => onSelect(h.id)}
            viewMode={viewMode}
            onDelete={() => onDelete(h.id)}
            onUpdate={onUpdate}
          />
        ))}
      </div>
    </div>
  );
}
