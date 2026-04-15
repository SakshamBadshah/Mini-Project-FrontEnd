import { useApp } from "../context/AppContext";
import styles from "./Toast.module.css";

const ICONS = { success: "✅", error: "❌", info: "🔔" };

export default function ToastContainer() {
  const { toasts } = useApp();
  if (toasts.length === 0) return null;
  return (
    <div className={styles.container} aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`${styles.toast} ${styles[t.type]}`} role="alert">
          <span className={styles.icon}>{ICONS[t.type] || "🔔"}</span>
          <span className={styles.msg}>{t.msg}</span>
        </div>
      ))}
    </div>
  );
}
