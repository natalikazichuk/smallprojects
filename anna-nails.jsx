import { useState, useEffect } from "react";

// ── Встроенная БД (имитация Supabase) ──────────────────────────────────────
const STORAGE_KEY = "anna_nails_bookings";
const HOURS_KEY = "anna_nails_hours";

function loadBookings() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch { return []; }
}
function saveBookings(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
function loadHours() {
  try {
    return JSON.parse(localStorage.getItem(HOURS_KEY) || "null") ||
      ["09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00"];
  } catch { return ["09:00","10:00","11:00","14:00","15:00","16:00"]; }
}
function saveHours(data) {
  localStorage.setItem(HOURS_KEY, JSON.stringify(data));
}

// ── Утилиты ────────────────────────────────────────────────────────────────
function getNext7Days() {
  const days = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d);
  }
  return days;
}

function formatDate(d) {
  return d.toISOString().split("T")[0];
}

const DAY_NAMES = ["Вс","Пн","Вт","Ср","Чт","Пт","Сб"];
const MONTH_NAMES = ["янв","фев","мар","апр","май","июн","июл","авг","сен","окт","ноя","дек"];

// ── Стили ──────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Inter:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #faf8f9;
    --dark: #1a0a10;
    --rose: #e8a4b8;
    --rose-deep: #c4687e;
    --muted: #7a5563;
    --card: #ffffff;
    --border: #f0e6ea;
  }

  body { background: var(--bg); font-family: 'Inter', sans-serif; color: var(--dark); min-height: 100vh; }

  /* ── HERO ── */
  .hero {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
    position: relative;
    background: var(--dark);
    overflow: hidden;
  }
  .hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 60% 60% at 50% 40%, #3d1525 0%, #1a0a10 100%);
  }
  .hero-petals {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
  }
  .petal {
    position: absolute;
    width: 6px;
    height: 6px;
    border-radius: 50% 0 50% 0;
    background: var(--rose);
    opacity: 0.15;
    animation: fall linear infinite;
  }
  @keyframes fall {
    0% { transform: translateY(-20px) rotate(0deg); opacity: 0; }
    10% { opacity: 0.2; }
    90% { opacity: 0.1; }
    100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
  }
  .hero-content {
    position: relative;
    text-align: center;
    z-index: 1;
  }
  .hero-eyebrow {
    font-family: 'Inter', sans-serif;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: var(--rose);
    margin-bottom: 20px;
  }
  .hero-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(48px, 10vw, 96px);
    color: #faf8f9;
    line-height: 1;
    letter-spacing: -1px;
    margin-bottom: 8px;
  }
  .hero-title em {
    font-style: italic;
    color: var(--rose);
  }
  .hero-subtitle {
    font-size: 13px;
    color: var(--muted);
    letter-spacing: 6px;
    text-transform: uppercase;
    margin-bottom: 12px;
  }
  .hero-city {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: #7a5563;
    margin-bottom: 56px;
  }
  .btn-primary {
    display: inline-block;
    background: var(--rose);
    color: var(--dark);
    font-family: 'Inter', sans-serif;
    font-weight: 600;
    font-size: 13px;
    letter-spacing: 2px;
    text-transform: uppercase;
    padding: 18px 48px;
    border: none;
    cursor: pointer;
    transition: background 0.2s, transform 0.15s;
  }
  .btn-primary:hover { background: #f0b8ca; transform: translateY(-1px); }
  .btn-primary:active { transform: translateY(0); }

  .hero-master-link {
    position: absolute;
    bottom: 32px;
    right: 32px;
    z-index: 10;
    font-size: 11px;
    color: #3d1525;
    text-decoration: none;
    letter-spacing: 1px;
    cursor: pointer;
    background: none;
    border: none;
    font-family: 'Inter', sans-serif;
  }
  .hero-master-link:hover { color: var(--muted); }

  /* ── BOOKING PAGE ── */
  .booking-page {
    min-height: 100vh;
    background: var(--bg);
    padding: 0;
  }
  .booking-header {
    background: var(--dark);
    padding: 20px 24px;
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .back-btn {
    background: none;
    border: none;
    color: var(--rose);
    cursor: pointer;
    font-size: 20px;
    padding: 4px;
    display: flex;
    align-items: center;
  }
  .booking-header-title {
    font-family: 'Playfair Display', serif;
    color: #faf8f9;
    font-size: 22px;
  }

  .booking-body {
    padding: 32px 20px;
    max-width: 480px;
    margin: 0 auto;
  }

  .section-label {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 16px;
  }

  /* Дни */
  .days-scroll {
    display: flex;
    gap: 10px;
    overflow-x: auto;
    padding-bottom: 4px;
    margin-bottom: 32px;
    scrollbar-width: none;
  }
  .days-scroll::-webkit-scrollbar { display: none; }
  .day-chip {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 14px 16px;
    border: 1.5px solid var(--border);
    background: var(--card);
    cursor: pointer;
    transition: all 0.15s;
    min-width: 64px;
  }
  .day-chip:hover { border-color: var(--rose); }
  .day-chip.active { background: var(--dark); border-color: var(--dark); }
  .day-chip .day-name { font-size: 10px; font-weight: 500; letter-spacing: 1px; text-transform: uppercase; color: var(--muted); }
  .day-chip.active .day-name { color: var(--rose); }
  .day-chip .day-num { font-family: 'Playfair Display', serif; font-size: 26px; color: var(--dark); line-height: 1; margin-top: 4px; }
  .day-chip.active .day-num { color: #faf8f9; }
  .day-chip .day-mon { font-size: 10px; color: var(--muted); margin-top: 2px; }
  .day-chip.active .day-mon { color: #7a5563; }

  /* Время */
  .times-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin-bottom: 32px;
  }
  .time-slot {
    padding: 14px 10px;
    text-align: center;
    font-size: 14px;
    font-weight: 500;
    border: 1.5px solid var(--border);
    background: var(--card);
    cursor: pointer;
    transition: all 0.15s;
    color: var(--dark);
  }
  .time-slot:hover:not(.booked) { border-color: var(--rose); }
  .time-slot.active { background: var(--rose-deep); border-color: var(--rose-deep); color: white; }
  .time-slot.booked { background: #f5f0f2; color: #c4a8b2; border-color: var(--border); cursor: not-allowed; text-decoration: line-through; }

  /* Форма */
  .form-field { margin-bottom: 20px; }
  .form-field label { display: block; font-size: 11px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); margin-bottom: 8px; }
  .form-field input {
    width: 100%;
    padding: 14px 16px;
    font-family: 'Inter', sans-serif;
    font-size: 15px;
    background: var(--card);
    border: 1.5px solid var(--border);
    color: var(--dark);
    outline: none;
    transition: border-color 0.15s;
  }
  .form-field input:focus { border-color: var(--rose); }
  .form-field input::placeholder { color: #c4a8b2; }

  .btn-book {
    width: 100%;
    background: var(--dark);
    color: var(--rose);
    font-family: 'Inter', sans-serif;
    font-weight: 600;
    font-size: 13px;
    letter-spacing: 3px;
    text-transform: uppercase;
    padding: 20px;
    border: none;
    cursor: pointer;
    margin-top: 8px;
    transition: background 0.2s;
  }
  .btn-book:hover { background: #2d1020; }
  .btn-book:disabled { opacity: 0.4; cursor: not-allowed; }

  /* Success */
  .success-screen {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: var(--dark);
    padding: 40px 20px;
    text-align: center;
  }
  .success-icon { font-size: 64px; margin-bottom: 24px; }
  .success-title { font-family: 'Playfair Display', serif; font-size: 36px; color: #faf8f9; margin-bottom: 12px; }
  .success-sub { color: var(--muted); font-size: 15px; line-height: 1.6; margin-bottom: 40px; }
  .success-card { background: #2d1020; padding: 24px 32px; margin-bottom: 40px; }
  .success-card p { color: var(--rose); font-size: 14px; margin-bottom: 6px; }
  .success-card strong { color: #faf8f9; }

  /* ── КАБИНЕТ ── */
  .master-page {
    min-height: 100vh;
    background: var(--bg);
  }
  .master-header {
    background: var(--dark);
    padding: 20px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .master-header-left { display: flex; align-items: center; gap: 16px; }
  .master-header h1 { font-family: 'Playfair Display', serif; color: #faf8f9; font-size: 20px; }
  .master-tab-bar {
    display: flex;
    border-bottom: 1.5px solid var(--border);
    background: var(--card);
  }
  .master-tab {
    flex: 1;
    padding: 16px;
    text-align: center;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--muted);
    cursor: pointer;
    border-bottom: 2px solid transparent;
    transition: all 0.15s;
    background: none;
    border-left: none;
    border-right: none;
    border-top: none;
    font-family: 'Inter', sans-serif;
  }
  .master-tab.active { color: var(--rose-deep); border-bottom-color: var(--rose-deep); }

  .master-body { padding: 24px 20px; max-width: 600px; margin: 0 auto; }

  /* Фильтр дат */
  .date-filter {
    display: flex;
    gap: 8px;
    margin-bottom: 24px;
    overflow-x: auto;
    scrollbar-width: none;
  }
  .date-filter::-webkit-scrollbar { display: none; }
  .date-pill {
    flex-shrink: 0;
    padding: 8px 16px;
    font-size: 12px;
    font-weight: 500;
    border: 1.5px solid var(--border);
    background: var(--card);
    cursor: pointer;
    transition: all 0.15s;
    color: var(--dark);
    font-family: 'Inter', sans-serif;
  }
  .date-pill.active { background: var(--dark); color: var(--rose); border-color: var(--dark); }

  /* Записи */
  .booking-card {
    background: var(--card);
    border: 1.5px solid var(--border);
    padding: 20px;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .booking-time {
    font-family: 'Playfair Display', serif;
    font-size: 28px;
    color: var(--dark);
    min-width: 80px;
  }
  .booking-info { flex: 1; }
  .booking-name { font-weight: 600; font-size: 16px; color: var(--dark); }
  .booking-phone { font-size: 13px; color: var(--muted); margin-top: 2px; }
  .booking-actions { display: flex; gap: 8px; }
  .btn-icon {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1.5px solid var(--border);
    background: none;
    cursor: pointer;
    font-size: 16px;
    transition: all 0.15s;
  }
  .btn-icon:hover { border-color: var(--rose-deep); background: #fff0f3; }
  .btn-icon.delete:hover { border-color: #e53; background: #fff0f0; }

  .empty-state {
    text-align: center;
    padding: 60px 20px;
    color: var(--muted);
  }
  .empty-state .emoji { font-size: 48px; margin-bottom: 16px; }
  .empty-state p { font-size: 14px; }

  /* Настройки */
  .settings-section { margin-bottom: 32px; }
  .settings-title { font-family: 'Playfair Display', serif; font-size: 20px; margin-bottom: 16px; color: var(--dark); }
  .hours-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
  }
  .hour-toggle {
    padding: 12px 8px;
    text-align: center;
    font-size: 13px;
    font-weight: 500;
    border: 1.5px solid var(--border);
    background: var(--card);
    cursor: pointer;
    transition: all 0.15s;
    color: var(--dark);
    font-family: 'Inter', sans-serif;
  }
  .hour-toggle.on { background: var(--dark); color: var(--rose); border-color: var(--dark); }
  .save-hours-btn {
    margin-top: 20px;
    width: 100%;
    padding: 16px;
    background: var(--rose-deep);
    color: white;
    border: none;
    font-family: 'Inter', sans-serif;
    font-weight: 600;
    font-size: 13px;
    letter-spacing: 2px;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.15s;
  }
  .save-hours-btn:hover { background: #b05570; }

  .toast {
    position: fixed;
    bottom: 32px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--dark);
    color: var(--rose);
    padding: 14px 28px;
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 1px;
    z-index: 1000;
    animation: toastIn 0.3s ease;
  }
  @keyframes toastIn {
    from { opacity: 0; transform: translateX(-50%) translateY(16px); }
    to { opacity: 1; transform: translateX(-50%) translateY(0); }
  }

  /* Login */
  .login-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--dark);
    padding: 20px;
  }
  .login-card {
    background: #2d1020;
    padding: 48px 40px;
    width: 100%;
    max-width: 380px;
    text-align: center;
  }
  .login-title { font-family: 'Playfair Display', serif; font-size: 28px; color: #faf8f9; margin-bottom: 8px; }
  .login-sub { font-size: 12px; color: var(--muted); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 32px; }
  .login-card input {
    width: 100%;
    padding: 14px 16px;
    background: #1a0a10;
    border: 1.5px solid #3d1525;
    color: #faf8f9;
    font-family: 'Inter', sans-serif;
    font-size: 15px;
    margin-bottom: 12px;
    outline: none;
    transition: border-color 0.15s;
  }
  .login-card input:focus { border-color: var(--rose); }
  .login-card input::placeholder { color: #3d1525; }
  .login-card .btn-primary { width: 100%; margin-top: 8px; }
  .login-error { font-size: 12px; color: #e88; margin-top: 12px; }

  @media (max-width: 480px) {
    .times-grid { grid-template-columns: repeat(3, 1fr); }
    .hours-grid { grid-template-columns: repeat(3, 1fr); }
  }
`;

const ALL_HOURS = [
  "08:00","09:00","10:00","11:00","12:00","13:00",
  "14:00","15:00","16:00","17:00","18:00","19:00"
];

const PETALS = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  size: 4 + Math.random() * 8,
  dur: 8 + Math.random() * 14,
  delay: Math.random() * 12,
}));

// ════════════════════════════════════════════════════
export default function App() {
  const [page, setPage] = useState("home"); // home | booking | success | login | master
  const [bookings, setBookings] = useState(loadBookings);
  const [workHours, setWorkHours] = useState(loadHours);

  // booking state
  const days = getNext7Days();
  const [selDay, setSelDay] = useState(0);
  const [selTime, setSelTime] = useState(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [lastBooking, setLastBooking] = useState(null);

  // master state
  const [masterTab, setMasterTab] = useState("bookings");
  const [masterDateIdx, setMasterDateIdx] = useState(0);
  const [editHours, setEditHours] = useState(workHours);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  // Занятые слоты для выбранного дня
  const selectedDate = formatDate(days[selDay]);
  const bookedTimes = bookings
    .filter((b) => b.date === selectedDate)
    .map((b) => b.time);

  const handleBook = () => {
    if (!selTime || !name.trim() || !phone.trim()) return;
    const nb = { id: Date.now(), date: selectedDate, time: selTime, name: name.trim(), phone: phone.trim() };
    const updated = [...bookings, nb];
    saveBookings(updated);
    setBookings(updated);
    setLastBooking(nb);
    setPage("success");
  };

  // Записи мастера за выбранную дату
  const masterDate = formatDate(days[masterDateIdx]);
  const masterBookings = bookings
    .filter((b) => b.date === masterDate)
    .sort((a, b) => a.time.localeCompare(b.time));

  const deleteBooking = (id) => {
    const updated = bookings.filter((b) => b.id !== id);
    saveBookings(updated);
    setBookings(updated);
    showToast("Запись удалена");
  };

  const saveWorkHours = () => {
    saveHours(editHours);
    setWorkHours(editHours);
    showToast("Рабочие часы сохранены");
  };

  const toggleHour = (h) => {
    setEditHours((prev) =>
      prev.includes(h) ? prev.filter((x) => x !== h) : [...prev, h].sort()
    );
  };

  // ── HOME ────────────────────────────────────────────
  if (page === "home") return (
    <>
      <style>{css}</style>
      <div className="hero">
        <div className="hero-petals">
          {PETALS.map((p) => (
            <div key={p.id} className="petal" style={{
              left: p.left, width: p.size, height: p.size,
              animationDuration: `${p.dur}s`,
              animationDelay: `${p.delay}s`,
            }} />
          ))}
        </div>
        <div className="hero-content">
          <p className="hero-eyebrow">Студия красоты</p>
          <h1 className="hero-title">Anna<br /><em>Nails</em></h1>
          <p className="hero-subtitle">Маникюр · Педикюр</p>
          <p className="hero-city">📍 Ровно</p>
          <button className="btn-primary" onClick={() => { setSelDay(0); setSelTime(null); setName(""); setPhone(""); setPage("booking"); }}>
            Записаться
          </button>
        </div>
        <button className="hero-master-link" onClick={() => setPage("login")}>
          Вход для мастера →
        </button>
      </div>
    </>
  );

  // ── BOOKING ──────────────────────────────────────────
  if (page === "booking") return (
    <>
      <style>{css}</style>
      <div className="booking-page">
        <div className="booking-header">
          <button className="back-btn" onClick={() => setPage("home")}>←</button>
          <span className="booking-header-title">Запись</span>
        </div>
        <div className="booking-body">
          <p className="section-label">Выберите дату</p>
          <div className="days-scroll">
            {days.map((d, i) => (
              <div key={i} className={`day-chip${selDay === i ? " active" : ""}`} onClick={() => { setSelDay(i); setSelTime(null); }}>
                <span className="day-name">{DAY_NAMES[d.getDay()]}</span>
                <span className="day-num">{d.getDate()}</span>
                <span className="day-mon">{MONTH_NAMES[d.getMonth()]}</span>
              </div>
            ))}
          </div>

          <p className="section-label">Выберите время</p>
          <div className="times-grid">
            {workHours.map((t) => {
              const isBooked = bookedTimes.includes(t);
              return (
                <div
                  key={t}
                  className={`time-slot${isBooked ? " booked" : selTime === t ? " active" : ""}`}
                  onClick={() => !isBooked && setSelTime(t)}
                >
                  {t}
                </div>
              );
            })}
            {workHours.length === 0 && <p style={{ color: "var(--muted)", fontSize: 14, gridColumn: "1/-1" }}>Нет доступных слотов</p>}
          </div>

          <p className="section-label">Ваши данные</p>
          <div className="form-field">
            <label>Имя</label>
            <input placeholder="Ваше имя" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="form-field">
            <label>Телефон</label>
            <input placeholder="+380 00 000 0000" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>

          <button
            className="btn-book"
            onClick={handleBook}
            disabled={!selTime || !name.trim() || !phone.trim()}
          >
            Записаться
          </button>
        </div>
      </div>
    </>
  );

  // ── SUCCESS ──────────────────────────────────────────
  if (page === "success") return (
    <>
      <style>{css}</style>
      <div className="success-screen">
        <div className="success-icon">🌸</div>
        <h1 className="success-title">Вы записаны!</h1>
        <p className="success-sub">Ждём вас в студии.<br />До встречи!</p>
        {lastBooking && (
          <div className="success-card">
            <p>Дата: <strong>{lastBooking.date.split("-").reverse().join(".")}</strong></p>
            <p>Время: <strong>{lastBooking.time}</strong></p>
            <p>Имя: <strong>{lastBooking.name}</strong></p>
          </div>
        )}
        <button className="btn-primary" onClick={() => setPage("home")}>На главную</button>
      </div>
    </>
  );

  // ── LOGIN ─────────────────────────────────────────────
  if (page === "login") return (
    <>
      <style>{css}</style>
      <LoginPage onLogin={() => setPage("master")} onBack={() => setPage("home")} />
    </>
  );

  // ── MASTER ───────────────────────────────────────────
  if (page === "master") return (
    <>
      <style>{css}</style>
      <div className="master-page">
        <div className="master-header">
          <div className="master-header-left">
            <button className="back-btn" onClick={() => setPage("home")}>←</button>
            <h1>Кабинет мастера</h1>
          </div>
        </div>

        <div className="master-tab-bar">
          <button className={`master-tab${masterTab === "bookings" ? " active" : ""}`} onClick={() => setMasterTab("bookings")}>
            Записи
          </button>
          <button className={`master-tab${masterTab === "settings" ? " active" : ""}`} onClick={() => setMasterTab("settings")}>
            Настройки
          </button>
        </div>

        <div className="master-body">
          {masterTab === "bookings" && (
            <>
              <div className="date-filter">
                {days.map((d, i) => (
                  <button
                    key={i}
                    className={`date-pill${masterDateIdx === i ? " active" : ""}`}
                    onClick={() => setMasterDateIdx(i)}
                  >
                    {i === 0 ? "Сегодня" : `${d.getDate()} ${MONTH_NAMES[d.getMonth()]}`}
                  </button>
                ))}
              </div>

              {masterBookings.length === 0 ? (
                <div className="empty-state">
                  <div className="emoji">🌸</div>
                  <p>На этот день записей нет</p>
                </div>
              ) : (
                masterBookings.map((b) => (
                  <div className="booking-card" key={b.id}>
                    <div className="booking-time">{b.time}</div>
                    <div className="booking-info">
                      <div className="booking-name">{b.name}</div>
                      <div className="booking-phone">{b.phone}</div>
                    </div>
                    <div className="booking-actions">
                      <button className="btn-icon delete" title="Удалить" onClick={() => deleteBooking(b.id)}>✕</button>
                    </div>
                  </div>
                ))
              )}
            </>
          )}

          {masterTab === "settings" && (
            <div className="settings-section">
              <h2 className="settings-title">Рабочие часы</h2>
              <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 20 }}>
                Выберите доступные временные слоты
              </p>
              <div className="hours-grid">
                {ALL_HOURS.map((h) => (
                  <button
                    key={h}
                    className={`hour-toggle${editHours.includes(h) ? " on" : ""}`}
                    onClick={() => toggleHour(h)}
                  >
                    {h}
                  </button>
                ))}
              </div>
              <button className="save-hours-btn" onClick={saveWorkHours}>
                Сохранить
              </button>
            </div>
          )}
        </div>
      </div>
      {toast && <div className="toast">{toast}</div>}
    </>
  );

  return null;
}

// ── Login Component ─────────────────────────────────────────────────────────
function LoginPage({ onLogin, onBack }) {
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  const handle = () => {
    if (pass === "1234") { onLogin(); }
    else { setError("Неверный пароль"); }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">Вход</h1>
        <p className="login-sub">Кабинет мастера</p>
        <input
          type="password"
          placeholder="Пароль"
          value={pass}
          onChange={(e) => { setPass(e.target.value); setError(""); }}
          onKeyDown={(e) => e.key === "Enter" && handle()}
        />
        {error && <p className="login-error">{error}</p>}
        <button className="btn-primary" onClick={handle}>Войти</button>
        <div style={{ marginTop: 24 }}>
          <button onClick={onBack} style={{ background: "none", border: "none", color: "#3d1525", fontSize: 12, cursor: "pointer", fontFamily: "Inter, sans-serif" }}>
            ← Назад
          </button>
        </div>
        <p style={{ fontSize: 11, color: "#3d1525", marginTop: 16 }}>Пароль: 1234</p>
      </div>
    </div>
  );
}
