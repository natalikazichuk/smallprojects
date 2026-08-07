import { useState } from "react";

const apps = [
  {
    id: 1,
    name: "Spotify",
    category: "Музика та аудіо",
    rating: 4.5,
    reviews: "84 млн",
    size: "30 МБ",
    icon: "🎵",
    color: "#1DB954",
    bg: "#0D1117",
    description: "Слухайте музику, подкасти та аудіокниги.",
    screenshots: ["🎧", "🎼", "🎤"],
    installs: "1 млрд+",
    free: true,
  },
  {
    id: 2,
    name: "YouTube",
    category: "Відео та плеєри",
    rating: 4.4,
    reviews: "124 млн",
    size: "45 МБ",
    icon: "▶️",
    color: "#FF0000",
    bg: "#0F0F0F",
    description: "Дивіться відео, прямі ефіри та шорти.",
    screenshots: ["📺", "🎬", "🔴"],
    installs: "10 млрд+",
    free: true,
  },
  {
    id: 3,
    name: "Telegram",
    category: "Комунікація",
    rating: 4.5,
    reviews: "51 млн",
    size: "28 МБ",
    icon: "✈️",
    color: "#2AABEE",
    bg: "#17212B",
    description: "Швидкий і безпечний месенджер.",
    screenshots: ["💬", "📎", "🔒"],
    installs: "1 млрд+",
    free: true,
  },
  {
    id: 4,
    name: "Duolingo",
    category: "Освіта",
    rating: 4.6,
    reviews: "22 млн",
    size: "22 МБ",
    icon: "🦉",
    color: "#58CC02",
    bg: "#1CB0F6",
    description: "Вивчайте мови безкоштовно та весело.",
    screenshots: ["📚", "🌍", "🏆"],
    installs: "500 млн+",
    free: true,
  },
  {
    id: 5,
    name: "Minecraft",
    category: "Ігри",
    rating: 4.5,
    reviews: "6 млн",
    size: "800 МБ",
    icon: "⛏️",
    color: "#8B6914",
    bg: "#1A1A2E",
    description: "Будуй та досліджуй нескінченні світи.",
    screenshots: ["🏗️", "🌲", "🐉"],
    installs: "100 млн+",
    free: false,
    price: "199 грн",
  },
  {
    id: 6,
    name: "Instagram",
    category: "Соціальні мережі",
    rating: 4.0,
    reviews: "148 млн",
    size: "35 МБ",
    icon: "📷",
    color: "#E1306C",
    bg: "#121212",
    description: "Фото, відео та ріелс від людей і брендів.",
    screenshots: ["📸", "❤️", "✨"],
    installs: "5 млрд+",
    free: true,
  },
];

const categories = ["Усі", "Ігри", "Додатки", "Фільми", "Книги"];

const featuredBanners = [
  { title: "Spotify Premium", subtitle: "3 місяці безкоштовно", color: "#1DB954", icon: "🎵" },
  { title: "Minecraft", subtitle: "Оновлення 1.21 вже тут", color: "#8B6914", icon: "⛏️" },
  { title: "Duolingo Plus", subtitle: "Без реклами та необмежені серця", color: "#58CC02", icon: "🦉" },
];

function StarRating({ rating }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <div style={{ display: "flex", gap: 1, alignItems: "center" }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} style={{ fontSize: 12, color: i <= full ? "#FBBC04" : i === full + 1 && half ? "#FBBC04" : "#444" }}>
          {i <= full ? "★" : i === full + 1 && half ? "⯨" : "★"}
        </span>
      ))}
    </div>
  );
}

function AppCard({ app, onClick }) {
  const [installed, setInstalled] = useState(false);
  return (
    <div
      onClick={() => onClick(app)}
      style={{
        display: "flex",
        gap: 12,
        alignItems: "center",
        padding: "10px 0",
        cursor: "pointer",
        borderBottom: "1px solid #2A2A2A",
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 14,
          background: `${app.color}22`,
          border: `1px solid ${app.color}44`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 28,
          flexShrink: 0,
        }}
      >
        {app.icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ color: "#E8EAED", fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{app.name}</div>
        <div style={{ color: "#9AA0A6", fontSize: 12, marginBottom: 4 }}>{app.category}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <StarRating rating={app.rating} />
          <span style={{ color: "#9AA0A6", fontSize: 11 }}>{app.rating}</span>
        </div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setInstalled(!installed);
        }}
        style={{
          background: installed ? "#1A3A1A" : "#01875F22",
          border: `1.5px solid ${installed ? "#34A853" : "#01875F"}`,
          borderRadius: 20,
          padding: "6px 16px",
          color: installed ? "#34A853" : "#01875F",
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
          flexShrink: 0,
          transition: "all 0.2s",
        }}
      >
        {app.free ? (installed ? "Відкрити" : "Встановити") : app.price}
      </button>
    </div>
  );
}

