import React, { useEffect, useMemo, useState } from "react";

export default function NewHabitButton({onAdd}) {
    
    return (
        <button className="new-habit-btn" onClick={onAdd}><span>New habit</span></button>
    );
}
