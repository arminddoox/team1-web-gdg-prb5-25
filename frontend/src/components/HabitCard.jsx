import React from "react";

export default function HabitCard({ title, subtitle, desc, edited, emoji, compact = false }) {
  return (
    <article className={`hb-article-card habit-card ${compact ? "compact" : ""}`}>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start"}}>
        <h4 style={{margin:0, fontSize: compact ? 13 : 16, fontWeight:700}}>{title}</h4>
        <div style={{fontSize: compact ? 14 : 18}}>{emoji}</div>
      </div>

      <div style={{color:"#b5bec6", fontSize: compact ? 11 : 12, marginTop:8}}>{subtitle}</div>
      <div style={{color:"#7a7a7a", fontSize: compact ? 11 : 12, marginTop:8}}>{desc}</div>

      <div style={{color:"#7a7a7a", fontSize: compact ? 10 : 11, marginTop:12}}>{edited}</div>
    </article>
  );
}
