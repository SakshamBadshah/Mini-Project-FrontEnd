import { CATEGORIES } from "../data/constants";
import styles from "./CategoryTabs.module.css";

export default function CategoryTabs({ active, onChange }) {
  return (
    <div className={styles.tabs}>
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          className={`${styles.tab} ${active === cat.id ? styles.active : ""}`}
          onClick={() => onChange(cat.id)}
        >
          <span>{cat.emoji}</span>
          <span>{cat.label}</span>
        </button>
      ))}
    </div>
  );
}
