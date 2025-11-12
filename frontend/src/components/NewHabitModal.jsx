// frontend/src/pages/tracking/components/NewHabitModal.jsx
import React, { useState } from "react";

/**
 * NewHabitModal - simple controlled modal for creating a new habit
 * props: visible, onClose, onCreate({ name, description, emoji })
 */
export default function NewHabitModal({ visible, onClose, onCreate }) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [emoji, setEmoji] = useState("💧");

  if (!visible) return null;

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreate({ name: name.trim(), description: desc.trim(), emoji });
    setName("");
    setDesc("");
    onClose();
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal>
      <div className="modal">
        <h3>Create habit</h3>
        <form onSubmit={submit}>
          <label className="field">
            <div className="label">Name</div>
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </label>

          <label className="field">
            <div className="label">Emoji</div>
            <input value={emoji} onChange={(e) => setEmoji(e.target.value)} />
          </label>

          <label className="field">
            <div className="label">Description</div>
            <textarea value={desc} onChange={(e) => setDesc(e.target.value)} />
          </label>

          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button type="button" className="btn ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn primary">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
}
