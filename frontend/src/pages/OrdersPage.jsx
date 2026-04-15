import { useApp } from "../context/AppContext";
import { SAMPLE_ORDERS } from "../data/constants";
import Icons from "../components/Icons";
import styles from "./OrdersPage.module.css";

const STATUS_STYLE = {
  Delivered:  { bg: "rgba(61,220,132,0.12)",  color: "var(--green)"  },
  Preparing:  { bg: "rgba(255,107,43,0.12)",  color: "var(--orange)" },
  "In Transit":{ bg: "rgba(100,170,255,0.12)", color: "var(--blue)"  },
};

export default function OrdersPage() {
  const { user, setPage } = useApp();
  if (!user) {
    return (
      <div className={styles.gated}>
        <div className={styles.gatedIcon}>📦</div>
        <h2>Sign in to view your orders</h2>
        <p>Track your past and active orders here.</p>
        <button className="btn btn-primary" onClick={() => setPage("login")}>
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="page">
      <div className={styles.pageHeader}>
        <span className="badge" style={{ marginBottom: 14 }}>My Orders</span>
        <h1 className={styles.title}>Order History</h1>
        <p className={styles.sub}>All your past and active orders in one place.</p>
      </div>

      <div className={styles.list}>
        {SAMPLE_ORDERS.map((order) => {
          const s = STATUS_STYLE[order.status] || STATUS_STYLE["Preparing"];
          return (
            <div className={styles.card} key={order._id}>
              <div className={styles.top}>
                <div>
                  <div className={styles.orderId}>{order._id}</div>
                  <div className={styles.meta}>
                    🏪 {order.restaurant} &nbsp;·&nbsp; {order.date}
                  </div>
                </div>
                <span
                  className={styles.pill}
                  style={{ background: s.bg, color: s.color }}
                >
                  {order.status}
                </span>
              </div>

            
              <div className={styles.items}>
                {order.items.map((emoji, i) => (
                  <span key={i} className={styles.itemEmoji}>{emoji}</span>
                ))}
              </div>

              
              <div className={styles.bottom}>
                <span className={styles.delivery}>
                  <Icons.Truck />
                  &nbsp;
                  {order.status === "Delivered" ? "Delivered successfully" : "Est. 30 min"}
                </span>
                <span className={styles.total}>₹{order.total}</span>
              </div>

              {order.status === "Delivered" && (
                <button
                  className="btn btn-ghost"
                  style={{ width: "100%", marginTop: 14, fontSize: 13 }}
                  onClick={() => setPage("menu")}
                >
                  🔁 Reorder
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
