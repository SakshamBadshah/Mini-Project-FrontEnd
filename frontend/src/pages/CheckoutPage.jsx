import { useState } from "react";
import { useApp } from "../context/AppContext";
import { API_BASE } from "../data/constants";
import styles from "./CheckoutPage.module.css";

const PAYMENT_OPTS = [
  { id: "card",   icon: "💳", label: "Credit / Debit Card" },
  { id: "upi",    icon: "📱", label: "UPI / PhonePe"       },
  { id: "cod",    icon: "💵", label: "Cash on Delivery"    },
  { id: "wallet", icon: "👛", label: "FoodDash Wallet"     },
];

const Field = ({ k, label, placeholder, type = "text", half = false, form, set, errors }) => (
  <div className="form-group" style={half ? { marginBottom: 0, flex: 1 } : {}}>
    <label className="form-label">{label}</label>
    <input
      className="input"
      type={type}
      placeholder={placeholder}
      value={form?.[k] || ""}
      onChange={set(k)}
    />
    {errors[k] && <p className="form-error" style={{ color: 'red', fontSize: '12px' }}>{errors[k]}</p>}
  </div>
);

export default function CheckoutPage() {
  const { cart, dispatch, cartSubtotal, addToast, setPage, user } = useApp();

  const [form, setForm]       = useState({ name: user?.name || "", phone: "", address: "", city: "", pincode: "" });
  const [payment, setPayment] = useState("card");
  const [placing, setPlacing] = useState(false);
  const [errors, setErrors]   = useState({});

  const delivery = 40;
  const gst      = Math.round(cartSubtotal * 0.05);
  const total    = cartSubtotal + delivery + gst;

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = "Full name is required";
    else if(form.name.length > 20)		            e.name   = "Name is too long";
    if (!form.phone.trim())   e.phone   = "Phone number is required";
    else if (form.phone.length > 13)		            e.phone   = "Phone number is too long";
    if (!form.address.trim()) e.address = "Address is required";
    if (!form.city.trim())    e.city    = "City is required";
    if (!form.pincode.trim()) e.pincode = "Pincode is required";
    else if (form.pincode.length > 6)		            e.pincode   = "Pincode is invalid";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: "" }));
  };

  const handleOrder = async () => {
  if (!validate()) return;
  setPlacing(true);

  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_BASE}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        restaurant: "Food App",
      }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    // ✅ CLEAR FRONTEND CART
    dispatch({ type: "CLEAR" });

    addToast("Order placed successfully 🎉", "success");
    setTimeout(() => {setPage("home");}, 1000);

  } catch (err) {
    console.log(err);
    addToast("Order failed", "error");
  } finally {
    setPlacing(false);
  }
};

  if (cart.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>🛒</div>
        <h2>Your cart is empty</h2>
        <p>Add some food before checking out.</p>
        <button className="btn btn-primary" onClick={() => setPage("menu")}>Browse Menu</button>
      </div>
    );
  }

  return (
    <div className="page">
      <div className={styles.pageHeader}>
        <span className="badge" style={{ marginBottom: 14 }}>Checkout</span>
        <h1 className={styles.title}>Complete Your Order</h1>
      </div>

      <div className={styles.grid}>
       
        <div className={styles.left}>
          <div className={`card ${styles.section}`}>
            <h3 className={styles.sectionTitle}>📍 Delivery Details</h3>
            <div className="form-row" style={{ display: 'flex', gap: '15px' }}>
              <Field k="name" label="Full Name *" placeholder="Arjun Singh" form={form} set={handleChange} errors={errors} half />
              <Field k="phone" label="Phone Number *" placeholder="+91 98765" type="tel" form={form} set={handleChange} errors={errors} half />
            </div>
            
            <Field k="address" label="Street Address *" placeholder="Flat 12B..." form={form} set={handleChange} errors={errors} />
            
            <div className="form-row" style={{ display: 'flex', gap: '15px', marginTop: '15px' }}>
              <Field k="city" label="City *" placeholder="Dehradun" form={form} set={handleChange} errors={errors} half />
              <Field k="pincode" label="Pincode *" placeholder="248001" type="number" form={form} set={handleChange} errors={errors} half />
            </div>
          </div>

         
          <div className={`card ${styles.section}`} style={{ marginTop: 20 }}>
            <h3 className={styles.sectionTitle}>💳 Payment Method</h3>
            <div className={styles.payGrid}>
              {PAYMENT_OPTS.map((p) => (
                <div
                  key={p.id}
                  className={`${styles.payOpt} ${payment === p.id ? styles.paySelected : ""}`}
                  onClick={() => setPayment(p.id)}
                >
                  <span className={styles.payIcon}>{p.icon}</span>
                  <span>{p.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.right}>
          <div className={`card ${styles.summaryCard}`}>
            <h3 className={styles.sectionTitle}>🧾 Order Summary</h3>
            <div className={styles.summaryItems}>
              {cart.map((item) => (
                <div className={styles.summaryItem} key={item._id}>
                  <span className={styles.summaryLeft}>
                    <span className={styles.summaryEmoji}>{item.emoji || "🍽️"}</span>
                    <span>{item.name} × {item.quantity}</span>
                  </span>
                  <span className={styles.summaryPrice}>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

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
              style={{ width: "100%", padding: "15px", fontSize: 15, marginTop: 20 }}
              onClick={handleOrder}
              disabled={placing}
            >
              {placing ? "Placing Order..." : `Place Order · ₹${total}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}