// frontend/src/pages/tracking/DashboardPage.jsx
import React, { useState, useEffect } from "react";
import StatCard from "../../components/StatCard";
import HabitCard from "../../components/HabitCard";
import QuickActions from "../../components/QuickActions";
import NewHabitButton from "../../components/NewHabitButton";
import NewHabitModal from "../../components/NewHabitModal.jsx";
import trackingApi from "../../api/trackingApi";
import { mapHabitsToFrontend, mapSummaryToFrontend, frontendToBackend } from "../../utils/habitMapper";
import "../../styles/App.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

function Calendar() {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const handlePrev = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNext = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const isToday = (day) =>
    day === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear();

  return (
    <div className="hb-calendar">
      <div className="hb-calendar-header">
        <ChevronLeft onClick={handlePrev} style={{ cursor: "pointer" }}/>
        <div className="hb-cal-month">
          {monthNames[month]} {year}
        </div>
        <ChevronRight onClick={handleNext} style={{ cursor: "pointer" }}/>
      </div>

      <div className="hb-cal-weekdays">
        {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d) => (
          <div key={d} className="hb-cal-weekday">{d}</div>
        ))}
      </div>

      <div className="hb-cal-grid">
        {Array.from({ length: firstDayIndex }).map((_, i) => (
          <div key={`empty-${i}`} className="hb-cal-day empty"></div>
        ))}

        {days.map((day) => (
          <div key={day} className="hb-cal-day">
            {isToday(day) ? (
              <div className="hb-cal-day-active">{day}</div>
            ) : (
              <span>{day}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [viewMode, setViewMode] = useState("cards");
  const [habits, setHabits] = useState([]);
  const [summary, setSummary] = useState({ totalHabits: 0, activeStreaks: 0, completionRate: 0 });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Load data from backend
  const loadData = async () => {
    try {
      setLoading(true);
      
      // Parallel fetch habits and summary
      const [habitsResponse, summaryResponse] = await Promise.all([
        trackingApi.getAllHabits(),
        trackingApi.getTrackingSummary()
      ]);

      const backendHabits = habitsResponse.habits || [];
      const frontendHabits = mapHabitsToFrontend(backendHabits);
      setHabits(frontendHabits);

      const frontendSummary = mapSummaryToFrontend(summaryResponse.summary);
      setSummary(frontendSummary);
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const addHabit = async (newHabit) => {
    try {
      const backendData = frontendToBackend(newHabit);
      await trackingApi.createHabit(backendData);
      
      // Reload data
      await loadData();
      setShowModal(false);
    } catch (err) {
      console.error("Failed to create habit:", err);
      alert("Failed to create habit. Please try again.");
    }
  };

  // Convert habits to display format for cards/table
  const displayHabits = habits.map(h => ({
    id: h.id,
    title: h.name,
    subtitle: h.status,
    desc: h.description || "No description",
    edited: h.createdAt ? `Created ${new Date(h.createdAt).toLocaleDateString()}` : "",
    emoji: h.emoji || "🎯"
  }));

  if (loading) {
    return (
      <div className="hb-root hb-dashboard-root compact-dashboard">
        <div className="hb-header">
          <div className="hb-brand">HaBiD</div>
          <h1 className="hb-dashboard-title">Dashboard</h1>
        </div>
        <div className="hb-container" style={{ padding: 40, textAlign: "center" }}>
          Loading dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="hb-root hb-dashboard-root compact-dashboard">
      <div className="hb-header">
        <div className="hb-brand">HaBiD</div>
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
                <StatCard 
                  title="Total Habits" 
                  value={summary.totalHabits} 
                  desc="Active habits tracked" 
                  compact 
                />
                <StatCard 
                  title="Active Streaks" 
                  value={summary.activeStreaks} 
                  desc="Habits with ongoing streaks" 
                  compact 
                />
                <StatCard 
                  title="Completion Rate" 
                  value={`${summary.completionRate}%`} 
                  desc="Overall completion" 
                  compact 
                />
              </div>
            </div>

            <div className="hb-section">
              <div className="hb-section-title-row" style={{ alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div className="hb-section-title">All Habits</div>
                  <div className="hb-section-subtitle" style={{ color: "#7a7a7a", fontSize: 12 }}>
                    ({displayHabits.length})
                  </div>
                </div>

                <div className="view-toggle">
                  <button 
                    className={`toggle-btn ${viewMode === "cards" ? "active" : ""}`} 
                    onClick={() => setViewMode("cards")}
                  >
                    Cards
                  </button>
                  <button 
                    className={`toggle-btn ${viewMode === "table" ? "active" : ""}`} 
                    onClick={() => setViewMode("table")}
                  >
                    Table
                  </button>
                </div>
              </div>

              {displayHabits.length === 0 ? (
                <div style={{ padding: 40, textAlign: "center", color: "#7a7a7a" }}>
                  No habits yet. Create your first habit!
                </div>
              ) : viewMode === "cards" ? (
                <div className="hb-articles-row hb-dashboard-habits compact">
                  {displayHabits.map(h => <HabitCard key={h.id} {...h} compact />)}
                </div>
              ) : (
                <div className="habit-table compact">
                  <div className="table-row table-header">
                    <div className="col col-title">Habit</div>
                    <div className="col col-sub">Status</div>
                    <div className="col col-desc">Description</div>
                    <div className="col col-edited">Created</div>
                  </div>

                  {displayHabits.map(h => (
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
                <Calendar />
              </div>
            </div>
          </div>

          <aside className="hb-dashboard-right">
            <QuickActions compact onAddHabit={() => setShowModal(true)} />
          </aside>
        </div>
      </div>

      <NewHabitButton onAdd={() => setShowModal(true)} />
      <NewHabitModal visible={showModal} onClose={() => setShowModal(false)} onCreate={addHabit} />
    </div>
  );
}