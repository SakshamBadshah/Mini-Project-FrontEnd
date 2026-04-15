import { useApp } from "../context/AppContext";
import Icons from "./Icons";
import styles from "./CartDrawer.module.css";

export default function CartDrawer() {
  const { cart, dispatch, cartOpen, setCartOpen, cartSubtotal, setPage } = useApp();

  if (!cartOpen) return null;

  const delivery = cartSubtotal > 0 ? 40 : 0;
  const gst      = Math.round(cartSubtotal * 0.05);
  const total    = cartSubtotal + delivery + gst;

  const handleCheckout = () => {
    setCartOpen(false);
    setPage("checkout");
  };

  return (
    <div
      className={styles.overlay}
      onClick={(e) => e.target === e.currentTarget && setCartOpen(false)}
    >
      <div className={styles.drawer}>

        <div className={styles.header}>
          <span className={styles.title}>Your Cart 🛒</span>
          <button className="btn-icon" onClick={() => setCartOpen(false)} aria-label="Close cart">
            <Icons.X />
          </button>
        </div>
        <div className={styles.body}>
          {cart.length === 0 ? (
            <div className={styles.empty}>
              <span className={styles.emptyIcon}>🍽️</span>
              <strong>Your cart is empty</strong>
              <span>Add some delicious food!</span>
              <button
                className="btn btn-primary"
                style={{ marginTop: 8 }}
                onClick={() => { setCartOpen(false); setPage("menu"); }}
              >
                Browse Menu
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div className={styles.item} key={item._id}>
                <span className={styles.itemEmoji}>{item.emoji}</span>
                <div className={styles.itemInfo}>
                  <div className={styles.itemName}>{item.name}</div>
                  <div className={styles.itemPrice}>
                    ₹{item.price} × {item.quantity} = <strong>₹{item.price * item.quantity}</strong>
                  </div>
                </div>
                <div className={styles.qtyCtrl}>
                  <button
                    className={styles.qtyBtn}
                    onClick={() => dispatch({ type: "DEC", id: item._id })}
                    aria-label="Decrease quantity"
                  >
                    <Icons.Minus />
                  </button>
                  <span className={styles.qtyVal}>{item.quantity}</span>
                  <button
                    className={styles.qtyBtn}
                    onClick={() => dispatch({ type: "INC", id: item._id })}
                    aria-label="Increase quantity"
                  >
                    <Icons.Plus />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.rows}>
              <div className={styles.row}><span>Subtotal</span><span>₹{cartSubtotal}</span></div>
              <div className={styles.row}><span>Delivery</span><span>₹{delivery}</span></div>
              <div className={styles.row}><span>GST (5%)</span><span>₹{gst}</span></div>
            </div>
            <div className={styles.totalRow}>
              <span className={styles.totalLabel}>Total</span>
              <span className={styles.totalVal}>₹{total}</span>
            </div>
            <button
              className="btn btn-primary"
              style={{ width: "100%", padding: "14px", fontSize: 15, marginTop: 16 }}
              onClick={handleCheckout}
            >
              Checkout →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
