// frontend/src/pages/tracking/HabitsPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import HabitsList from "../../components/HabitsList";
import HabitDetail from "../../components/HabitDetail";
import NewHabitModal from "../../components/NewHabitModal.jsx";
import "../../styles/App.css";


/**
 * HabitsPage
 * - Manages habits state (localStorage-backed)
 * - Provides search, selection, create, mark-as-done
 */

const LS_KEY = "habits_data_v1";

const nowISO = () => new Date().toISOString();

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

function saveHabits(habits) {
  localStorage.setItem(LS_KEY, JSON.stringify(habits));
}

// helper: returns 'YYYY-MM-DD'
const ymd = (iso) => new Date(iso).toISOString().slice(0, 10);

export default function HabitsPage() {
  const [habits, setHabits] = useState(() => loadHabits());
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(habits[0]?.id || null);
  const [viewMode, setViewMode] = useState("cards"); // "cards" | "table"
  const [showModal, setShowModal] = useState(false);

  useEffect(() => saveHabits(habits), [habits]);

  useEffect(() => {
    // make sure selected exists
    if (!habits.find((h) => h.id === selectedId)) {
      setSelectedId(habits[0]?.id ?? null);
    }
  }, [habits, selectedId]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q
      ? habits.filter((h) => h.name.toLowerCase().includes(q))
      : habits;
  }, [habits, query]);

  // actions
  const selectHabit = (id) => setSelectedId(id);

  const addHabit = (newHabit) => {
    setHabits((prev) => {
      const updated = [{ ...newHabit, id: `h_${Date.now()}`, history: [], streak: 0, status: "No activity yet" }, ...prev];
      return updated;
    });
    setShowModal(false);
  };

  // mark as done for selected habit
  const markDone = (habitId) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== habitId) return h;
        const today = ymd(nowISO());
        const hasToday = h.history.some((d) => ymd(d) === today);
        if (hasToday) return h; // already done

        // compute streak: if yesterday exists then streak+1 else 1
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const ys = yesterday.toISOString().slice(0, 10);
        const hadYesterday = h.history.some((d) => ymd(d) === ys);

        const newStreak = hadYesterday ? (h.streak || 0) + 1 : 1;
        const newHistory = [...h.history, nowISO()].sort();

        const newStatus = newStreak > 0 ? `${newStreak}-day streak` : "Done today";

        return { ...h, history: newHistory, streak: newStreak, status: newStatus };
      })
    );
  };

  const updateHabit = (id, patch) => {
    setHabits((prev) => prev.map((h) => (h.id === id ? { ...h, ...patch } : h)));
  };

  const deleteHabit = (id) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  };

  return (
    <div className="hb-root hb-habits-page">
      <div className="hb-header">
        <div className="hb-brand">HaBiD</div>
        <h2 className="hb-greeting">Habits</h2>
      </div>

      <div className="hb-container hb-habits-centered">
        <div className="hb-habits-layout" style={{ gap: 40 }}>
          <div className="hb-habits-left">
            <div className="hb-habits-left-head">
              <div className="left-title">
                <strong>All Habits</strong>
              </div>

              <div className="left-controls">
                <div className="search">
                  <input
                    className="input"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for habits..."
                    aria-label="Search habits"
                  />
                </div>
              </div>
            </div>

            <HabitsList
              habits={filtered}
              selectedId={selectedId}
              onSelect={selectHabit}
              viewMode={viewMode}
              onAdd={() => setShowModal(true)}
              onDelete={deleteHabit}
            />
          </div>

          <div className="hb-habits-right">
            <HabitDetail
              habit={habits.find((h) => h.id === selectedId) ?? null}
              onMarkDone={() => markDone(selectedId)}
              onUpdate={(patch) => updateHabit(selectedId, patch)}
            />
          </div>
        </div>
      </div>

      <NewHabitModal visible={showModal} onClose={() => setShowModal(false)} onCreate={addHabit} />
    </div>
  );
}
