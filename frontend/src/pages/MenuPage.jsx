import { useState } from "react";
import { useApp } from "../context/AppContext";
import { MENU_ITEMS } from "../data/constants";
import FoodCard from "../components/FoodCard";
import CategoryTabs from "../components/CategoryTabs";
import styles from "./MenuPage.module.css";

export default function MenuPage() {
  const { addToCart } = useApp();
  const [cat, setCat] = useState("all");

  const filtered = cat === "all" ? MENU_ITEMS : MENU_ITEMS.filter((i) => i.category === cat);

  return (
    <div className="page">
      <div className={styles.header}>
        <span className="badge" style={{ marginBottom: 14 }}>Full Menu</span>
        <h1 className={styles.title}>Explore Our Menu</h1>
        <p className={styles.sub}>Fresh ingredients. Bold flavours. Delivered fast.</p>
      </div>

      <CategoryTabs active={cat} onChange={setCat} />

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 24px", color: "var(--muted)" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🍽️</div>
          <p>No items in this category yet.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {filtered.map((item, i) => (
            <FoodCard key={item._id} item={item} onAdd={addToCart} delay={i * 40} />
          ))}
        </div>
      )}
    </div>
  );
}
