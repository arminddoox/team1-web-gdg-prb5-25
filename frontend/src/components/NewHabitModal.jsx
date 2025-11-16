// frontend/src/pages/tracking/components/NewHabitModal.jsx
import React, { useState } from "react";

/**
 * NewHabitModal - simple controlled modal for creating a new habit
 * props: visible, onClose, onCreate({ name, description, emoji })
 */
export default function NewHabitModal({ visible, onClose, onCreate }) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [emoji, setEmoji] = useState("🎯");

  if (!visible) return null;

  const submit = (event) => {
    event.preventDefault();
    if (!name.trim()) return;
    onCreate({ name: name.trim(), description: desc.trim(), emoji });
    setName("");
    setDesc("");
    onClose();
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal>
      <div className="modal-content">
        <h3 className="padding-bottom">Create habit</h3>
        <form onSubmit={submit}>
          <label className="field">
            <div className="label">Name</div>
            <input className="input" value={name} onChange={(event) => setName(event.target.value)} required />
          </label>

          <label className="field">
            <div className="label">Emoji</div>
            <input className="input" value={emoji} onChange={(event) => setEmoji(event.target.value)} />
          </label>

          <label className="field">
            <div className="label">Description</div>
            <textarea className="input" value={desc} onChange={(event) => setDesc(event.target.value)} />
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
