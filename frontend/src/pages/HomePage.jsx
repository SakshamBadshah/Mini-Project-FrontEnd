import { useState } from "react";
import { useApp } from "../context/AppContext";
import { MENU_ITEMS, CATEGORIES } from "../data/constants";
import FoodCard from "../components/FoodCard";
import CategoryTabs from "../components/CategoryTabs";
import Icons from "../components/Icons";
import styles from "./HomePage.module.css";

export default function HomePage() {
  const { addToCart, setPage } = useApp();
  const [search, setSearch]   = useState("");
  const [cat, setCat]         = useState("all");

  const filtered = MENU_ITEMS.filter((item) => {
    const matchCat    = cat === "all" || item.category === cat;
    const q           = search.toLowerCase();
    const matchSearch = item.name.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  const catLabel = CATEGORIES.find((c) => c.id === cat)?.label ?? "Items";

  return (
    <div className="page">
      <section className={styles.hero}>
        <div className={styles.heroGlow} />

        <div className={styles.heroInner}>
          <div>
            <div className="fade-up" style={{ marginBottom: 20 }}>
              <span className="badge">🚀 Free delivery on first order</span>
            </div>

            <h1 className={`${styles.heroTitle} fade-up-1`}>
              Craving<br />something<br />
              <span className={styles.accent}>Delicious?</span>
            </h1>

            <p className={`${styles.heroSub} fade-up-2`}>
              Order from the best local restaurants. Lightning-fast delivery
              straight to your door — in under 30 minutes, guaranteed.
            </p>

            <div className={`${styles.heroCta} fade-up-3`}>
              <button
                className="btn btn-primary"
                onClick={() => document.getElementById("menu-section")?.scrollIntoView({ behavior: "smooth" })}
              >
                Explore Menu 🍽️
              </button>
              <button className="btn btn-ghost" onClick={() => setPage("about")}>
                How it works
              </button>
            </div>

            <div className={`${styles.heroStats} fade-up-3`}>
              {[["200+", "Restaurants"], ["4.8★", "App Rating"], ["30 min", "Avg Delivery"]].map(([v, l]) => (
                <div key={l} className={styles.stat}>
                  <div className={styles.statVal}>{v}</div>
                  <div className={styles.statLbl}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.heroRight}>
            <div className={styles.plate}>
              🍔
              <div className={`${styles.chip} ${styles.chipTop}`}>
                <span style={{ fontSize: 22 }}>🍕</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>Pizza Palace</div>
                  <div style={{ color: "var(--green)", fontSize: 11 }}>● Open now</div>
                </div>
              </div>
              <div className={`${styles.chip} ${styles.chipBot}`}>
                <span style={{ fontSize: 22 }}>⚡</span>
                <span style={{ fontSize: 12, fontWeight: 500 }}>25 min delivery</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className={styles.searchBar} id="menu-section">
        <div className={styles.searchWrap}>
          <span className={styles.searchIcon}><Icons.Search /></span>
          <input
            className={styles.searchInput}
            placeholder="Search dishes, restaurants..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="input"
          style={{ width: "auto", paddingLeft: 14, flexShrink: 0 }}
          value={cat}
          onChange={(e) => setCat(e.target.value)}
        >
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>
          ))}
        </select>
      </div>

      <CategoryTabs active={cat} onChange={setCat} />

      <section className={styles.menuSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            {filtered.length} {cat === "all" ? "Items" : catLabel}
          </h2>
          <span className="tag">🚚 Free delivery above ₹399</span>
        </div>

        {filtered.length === 0 ? (
          <div className={styles.empty}>
            <div style={{ fontSize: 52, marginBottom: 14 }}>🍽️</div>
            <strong style={{ fontSize: 18 }}>No items found</strong>
            <p style={{ color: "var(--muted)", marginTop: 6 }}>Try a different search or category</p>
            <button
              className="btn btn-ghost"
              style={{ marginTop: 16 }}
              onClick={() => { setSearch(""); setCat("all"); }}
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className={styles.grid}>
            {filtered.map((item, i) => (
              <FoodCard key={item._id} item={item} onAdd={addToCart} delay={i * 50} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