function AppDetail({ app, onBack }) {
  const [installed, setInstalled] = useState(false);
  const [activeTab, setActiveTab] = useState("info");
  return (
    <div style={{ background: "#111", minHeight: "100vh", color: "#E8EAED" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 16px 0" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "#E8EAED", fontSize: 22, cursor: "pointer", padding: 4 }}>←</button>
        <span style={{ fontSize: 16, fontWeight: 500 }}>Деталі додатку</span>
      </div>

      {/* App Hero */}
      <div style={{ padding: "20px 16px 0" }}>
        <div style={{ display: "flex", gap: 16, alignItems: "flex-start", marginBottom: 16 }}>
          <div style={{
            width: 80, height: 80, borderRadius: 18,
            background: `${app.color}22`, border: `1.5px solid ${app.color}44`,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40,
          }}>{app.icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>{app.name}</div>
            <div style={{ color: app.color, fontSize: 13, fontWeight: 500, marginBottom: 6 }}>{app.category}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <StarRating rating={app.rating} />
              <span style={{ color: "#9AA0A6", fontSize: 12 }}>{app.reviews} відгуків</span>
            </div>
          </div>
        </div>

        {/* Install button */}
        <button
          onClick={() => setInstalled(!installed)}
          style={{
            width: "100%", padding: "12px 0",
            background: installed ? "#1A3A1A" : "#01875F",
            border: installed ? "1.5px solid #34A853" : "none",
            borderRadius: 24, color: installed ? "#34A853" : "#fff",
            fontSize: 16, fontWeight: 600, cursor: "pointer",
            transition: "all 0.2s", marginBottom: 16,
          }}
        >
          {app.free ? (installed ? "✓ Відкрити" : "Встановити") : (installed ? "✓ Відкрити" : app.price)}
        </button>

        {/* Stats */}
        <div style={{
          display: "flex", justifyContent: "space-around",
          background: "#1A1A1A", borderRadius: 14, padding: "14px 0", marginBottom: 20,
        }}>
          {[
            { label: "Завантаження", value: app.installs },
            { label: "Рейтинг", value: app.rating },
            { label: "Розмір", value: app.size },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#E8EAED" }}>{s.value}</div>
              <div style={{ fontSize: 11, color: "#9AA0A6", marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Screenshots */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontWeight: 600, marginBottom: 10, fontSize: 15 }}>Скріншоти</div>
          <div style={{ display: "flex", gap: 10, overflowX: "auto" }}>
            {app.screenshots.map((s, i) => (
              <div key={i} style={{
                minWidth: 120, height: 200, borderRadius: 12,
                background: `${app.color}18`, border: `1px solid ${app.color}33`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 48, flexShrink: 0,
              }}>{s}</div>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <div style={{ fontWeight: 600, marginBottom: 8, fontSize: 15 }}>Про додаток</div>
          <div style={{ color: "#9AA0A6", fontSize: 14, lineHeight: 1.6 }}>{app.description}</div>
        </div>
      </div>
    </div>
  );
}

export default function GooglePlayApp() {
  const [activeCategory, setActiveCategory] = useState("Усі");
  const [search, setSearch] = useState("");
  const [selectedApp, setSelectedApp] = useState(null);
  const [activeNav, setActiveNav] = useState("home");
  const [bannerIdx, setBannerIdx] = useState(0);

  const filtered = apps.filter((a) => {
    const matchCat = activeCategory === "Усі" || a.category.toLowerCase().includes(activeCategory.toLowerCase());
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  if (selectedApp) return <AppDetail app={selectedApp} onBack={() => setSelectedApp(null)} />;

  return (
    <div style={{ background: "#111", minHeight: "100vh", color: "#E8EAED", fontFamily: "'Google Sans', Roboto, sans-serif", maxWidth: 420, margin: "0 auto", position: "relative" }}>
      {/* Top bar */}
      <div style={{ padding: "16px 16px 8px", background: "#111", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ fontSize: 22, fontWeight: 700, color: "#E8EAED" }}>
            <span style={{ color: "#4285F4" }}>G</span>
            <span style={{ color: "#EA4335" }}>o</span>
            <span style={{ color: "#FBBC04" }}>o</span>
            <span style={{ color: "#4285F4" }}>g</span>
            <span style={{ color: "#34A853" }}>l</span>
            <span style={{ color: "#EA4335" }}>e</span>
            {" "}
            <span style={{ color: "#01875F" }}>Play</span>
          </span>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#1A73E8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700 }}>У</div>
        </div>

        {/* Search */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          background: "#1E1E1E", borderRadius: 12, padding: "10px 14px", marginBottom: 12,
        }}>
          <span style={{ color: "#9AA0A6", fontSize: 16 }}>🔍</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Пошук додатків і ігор..."
            style={{ flex: 1, background: "none", border: "none", outline: "none", color: "#E8EAED", fontSize: 14 }}
          />
          {search && <span onClick={() => setSearch("")} style={{ color: "#9AA0A6", cursor: "pointer", fontSize: 18 }}>✕</span>}
        </div>

        {/* Categories */}
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              style={{
                background: activeCategory === c ? "#01875F" : "#1E1E1E",
                border: "none", borderRadius: 20,
                padding: "6px 16px", color: activeCategory === c ? "#fff" : "#9AA0A6",
                fontSize: 13, fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >{c}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: "0 16px 80px" }}>
        {/* Featured banner */}
        {!search && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 10, color: "#E8EAED" }}>Рекомендовано</div>
            <div
              style={{
                borderRadius: 16,
                background: `linear-gradient(135deg, ${featuredBanners[bannerIdx].color}44, ${featuredBanners[bannerIdx].color}11)`,
                border: `1px solid ${featuredBanners[bannerIdx].color}44`,
                padding: "24px 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
              }}
              onClick={() => setBannerIdx((bannerIdx + 1) % featuredBanners.length)}
            >
              <div>
                <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>{featuredBanners[bannerIdx].title}</div>
                <div style={{ color: "#9AA0A6", fontSize: 13 }}>{featuredBanners[bannerIdx].subtitle}</div>
                <button style={{
                  marginTop: 12, background: featuredBanners[bannerIdx].color, border: "none",
                  borderRadius: 20, padding: "6px 18px", color: "#fff", fontSize: 13,
                  fontWeight: 600, cursor: "pointer",
                }}>Дізнатись більше</button>
              </div>
              <div style={{ fontSize: 56 }}>{featuredBanners[bannerIdx].icon}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 8 }}>
              {featuredBanners.map((_, i) => (
                <div key={i} onClick={() => setBannerIdx(i)} style={{
                  width: i === bannerIdx ? 16 : 6, height: 6, borderRadius: 3,
                  background: i === bannerIdx ? "#01875F" : "#444", cursor: "pointer", transition: "all 0.3s",
                }} />
              ))}
            </div>
          </div>
        )}

        {/* App list */}
        <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4, color: "#E8EAED" }}>
          {search ? `Результати для "${search}"` : "Популярні додатки"}
        </div>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", color: "#9AA0A6", padding: "40px 0" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
            <div>Нічого не знайдено</div>
          </div>
        ) : (
          filtered.map((app) => <AppCard key={app.id} app={app} onClick={setSelectedApp} />)
        )}
      </div>

      {/* Bottom nav */}
      <div style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 420, background: "#1A1A1A",
        borderTop: "1px solid #2A2A2A", display: "flex", justifyContent: "space-around",
        padding: "10px 0", zIndex: 20,
      }}>
        {[
          { id: "home", icon: "🏠", label: "Головна" },
          { id: "games", icon: "🎮", label: "Ігри" },
          { id: "apps", icon: "📱", label: "Додатки" },
          { id: "books", icon: "📚", label: "Книги" },
        ].map((n) => (
          <button key={n.id} onClick={() => setActiveNav(n.id)} style={{
            background: "none", border: "none", display: "flex", flexDirection: "column",
            alignItems: "center", gap: 3, cursor: "pointer",
            color: activeNav === n.id ? "#01875F" : "#9AA0A6",
          }}>
            <span style={{ fontSize: 22 }}>{n.icon}</span>
            <span style={{ fontSize: 10, fontWeight: activeNav === n.id ? 600 : 400 }}>{n.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
