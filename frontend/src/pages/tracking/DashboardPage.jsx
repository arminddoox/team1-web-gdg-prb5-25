// frontend/src/pages/tracking/DashboardPage.jsx
import React, { useState } from "react";
import StatCard from "../../components/StatCard";
import HabitCard from "../../components/HabitCard";
import QuickActions from "../../components/QuickActions";
import "../../styles/App.css";
import NewHabitButton from "../../components/NewHabitButton";
import NewHabitModal from "../../components/NewHabitModal.jsx";

const sampleHabits = [
  { id: 1, title: "Uống nước", subtitle: "Haven't done in 5 days", desc: "Description, completion rate,", edited: "last edited Oct 25,2025", emoji: "💧" },
  { id: 2, title: "Meditate", subtitle: "4-day streak", desc: "Description, completion rate,", edited: "last edited Oct 25,2025", emoji: "🧘" },
  { id: 3, title: "Jogging", subtitle: "Haven't done in 5 days", desc: "Description, completion rate,", edited: "last edited Oct 25,2025", emoji: "🏃" },
  { id: 4, title: "Học tiếng Trung", subtitle: "Haven't done in 5 days", desc: "Description, completion rate,", edited: "last edited Oct 25,2025", emoji: "📘" },
  { id: 5, title: "Không hút thuốc", subtitle: "Haven't done in 5 days", desc: "Description, completion rate,", edited: "last edited Oct 25,2025", emoji: "🚭" },
];

const LS_KEY = "habits_data_v1";


const defaultHabits = [
  {
    id: "h1",
    name: "Uống nước",
    status: "Haven't done in 5 days",
    streak: 0,
    description: "Drink water regularly to keep hydrated.",
    history: [], // array of ISO strings
  },
  {
    id: "h2",
    name: "Meditate",
    status: "4-day streak",
    streak: 4,
    description: "10 minutes meditation in the morning.",
    history: [],
  },
  {
    id: "h3",
    name: "Jogging",
    status: "Missed yesterday",
    streak: 0,
    description: "Run 3km every other day.",
    history: [],
  },
];

function loadHabits() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return defaultHabits;
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed load habits", e);
    return defaultHabits;
  }
}

export default function DashboardPage() {
  // viewMode: 'cards' or 'table'
  const [viewMode, setViewMode] = useState("cards");
  const [habits, setHabits] = useState(() => loadHabits());

    const [showModal, setShowModal] = useState(false);
    const addHabit = (newHabit) => {
        setHabits((prev) => {
        const updated = [{ ...newHabit, id: `h_${Date.now()}`, history: [], streak: 0, status: "No activity yet" }, ...prev];
        return updated;
        });
        setShowModal(false);
    };

  return (
    <div className="hb-root hb-dashboard-root compact-dashboard">
      <div className="hb-header">
        <div className="hb-brand">HaBiD</div>
        {/* Centered title only — removed stray sidebar text */}
        <h1 className="hb-dashboard-title">Dashboard</h1>
      </div>

      <div className="hb-container hb-dashboard-centered">
        <div className="hb-dashboard-top">
          <div className="hb-dashboard-left">
            <div className="hb-section hb-overview">
              <div className="hb-section-title-row">
                <div className="hb-section-title">Overview</div>
              </div>

              <div className="hb-cards-row hb-dashboard-stats compact">
                <StatCard title="Total Habits" value="5" desc="More than an average user" compact />
                <StatCard title="Active Streaks" value="2" desc="More than an average user" compact />
                <StatCard title="Completion Rate" value="36%" desc="More than an average user" compact />
              </div>
            </div>

            <div className="hb-section">
              <div className="hb-section-title-row" style={{ alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div className="hb-section-title">All Habits</div>
                  <div className="hb-section-subtitle" style={{ color: "#7a7a7a", fontSize: 12 }}>({sampleHabits.length})</div>
                </div>

                {/* Toggle view control */}
                <div className="view-toggle">
                  <button className={`toggle-btn ${viewMode === "cards" ? "active" : ""}`} onClick={() => setViewMode("cards")}>Cards</button>
                  <button className={`toggle-btn ${viewMode === "table" ? "active" : ""}`} onClick={() => setViewMode("table")}>Table</button>
                </div>
              </div>

              {/* content area: card grid or table list */}
              {viewMode === "cards" ? (
                <div className="hb-articles-row hb-dashboard-habits compact">
                  {sampleHabits.map(h => <HabitCard key={h.id} {...h} compact />)}
                </div>
              ) : (
                <div className="habit-table compact">
                  <div className="table-row table-header">
                    <div className="col col-title">Habit</div>
                    <div className="col col-sub">Status</div>
                    <div className="col col-desc">Description</div>
                    <div className="col col-edited">Last edited</div>
                  </div>

                  {sampleHabits.map(h => (
                    <div className="table-row" key={h.id}>
                      <div className="col col-title"><strong>{h.title}</strong></div>
                      <div className="col col-sub">{h.subtitle}</div>
                      <div className="col col-desc">{h.desc}</div>
                      <div className="col col-edited">{h.edited}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="hb-section">
              <div className="hb-section-title-row">
                <div className="hb-section-title">Calendar</div>
              </div>
              <div className="hb-calendar-embed">
                <div className="hb-calendar">
                  <div className="hb-calendar-header">
                    <div className="hb-cal-month">September 2021</div>
                  </div>
                  <div className="hb-cal-grid small">
                    {Array.from({ length: 31 }).map((_, i) => {
                      const day = i + 1;
                      const active = day === 19;
                      return (
                        <div key={day} className="hb-cal-day">{active ? <div className="hb-cal-day-active">{day}</div> : <span>{day}</span>}</div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

          </div>

          <aside className="hb-dashboard-right">
            <QuickActions compact />
          </aside>
        </div>
      </div>

      <NewHabitButton onAdd={() => setShowModal(true)} />
      <NewHabitModal visible={showModal} onClose={() => setShowModal(false)} onCreate={addHabit} />
    </div>
  );
}
