// frontend/src/pages/HomePage.jsx
import { useState, useEffect } from "react";
import NewHabitModal from "../components/NewHabitModal";
import NewHabitButton from "../components/NewHabitButton";
import trackingApi from "../api/trackingApi";
import { mapHabitsToFrontend, frontendToBackend } from "../utils/habitMapper";
import useAuth from "../hooks/useAuth";
import { ChevronLeft, ChevronRight } from "lucide-react";

/* Figma asset URLs (hotlinked) */
const imgOriginalImage1 = "https://www.figma.com/api/mcp/asset/9211e221-c4e9-4c55-892c-65149d64db1e";
const imgIcon1 = "https://www.figma.com/api/mcp/asset/49732381-020e-4bab-81e5-0aa9689f9ace";
const imgOriginalImage = "https://www.figma.com/api/mcp/asset/785ef7fd-d651-4210-9f13-1be849dc0b41";

/* Small presentational subcomponents */
function IconHome() {
  return (
    <div className="hb-icon-home">
      <img src={imgIcon1} alt="home icon" />
    </div>
  );
}

function SmallCard({ title, emoji, desc = "description / Not done yet", onClick }) {
  return (
    <div className="hb-card" onClick={onClick} style={{ cursor: onClick ? "pointer" : "default" }}>
      <div className="hb-card-head">
        <div className="hb-card-title">{title}</div>
        <div className="hb-card-emoji">{emoji}</div>
      </div>
      <p className="hb-card-desc">{desc}</p>
    </div>
  );
}

function ArticleCard({ title = "Nhận đề bài", excerpt }) {
  return (
    <article className="hb-article-card">
      <h3 className="hb-article-title">{title}</h3>
      <p className="hb-article-excerpt">
        {excerpt ||
          "Một mẫu ngắn nội dung của bài viết vào đây, tất cả đồng này tĩnh hết nên ko cần kết nối gì cả."}
      </p>

      <div className="hb-article-image-mask" style={{ maskImage: `url('${imgOriginalImage}')` }}>
        <img className="hb-mask-img" src={imgOriginalImage1} alt="cover" />
      </div>
    </article>
  );
}

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
          <div key={d} className="hb-cal-weekday">
            {d}
          </div>
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

/* Main HomePage component - now with backend integration */
export default function HomePage() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();

  // Get username from user object (already contains derived username)
  const username = user?.username || "Username";

  // Load habits from backend
  const loadHabits = async () => {
    try {
      setLoading(true);
      const response = await trackingApi.getAllHabits();
      const backendHabits = response.habits || [];
      const frontendHabits = mapHabitsToFrontend(backendHabits);
      setHabits(frontendHabits);
    } catch (err) {
      console.error("Failed to load habits:", err);
      // Keep empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHabits();
  }, []);

  const addHabit = async (newHabit) => {
    try {
      const backendData = frontendToBackend(newHabit);
      await trackingApi.createHabit(backendData);
      
      // Reload habits
      await loadHabits();
      setShowModal(false);
    } catch (err) {
      console.error("Failed to create habit:", err);
      alert("Failed to create habit. Please try again.");
    }
  };

  const markHabitComplete = async (habitId) => {
    try {
      await trackingApi.markHabitComplete(habitId);
      // Reload to update UI
      await loadHabits();
    } catch (err) {
      console.error("Failed to mark habit complete:", err);
      alert("Failed to mark habit complete. Please try again.");
    }
  };

  // Get today's incomplete habits for "To do" section
  const todayYmd = new Date().toISOString().slice(0, 10);
  const todoHabits = habits.filter(h => {
    const hasToday = h.history?.some(d => d.slice(0, 10) === todayYmd);
    return !hasToday; // Show habits not done today
  }).slice(0, 6); // Limit to 6

  return (
    <div className="hb-root">
      {/* Top-left brand */}
      <div className="hb-header">
        <div className="hb-brand">HaBiD</div>
      </div>

      {/* Greeting */}
      <div className="hb-greeting-wrap">
        <h1 className="hb-greeting">Good evening, {username}</h1>
      </div>

      {/* Main container */}
      <div className="hb-container">
        {/* To-do small cards row */}
        <section className="hb-section">
          <div className="hb-section-title-row">
            <IconHome />
            <h2 className="hb-section-title">To do</h2>
          </div>

          {loading ? (
            <div style={{ padding: 20, color: "#7a7a7a" }}>Loading habits...</div>
          ) : todoHabits.length === 0 ? (
            <div style={{ padding: 20, color: "#7a7a7a" }}>
              All done for today! 🎉
            </div>
          ) : (
            <div className="hb-cards-row">
              {todoHabits.map((habit) => (
                <SmallCard
                  key={habit.id}
                  title={habit.name}
                  emoji={habit.emoji || "🎯"}
                  desc={habit.description || "No description"}
                  onClick={() => markHabitComplete(habit.id)}
                />
              ))}
            </div>
          )}
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
            <ArticleCard />
            <ArticleCard />
          </div>
        </section>
      </div>
      
      <NewHabitButton onAdd={() => setShowModal(true)} />
      <NewHabitModal visible={showModal} onClose={() => setShowModal(false)} onCreate={addHabit} />
    </div>
  );
}