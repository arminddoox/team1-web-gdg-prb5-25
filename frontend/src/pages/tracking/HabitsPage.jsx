// frontend/src/pages/tracking/HabitsPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import HabitsList from "../../components/HabitsList";
import HabitDetail from "../../components/HabitDetail";
import NewHabitModal from "../../components/NewHabitModal.jsx";
import trackingApi from "../../api/trackingApi";
import { mapHabitsToFrontend, frontendToBackend } from "../../utils/habitMapper";
import "../../styles/App.css";

/**
 * HabitsPage - Now integrated with backend API
 * - Fetches habits from backend
 * - Provides search, selection, create, mark-as-done
 */

export default function HabitsPage() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [viewMode, setViewMode] = useState("cards");
  const [showModal, setShowModal] = useState(false);

  // Load habits from backend
  const loadHabits = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await trackingApi.getAllHabits();
      const backendHabits = response.habits || [];
      const frontendHabits = mapHabitsToFrontend(backendHabits);
      setHabits(frontendHabits);
      
      // Set first habit as selected if none selected
      if (!selectedId && frontendHabits.length > 0) {
        setSelectedId(frontendHabits[0].id);
      }
    } catch (err) {
      console.error("Failed to load habits:", err);
      setError("Failed to load habits. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHabits();
  }, []);

  useEffect(() => {
    // Make sure selected habit still exists
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

  // Actions
  const selectHabit = (id) => setSelectedId(id);

  const addHabit = async (newHabit) => {
    try {
      const backendData = frontendToBackend(newHabit);
      const response = await trackingApi.createHabit(backendData);
      
      // Reload all habits to get updated data
      await loadHabits();
      setShowModal(false);
    } catch (err) {
      console.error("Failed to create habit:", err);
      alert("Failed to create habit. Please try again.");
    }
  };

  const markDone = async (habitId) => {
    try {
      await trackingApi.markHabitComplete(habitId);
      // Reload habits to get updated streaks and logs
      await loadHabits();
    } catch (err) {
      console.error("Failed to mark habit complete:", err);
      alert("Failed to mark habit complete. Please try again.");
    }
  };

  const updateHabit = async (id, patch) => {
    try {
      const backendData = frontendToBackend(patch);
      await trackingApi.updateHabit(id, backendData);
      // Reload habits
      await loadHabits();
    } catch (err) {
      console.error("Failed to update habit:", err);
      alert("Failed to update habit. Please try again.");
    }
  };

  const deleteHabit = async (id) => {
    if (!confirm("Are you sure you want to delete this habit?")) return;
    
    try {
      await trackingApi.deleteHabit(id);
      // Remove from local state
      setHabits((prev) => prev.filter((h) => h.id !== id));
    } catch (err) {
      console.error("Failed to delete habit:", err);
      alert("Failed to delete habit. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="hb-root hb-habits-page">
        <div className="hb-header">
          <div className="hb-brand">HaBiD</div>
          <h2 className="hb-greeting">Habits</h2>
        </div>
        <div className="hb-container" style={{ padding: 40, textAlign: "center" }}>
          Loading habits...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="hb-root hb-habits-page">
        <div className="hb-header">
          <div className="hb-brand">HaBiD</div>
          <h2 className="hb-greeting">Habits</h2>
        </div>
        <div className="hb-container" style={{ padding: 40, textAlign: "center", color: "red" }}>
          {error}
          <br />
          <button onClick={loadHabits} style={{ marginTop: 20 }}>Retry</button>
        </div>
      </div>
    );
  }

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