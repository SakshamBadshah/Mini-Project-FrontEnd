import Icons from "./Icons";
import styles from "./FoodCard.module.css";

export default function FoodCard({ item, onAdd, delay = 0 }) {
  return (
    <div
      className={`${styles.card} fade-up`}
      style={{ animationDelay: `${delay}ms` }}
    >
    
      <div className={styles.imgArea}>
        {item.badge && (
          <span className={styles.badgeWrap}>
            <span className="badge" style={{ fontSize: 9 }}>{item.badge}</span>
          </span>
        )}
        <span className={styles.emoji}>{item.emoji}</span>
      </div>

  
      <div className={styles.body}>
       
        <div className={styles.meta}>
          <span className={styles.rating}>
            <Icons.Star /> {item.rating}
          </span>
          <span className={styles.sep}>·</span>
          <span className={styles.metaItem}>
            <Icons.Clock /> {item.time}
          </span>
          <span className={styles.sep}>·</span>
          <span
            className={styles.vegTag}
            style={{ color: item.veg ? "var(--green)" : "var(--orange)" }}
          >
            {item.veg ? "VEG" : "NON-VEG"}
          </span>
        </div>

        <div className={styles.name}>{item.name}</div>
        <div className={styles.desc}>{item.desc}</div>

        <div className={styles.footer}>
          <span className={styles.price}>₹{item.price}</span>
          <button
            className={styles.addBtn}
            onClick={() => onAdd(item)}
            aria-label={`Add ${item.name} to cart`}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
