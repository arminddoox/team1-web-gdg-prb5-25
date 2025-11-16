import React from "react";

export default function EditHabitModal({ habit, onClose, onUpdate }) {
  const [name, setName] = React.useState(habit.name);
  const [description, setDescription] = React.useState(habit.description);
  const [frequency, setFrequency] = React.useState(habit.frequency);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState(null);

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    try {
        // Convert UI → backend format
        const patch = {
        title: name,        // IMPORTANT: backend uses "title"
        description,
        frequency
        };

        // Call parent update
        await onUpdate(patch);

        onClose();
    } catch (err) {
        setError(err.message || "Something went wrong");
    } finally {
        setSaving(false);
    }
    };


  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Edit Habit</h3>

        {error && <div style={{ color: "red" }}>{error}</div>}

        <label>
          Name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Habit name"
          />
        </label>

        <label>
          Description
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Habit description"
          />
        </label>

        <label>
          Frequency
          <select value={frequency} onChange={(e) => setFrequency(e.target.value)}>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </label>

        <form
          onSubmit={(e) => {
            e.preventDefault(); // prevent page reload
            handleSave();
          }}
        >
          <div className="modal-actions">
            <button type="button" onClick={onClose} disabled={saving}>
              Cancel
            </button>
            <button 
              type="button" 
              onClick={() => {
                handleSave();
              }}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}