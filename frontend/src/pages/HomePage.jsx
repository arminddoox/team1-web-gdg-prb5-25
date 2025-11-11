// frontend/src/pages/HomePage.jsx
import React from "react";

/* Figma asset URLs (hotlinked) */
const imgOriginalImage1 = "https://www.figma.com/api/mcp/asset/9211e221-c4e9-4c55-892c-65149d64db1e";
const imgIcon = "https://www.figma.com/api/mcp/asset/e9fc5d13-9228-437d-be6d-7a79725d3268";
const imgIcon1 = "https://www.figma.com/api/mcp/asset/49732381-020e-4bab-81e5-0aa9689f9ace";
const imgOriginalImage = "https://www.figma.com/api/mcp/asset/785ef7fd-d651-4210-9f13-1be849dc0b41";
const img = "https://www.figma.com/api/mcp/asset/2d8cc7a1-51af-458b-93bf-2198890b0f20";
const img1 = "https://www.figma.com/api/mcp/asset/f5ac86df-f14a-482b-b8f1-fad6e3d88468";
const plusIcon = imgIcon;

/* Small presentational subcomponents from the extractor (kept to reuse images) */
function IconHome() {
  return (
    <div className="hb-icon-home">
      <img src={imgIcon1} alt="home icon" />
    </div>
  );
}

function SmallCard({ title, emoji, desc = "description / Not done yet" }) {
  return (
    <div className="hb-card">
      <div className="hb-card-head">
        <div className="hb-card-title">{title}</div>
        <div className="hb-card-emoji">{emoji}</div>
      </div>
      <p className="hb-card-desc">{desc}</p>
    </div>
  );
}

function ArticleCard({ title = "Nhan đề bài", excerpt }) {
  return (
    <article className="hb-article-card">
      <h3 className="hb-article-title">{title}</h3>
      <p className="hb-article-excerpt">
        {excerpt ||
          "Một mẩu ngắn nội dung của bài viết vào đay, tất cả đống này tĩnh hết nên ko cần kết nối gì cả."}
      </p>

      <div className="hb-article-image-mask" style={{ maskImage: `url('${imgOriginalImage}')` }}>
        <img className="hb-mask-img" src={imgOriginalImage1} alt="cover" />
      </div>
    </article>
  );
}

function Calendar() {
  // simplified calendar rendering — keeps the Figma look & the active day
  const days = Array.from({ length: 31 }).map((_, i) => i + 1);
  return (
    <div className="hb-calendar">
      <div className="hb-calendar-header">
        <img className="hb-cal-icon" src={img} alt="left" />
        <div className="hb-cal-month">September 2021</div>
        <img className="hb-cal-icon" src={img1} alt="right" />
      </div>

      <div className="hb-cal-weekdays">
        {["SAN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d) => (
          <div key={d} className="hb-cal-weekday">
            {d}
          </div>
        ))}
      </div>

      <div className="hb-cal-grid">
        {days.map((day) => (
          <div key={day} className="hb-cal-day">
            {day === 19 ? <div className="hb-cal-day-active">{day}</div> : <span>{day}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

/* Main HomePage component (no sidebar) */
export default function HomePage() {
  return (
    <div className="hb-root">
      {/* Top-left brand */}
      <div className="hb-header">
        <div className="hb-brand">HaBiD</div>
      </div>

      {/* Greeting */}
      <div className="hb-greeting-wrap">
        <h1 className="hb-greeting">Good evening, username</h1>
      </div>

      {/* Main container */}
      <div className="hb-container">
        {/* To-do small cards row */}
        <section className="hb-section">
          <div className="hb-section-title-row">
            <IconHome />
            <h2 className="hb-section-title">To do</h2>
          </div>

          <div className="hb-cards-row">
            <SmallCard title="Uống nước" emoji="💧" />
            <SmallCard title="Một habit tên dàu" emoji="🍼" />
            <SmallCard title="Dậy sớm" emoji="⏰" />
            <SmallCard title="Uống nước" emoji="🚨" />
            <SmallCard title="Uống nước" emoji="💧" />
          </div>
        </section>

        {/* Learn from Online articles */}
        <section className="hb-section">
          <div className="hb-section-title-row">
            <IconHome />
            <h2 className="hb-section-title">Learn from Online</h2>
          </div>

          <div className="hb-articles-row">
            <ArticleCard />
            <ArticleCard />
            <ArticleCard />
            <ArticleCard />
          </div>
        </section>

        {/* Future works and calendar */}
        <section className="hb-section hb-future-section">
          <div className="hb-section-title-row">
            <IconHome />
            <h2 className="hb-section-title">Future Works</h2>
          </div>

          <div className="hb-future-row">
            <div className="hb-future-left">No work for now &lt;3</div>
            <Calendar />
          </div>
        </section>

        {/* Community suggestions */}
        <section className="hb-section">
          <div className="hb-section-title-row">
            <IconHome />
            <h2 className="hb-section-title">Try out these communities favorite habits</h2>
          </div>

          <div className="hb-articles-row">
            <ArticleCard />
            <ArticleCard />
            <ArticleCard />
            <ArticleCard />
          </div>
        </section>

        {/* Add new habit (CTA) */}
        <div className="hb-cta-row">
          <button className="hb-new-habit-btn">
            <span>New habit</span>
            <img src={plusIcon} alt="plus" className="hb-plus-icon" />
          </button>
        </div>
      </div>
    </div>
  );
}
