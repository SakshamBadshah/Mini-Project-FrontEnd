import { useApp } from "../context/AppContext";
import styles from "./Footer.module.css";

const NAV_LINKS  = ["home", "menu", "orders", "about"];
const EXTRA_LINKS = ["Privacy", "Terms", "Help"];

export default function Footer() {
  const { setPage } = useApp();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>

        <div className={styles.brand}>
          <div className={styles.logo}>
            🍔 Food<span>Dash</span>
          </div>
          <p className={styles.tagline}>
            Delivering happiness, one meal at a time.
          </p>
          <p className={styles.copy}>© 2026 FoodDash. All rights reserved.</p>
        </div>

        <div className={styles.linkGroup}>
          <div className={styles.groupTitle}>Navigate</div>
          {NAV_LINKS.map((p) => (
            <span key={p} className={styles.link} onClick={() => setPage(p)}>
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </span>
          ))}
        </div>

        <div className={styles.linkGroup}>
          <div className={styles.groupTitle}>Company</div>
          {EXTRA_LINKS.map((l) => (
            <span key={l} className={styles.link}>{l}</span>
          ))}
        </div>

        <div className={styles.linkGroup}>
          <div className={styles.groupTitle}>Built With</div>
          {["React.js", "Node.js", "MongoDB", "Express"].map((t) => (
            <span key={t} className={styles.techTag}>{t}</span>
          ))}
        </div>

      </div>

      <div className={styles.bottom}>
        <span>Made with ❤️ by the FoodDash Team</span>
        <span>🚀 Fast · 🔐 Secure · 🍽️ Delicious</span>
      </div>
    </footer>
  );
}
