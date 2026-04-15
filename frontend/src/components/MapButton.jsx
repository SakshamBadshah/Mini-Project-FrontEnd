import { useApp } from "../context/AppContext";
import styles from "./MapButton.module.css";

export default function MapButton() {
  const { setPage } = useApp();

  return (
    <button className={styles.btn} onClick={() => setPage("map")}>
      <span className={styles.pulse} />
      {/* <span className={styles.icon}></span> */}
      <span className={styles.text}>View restaurants on map</span>
      <span className={styles.arrow}>→</span>
    </button>
  );
}
