// frontend/src/pages/tracking/components/HabitDetail.jsx
import React, { useMemo } from "react";

/**
 * HabitDetail - right panel
 * props:
 *  - habit (object) or null
 *  - onMarkDone() -> called when mark done clicked
 *  - onUpdate(patch)
 */
function fmtTime(iso) {
  const d = new Date(iso);
  return `${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} ${d.toLocaleDateString()}`;
}

export default function HabitDetail({ habit, onMarkDone, onUpdate }) {
  const todayYmd = new Date().toISOString().slice(0, 10);
  const alreadyDone = habit?.history?.some((d) => d.slice(0, 10) === todayYmd);

  const activity = useMemo(() => {
    if (!habit) return [];
    return [...(habit.history || [])].sort((a, b) => new Date(b) - new Date(a));
  }, [habit]);

  if (!habit) {
    return (
      <div className="hb-article-card no-selection">
        <div className="empty">Select a habit to see details</div>
      </div>
    );
  }

  return (
    <div className="hb-habit-detail">
      <div className="detail-head">
        <div className="title">
          <div className="emoji" aria-hidden>{habit.emoji ?? "🔔"}</div>
          <div>
            <h3 style={{margin:0}}>{habit.name}</h3>
            <div className="muted">{habit.streak || 0}-day streak</div>
          </div>
        </div>

        <div className="cta">
          <button
            className={`btn primary ${alreadyDone ? "disabled" : ""}`}
            onClick={() => { if (!alreadyDone) onMarkDone(); }}
            disabled={alreadyDone}
          >
            {alreadyDone ? "Done today" : "Mark as done"}
          </button>
        </div>
      </div>

      <hr className="muted-sep" />

      <section className="detail-section">
        <h4 className="section-title">Description</h4>
        <div className="section-body">{habit.description}</div>
      </section>

      <section className="detail-section">
        <h4 className="section-title">Activity</h4>
        <div className="activity-list">
          {activity.length === 0 && <div className="muted">No activity yet</div>}
          {activity.map((iso) => (
            <div key={iso} className="activity-item">
              <div className="activity-left">
                <div className="activity-dot done" />
              </div>
              <div className="activity-main">
                Done {fmtTime(iso)}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="detail-section">
        <h4 className="section-title">Calendar</h4>
        <div className="calendar-compact" aria-hidden>
          {/* small month grid, highlights days */}
          {(() => {
            const days = Array.from({ length: 30 }).map((_, i) => i + 1);
            return (
              <div className="calendar-grid">
                {days.map((d) => {
                  const dayKey = (() => {
                    const now = new Date();
                    now.setDate(d);
                    return now.toISOString().slice(0, 10);
                  })();
                  const done = habit.history.some((h) => h.slice(0, 10) === dayKey);
                  return (
                    <div key={d} className={`calendar-day ${done ? "done" : ""}`}>
                      {d}
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      </section>

    </div>
  );
}
