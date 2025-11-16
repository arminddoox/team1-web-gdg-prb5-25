// frontend/src/pages/tracking/components/HabitListItem.jsx
import React, { useState } from "react";
import EditHabitModal from "./EditHabitModal.jsx"; // We'll create this modal
import PropTypes from "prop-types";

/**
 * HabitListItem - single row table-like item with icons and actions
 * Props:
 *  - habit (object)
 *  - selected (bool)
 *  - onSelect() - called when row clicked
 *  - viewMode (optional)
 *  - onDelete()
 *  - onQuickMark() optional quick mark function
 *  - onUpdate() optional update function
 */

const StatusDot = ({ color = "gray" }) => {
  const map = {
    red: "#ef4444",
    green: "#10b981",
    orange: "#f59e0b",
    gray: "#6b7280",
  };
  return (
    <span
      className="dot-inline"
      style={{ background: map[color] || map.gray }}
      aria-hidden
    />
  );
};

const Icon = {
  Calendar: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.2" />
      <path d="M16 3v4M8 3v4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  ),
  Edit: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M3 21l3-1 11-11 1-3-3 1L4 20z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  More: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="5" cy="12" r="1.5" fill="currentColor" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      <circle cx="19" cy="12" r="1.5" fill="currentColor" />
    </svg>
  ),
  Check: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
};

function statusColor(habit) {
  const s = (habit.status || "").toLowerCase();
  if (s.includes("miss") || s.includes("haven't")) return "red";
  if (s.includes("streak") && habit.streak > 0) return "orange";
  if (habit.streak >= 1) return "green";
  return "gray";
}

export default function HabitListItem({
  habit,
  selected,
  onSelect,
  onDelete,
  onQuickMark,
  onUpdate,
}) {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const color = statusColor(habit);
  const todayDone = habit.history?.some((d) => d.slice(0, 10) === new Date().toISOString().slice(0, 10));

  const handleEdit = () => setEditModalVisible(true);

  const handleUpdate = (patch) => {
    console.log("HabitListItem: handleUpdate called", habit.id, patch);
    onUpdate?.(habit.id, patch);
    setEditModalVisible(false);
  };

  const handleMore = () => {
    alert(`More options for "${habit.name}" (can implement archive, copy, etc.)`);
  };

  return (
    <>
      <div
        className={`habit-row ${selected ? "selected" : ""}`}
        onClick={onSelect}
        role="row"
        tabIndex={0}
        onKeyDown={(event) => { if (event.key === "Enter") onSelect?.(); }}
      >
        <div className="start-row">
          <div className="col col-checkbox">
            <button
              className={`icon-btn ${todayDone ? "active" : ""}`}
              onClick={(e) => { e.stopPropagation(); onQuickMark?.(habit.id); }}
              title={todayDone ? "Already done today" : "Mark done today"}
              aria-pressed={todayDone}
            >
              <Icon.Check />
            </button>
          </div>

          <div className="col col-name">
            <div className="h-name">{habit.name}</div>
          </div>

          <div className="col col-status">
            <div className="status-inline">
              <StatusDot color={color} /> <span className="status-text">{habit.status}</span>
            </div>
          </div>

          <div className="col col-last">
            {habit.history?.length
              ? new Date(habit.history[habit.history.length - 1]).toLocaleDateString()
              : "-"}
          </div>
        </div>

        <div className="col col-actions" onClick={(e) => e.stopPropagation()}>
          <button className="icon-btn no-border" title="Open calendar">
            <Icon.Calendar />
          </button>

          <button className="icon-btn no-border" title="Edit" onClick={handleEdit}>
            <Icon.Edit />
          </button>

          <button className="icon-btn no-border" title="More" onClick={handleMore}>
            <Icon.More />
          </button>

          <button className="small ghost" onClick={() => onDelete?.(habit.id)}>Delete</button>
        </div>
      </div>

      {editModalVisible && (
        <EditHabitModal
          habit={habit}
          visible={editModalVisible}
          onClose={() => setEditModalVisible(false)}
          onUpdate={handleUpdate}
        />
      )}
    </>
  );
}

HabitListItem.propTypes = {
  habit: PropTypes.object.isRequired,
  selected: PropTypes.bool,
  onSelect: PropTypes.func,
  onDelete: PropTypes.func,
  onQuickMark: PropTypes.func,
  onUpdate: PropTypes.func,
};