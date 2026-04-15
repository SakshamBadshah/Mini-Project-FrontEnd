import { useState, useRef } from "react";
import { useApp } from "../context/AppContext";
import Icons from "../components/Icons";
import styles from "./AccountPage.module.css";
import { useEffect } from "react";
import { API_BASE } from "../data/constants";

const TABS = [
  { id: "profile",   label: "Profile",       icon: "👤" },
  { id: "orders",    label: "My Orders",     icon: "📦" },
  { id: "addresses", label: "Addresses",     icon: "📍" },
  { id: "payments",  label: "Payment",       icon: "💳" },
  { id: "settings",  label: "Settings",      icon: "⚙️" },
];

const STATUS_STYLE = {
  Delivered:   { bg: "rgba(61,220,132,0.12)",  color: "var(--green)"  },
  Preparing:   { bg: "rgba(255,107,43,0.12)",  color: "var(--orange)" },
  "In Transit":{ bg: "rgba(100,170,255,0.12)", color: "var(--blue)"   },
};

function getInitials(name) {
  if (!name || typeof name !== "string") return "??";

  return name
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
export default function AccountPage() {
  const { user, setUser, setPage, addToast } = useApp();
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE}/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setUser(data.user || data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  fetchProfile(); // ✅ ALWAYS CALL
}, []);

  if (!user) {
    return (
      <div className={styles.gated}>
        <div className={styles.gatedIcon}>🔐</div>
        <h2>Sign in to view your account</h2>
        <p>Access your profile, orders, and saved addresses.</p>
        <button className="btn btn-primary" onClick={() => setPage("login")}>
          Sign In
        </button>
      </div>
    );
  }

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("token");
    addToast("Logged out successfully. See you soon! 👋", "info");
    setPage("home");
  };

  return (
    <div className="page">
      <div className={styles.pageHeader}>
        <span className="badge" style={{ marginBottom: 14 }}>My Account</span>
        <h1 className={styles.title}>Account & Profile</h1>
      </div>

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <div className={styles.avatarCard}>
            <div className={styles.avatarCircle}>
              {getInitials(user.name)}
            </div>
            <div className={styles.avatarName}>{user.name}</div>
            <div className={styles.avatarEmail}>{user.email}</div>
            <div className={styles.memberBadge}>⭐ Member since 2026</div>
          </div>

          <nav className={styles.nav}>
            {TABS.map((t) => (
              <button
                key={t.id}
                className={`${styles.navBtn} ${activeTab === t.id ? styles.navBtnActive : ""}`}
                onClick={() => setActiveTab(t.id)}
              >
                <span className={styles.navIcon}>{t.icon}</span>
                <span>{t.label}</span>
                <span className={styles.navChevron}>›</span>
              </button>
            ))}
            <button className={styles.logoutBtn} onClick={handleLogout}>
              <Icons.LogOut />
              <span>Sign Out</span>
            </button>
          </nav>
        </aside>

        <div className={styles.content}>
          {activeTab === "profile"   && <ProfileTab   user={user} setUser={setUser} addToast={addToast} />}
          {activeTab === "orders"    && <OrdersTab    setPage={setPage} />}
          {activeTab === "addresses" && <AddressesTab addToast={addToast} />}
          {activeTab === "payments"  && <PaymentsTab  addToast={addToast} />}
          {activeTab === "settings"  && <SettingsTab  user={user} setUser={setUser} addToast={addToast} handleLogout={handleLogout} />}
        </div>

      </div>
    </div>
  );
}

function ProfileTab({ user, setUser, addToast }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name:    user.name    || "",
    email:   user.email   || "",
    phone:   user.phone   || "",
    gender:  user.gender  || "",
    dob:     user.dob     || "",
    bio:     user.bio     || "",
  });
  useEffect(() => {
  if (user) {
    setForm({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      gender: user.gender || "",
      dob: user.dob || "",
      bio: user.bio || "",
    });
  }
}, [user]);
  const [errors, setErrors] = useState({});

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((er) => ({ ...er, [k]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())  e.name  = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
    if (form.phone && !/^\+?[\d\s\-]{7,15}$/.test(form.phone)) e.phone = "Invalid phone number";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE}/user/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        addToast(data.message || "Error updating profile", "error");
        return;
      }

      setUser(data);
      addToast("Profile updated successfully! ✅", "success");
      setEditing(false);

    } catch (err) {
      addToast("Network error", "error");
    }
  };

  return (
    <div className={styles.tabContent}>
      <div className={styles.tabHeader}>
        <div>
          <h2 className={styles.tabTitle}>Personal Information</h2>
          <p className={styles.tabSub}>Manage your profile details</p>
        </div>
        {!editing ? (
          <button className="btn btn-ghost" onClick={() => setEditing(true)}>
            ✏️ Edit Profile
          </button>
        ) : (
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn btn-ghost" onClick={() => setEditing(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave}>Save Changes</button>
          </div>
        )}
      </div>

      <div className={styles.profileAvatarRow}>
        <div className={styles.profileAvatar}>{getInitials(user.name)}</div>
        <div>
          <div className={styles.profileAvatarName}>{user.name}</div>
          <div className={styles.profileAvatarSub}>FoodDash Member</div>
          {editing && (
            <button className="btn btn-ghost" style={{ marginTop: 10, fontSize: 12, padding: "6px 14px" }}>
              📷 Change Photo
            </button>
          )}
        </div>
      </div>

      {/* Fields */}
      <div className={styles.fieldsGrid}>
        <Field label="Full Name *"    value={form.name}   error={errors.name}
          editing={editing} onChange={set("name")} placeholder="Arjun Singh" />

        <Field label="Email Address *" value={form.email}  error={errors.email}
          editing={editing} onChange={set("email")} type="email" placeholder="you@example.com" />

        <Field label="Phone Number"   value={form.phone}  error={errors.phone}
          editing={editing} onChange={set("phone")} type="tel" placeholder="+91 98765 43210" />

        <div className={styles.field}>
          <label className={styles.fieldLabel}>Gender</label>
          {editing ? (
            <select className="input" value={form.gender} onChange={set("gender")}>
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer_not">Prefer not to say</option>
            </select>
          ) : (
            <div className={styles.fieldValue}>{form.gender || <span className={styles.fieldEmpty}>Not set</span>}</div>
          )}
        </div>

        <Field label="Date of Birth"  value={form.dob}
          editing={editing} onChange={set("dob")} type="date" placeholder="" />

        <div className={styles.field} style={{ gridColumn: "1 / -1" }}>
          <label className={styles.fieldLabel}>Bio</label>
          {editing ? (
            <textarea
              className="input"
              rows={3}
              style={{ resize: "vertical", lineHeight: 1.6 }}
              placeholder="Tell us a little about yourself..."
              value={form.bio}
              onChange={set("bio")}
            />
          ) : (
            <div className={styles.fieldValue}>{form.bio || <span className={styles.fieldEmpty}>No bio yet</span>}</div>
          )}
        </div>
      </div>

      <div className={styles.statsRow}>
        {[["3", "Orders Placed"], ["₹1,822", "Total Spent"], ["4.9★", "Avg Rating Given"]].map(([v, l]) => (
          <div key={l} className={styles.statBox}>
            <div className={styles.statBoxVal}>{v}</div>
            <div className={styles.statBoxLbl}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OrdersTab({ setPage }) {
    const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API_BASE}/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchOrders();
  }, []);
  return (
    <div className={styles.tabContent}>
      <div className={styles.tabHeader}>
        <div>
          <h2 className={styles.tabTitle}>Order History</h2>
          <p className={styles.tabSub}>All your past and active orders</p>
        </div>
        <button className="btn btn-ghost" onClick={() => setPage("orders")}>
          View All →
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {orders.map((order) => {
          const s = STATUS_STYLE[order.status] || STATUS_STYLE["Preparing"];
          return (
            <div className={styles.orderCard} key={order._id}>
              <div className={styles.orderTop}>
                <div>
                  <div className={styles.orderId}>{order._id}</div>
                  <div className={styles.orderMeta}>🏪 {order.restaurant} · {order.date}</div>
                </div>
                <span className={styles.orderPill} style={{ background: s.bg, color: s.color }}>
                  {order.status}
                </span>
              </div>
              <div className={styles.orderItems}>
                {order.items?.map((e) => (
  <div key={e._id} style={{ display: "flex", justifyContent: "space-between" }}>
    <span>{e.name} × {e.quantity}</span>
    <span>₹{e.price}</span>
  </div>
))}
              </div>
              <div className={styles.orderBottom}>
                <span style={{ color: "var(--muted)", fontSize: 13 }}>
                  {order.status === "Delivered" ? "✅ Delivered" : "🚚 Est. 30 min"}
                </span>
                <span className={styles.orderTotal}>₹{order.total}</span>
              </div>
              {order.status === "Delivered" && (
                <button
                  className="btn btn-ghost"
                  style={{ width: "100%", marginTop: 12, fontSize: 13 }}
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


function AddressesTab({ addToast }) {
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm]   = useState(false);
  const [newAddr, setNewAddr]     = useState({ label: "", line1: "", line2: "", city: "", pincode: "" });
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch(`${API_BASE}/addresses`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          addToast("Failed to load addresses", "error");
          return;
        }

        setAddresses(data);

      } catch (err) {
        console.log(err);
      }
    };

    fetchAddresses();
  }, []);

  const setDefault = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE}/addresses/default/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updated = await res.json();

      setAddresses((a) =>
        a.map((x) => ({
          ...x,
          isDefault: x._id === updated._id,
        }))
      );

      addToast("Default address updated ✅", "success");

    } catch (err) {
      console.log(err);
    }
  };

  const deleteAddress = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await fetch(`${API_BASE}/addresses/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAddresses((a) => a.filter((x) => x._id !== id));
      addToast("Address removed", "info");

    } catch (err) {
      console.log(err);
    }
  };

  const addAddress = async () => {
    if (!newAddr.line1 || !newAddr.city) {
      addToast("Please fill address details", "error");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE}/addresses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newAddr),
      });

      const data = await res.json();

      setAddresses((a) => [...a, data]);
      setNewAddr({ label: "", line1: "", line2: "", city: "", pincode: "" });
      setShowForm(false);

      addToast("Address added ✅", "success");

    } catch (err) {
      addToast("Error adding address", "error");
    }
  };

  const set = (k) => (e) => setNewAddr((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className={styles.tabContent}>
      <div className={styles.tabHeader}>
        <div>
          <h2 className={styles.tabTitle}>Saved Addresses</h2>
          <p className={styles.tabSub}>Manage your delivery locations</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm((v) => !v)}>
          {showForm ? "Cancel" : "+ Add Address"}
        </button>
      </div>

      {showForm && (
        <div className={styles.addrForm}>
          <h3 className={styles.addrFormTitle}>New Address</h3>
          <div className="form-row" style={{ marginBottom: 14 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Label (e.g. Home, Office)</label>
              <input className="input" placeholder="🏠 Home" value={newAddr.label} onChange={set("label")} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Pincode</label>
              <input className="input" placeholder="248001" value={newAddr.pincode} onChange={set("pincode")} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Street / Flat *</label>
            <input className="input" placeholder="Flat 12B, Sunshine Apts..." value={newAddr.line1} onChange={set("line1")} />
          </div>
          <div className="form-row">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Area / Landmark</label>
              <input className="input" placeholder="Near City Mall" value={newAddr.line2} onChange={set("line2")} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">City *</label>
              <input className="input" placeholder="Dehradun" value={newAddr.city} onChange={set("city")} />
            </div>
          </div>
          <button className="btn btn-primary" style={{ marginTop: 14 }} onClick={addAddress}>
            Save Address
          </button>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {addresses.map((addr) => (
          <div className={`${styles.addrCard} ${addr.default ? styles.addrCardDefault : ""}`} key={addr.id}>
            <div className={styles.addrTop}>
              <div className={styles.addrLabel}>{addr.label || "📍 Address"}</div>
              {addr.default && <span className={styles.defaultBadge}>Default</span>}
            </div>
            <div className={styles.addrLine}>{addr.line1}</div>
            <div className={styles.addrLine} style={{ color: "var(--muted)" }}>{addr.line2 || addr.city}</div>
            <div className={styles.addrActions}>
              {!addr.default && (
                <button className={styles.addrBtn} onClick={() => setDefault(addr.id)}>Set as default</button>
              )}
              <button className={styles.addrBtn}>✏️ Edit</button>
              <button className={`${styles.addrBtn} ${styles.addrBtnDanger}`} onClick={() => deleteAddress(addr.id)}>
                🗑️ Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


const SAMPLE_CARDS = [
  { id: 1, type: "Visa",       last4: "4242", expiry: "12/26", icon: "💳", default: true  },
  { id: 2, type: "Mastercard", last4: "5353", expiry: "08/25", icon: "💳", default: false },
];

function PaymentsTab({ addToast }) {
  const [cards, setCards] = useState(SAMPLE_CARDS);

  const removeCard = (id) => {
    setCards((c) => c.filter((x) => x.id !== id));
    addToast("Card removed", "info");
  };

  return (
    <div className={styles.tabContent}>
      <div className={styles.tabHeader}>
        <div>
          <h2 className={styles.tabTitle}>Payment Methods</h2>
          <p className={styles.tabSub}>Manage your saved cards and UPI</p>
        </div>
        <button className="btn btn-primary">+ Add Card</button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 28 }}>
        {cards.map((card) => (
          <div className={`${styles.cardItem} ${card.default ? styles.cardItemDefault : ""}`} key={card.id}>
            <div className={styles.cardLeft}>
              <span style={{ fontSize: 28 }}>{card.icon}</span>
              <div>
                <div className={styles.cardType}>{card.type} •••• {card.last4}</div>
                <div className={styles.cardExpiry}>Expires {card.expiry}</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              {card.default && <span className={styles.defaultBadge}>Default</span>}
              <button
                className={styles.addrBtnDanger}
                style={{ padding: "5px 12px", borderRadius: 8, fontSize: 12, background: "rgba(255,71,87,0.1)", border: "1px solid rgba(255,71,87,0.25)", color: "var(--red)", cursor: "pointer" }}
                onClick={() => removeCard(card.id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.upiSection}>
        <h3 className={styles.subSectionTitle}>UPI / Wallets</h3>
        <div className={styles.upiRow}>
          {["📱 PhonePe", "🟡 GPay", "💸 Paytm"].map((u) => (
            <div key={u} className={styles.upiChip}>{u}</div>
          ))}
          <div className={styles.upiChip} style={{ borderStyle: "dashed", color: "var(--orange)" }}>+ Link UPI</div>
        </div>
      </div>

      
      <div className={styles.walletBox}>
        <div>
          <div className={styles.walletLabel}>FoodDash Wallet</div>
          <div className={styles.walletBal}>₹ 250.00</div>
          <div style={{ color: "var(--muted)", fontSize: 12, marginTop: 4 }}>Available balance</div>
        </div>
        <button className="btn btn-ghost" style={{ fontSize: 13 }}>Add Money</button>
      </div>
    </div>
  );
}

function SettingsTab({ user, setUser, addToast, handleLogout }) {
  const [notifs, setNotifs] = useState({ orders: true, promos: true, sms: false, email: true });
  const [pwForm, setPwForm] = useState({ current: "", newPw: "", confirm: "" });
  const [pwErr, setPwErr]   = useState({});

  const toggle = (k) => () => {
    setNotifs((n) => ({ ...n, [k]: !n[k] }));
    addToast("Preference saved ✅", "success");
  };

  const changePassword = async () => {
    const e = {};

    if (!pwForm.current) e.current = "Enter current password";
    if (!pwForm.newPw || pwForm.newPw.length < 6) e.newPw = "Minimum 6 characters";
    if (pwForm.newPw !== pwForm.confirm) e.confirm = "Passwords don't match";

    setPwErr(e);
    if (Object.keys(e).length > 0) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE}/user/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: pwForm.current,
          newPassword: pwForm.newPw,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        addToast(data.message || "Error updating password", "error");
        return;
      }

      addToast("Password changed successfully 🔐", "success");
      setPwForm({ current: "", newPw: "", confirm: "" });

    } catch (err) {
      addToast("Network error", "error");
    }
  };

  return (
    <div className={styles.tabContent}>
      <h2 className={styles.tabTitle} style={{ marginBottom: 28 }}>Settings</h2>

      {/* Notifications */}
      <div className={styles.settingsSection}>
        <h3 className={styles.subSectionTitle}>🔔 Notifications</h3>
        {[
          ["orders",  "Order updates",          "Get notified about your order status"],
          ["promos",  "Offers & promotions",     "Receive exclusive deals and discounts"],
          ["sms",     "SMS alerts",              "Text messages for important updates"],
          ["email",   "Email newsletter",        "Weekly food recommendations"],
        ].map(([k, label, desc]) => (
          <div className={styles.toggleRow} key={k}>
            <div>
              <div className={styles.toggleLabel}>{label}</div>
              <div className={styles.toggleDesc}>{desc}</div>
            </div>
            <button
              className={`${styles.toggle} ${notifs[k] ? styles.toggleOn : ""}`}
              onClick={toggle(k)}
              aria-label={`Toggle ${label}`}
            >
              <span className={styles.toggleThumb} />
            </button>
          </div>
        ))}
      </div>

      {/* Change password */}
      <div className={styles.settingsSection}>
        <h3 className={styles.subSectionTitle}>🔐 Change Password</h3>
        <div className={styles.fieldsGrid}>
          <div className="form-group">
            <label className="form-label">Current Password</label>
            <input className="input" type="password" placeholder="••••••••"
              value={pwForm.current} onChange={(e) => setPwForm((f) => ({ ...f, current: e.target.value }))} />
            {pwErr.current && <p className="form-error">{pwErr.current}</p>}
          </div>
          <div />
          <div className="form-group">
            <label className="form-label">New Password</label>
            <input className="input" type="password" placeholder="••••••••"
              value={pwForm.newPw} onChange={(e) => setPwForm((f) => ({ ...f, newPw: e.target.value }))} />
            {pwErr.newPw && <p className="form-error">{pwErr.newPw}</p>}
          </div>
          <div className="form-group">
            <label className="form-label">Confirm New Password</label>
            <input className="input" type="password" placeholder="••••••••"
              value={pwForm.confirm} onChange={(e) => setPwForm((f) => ({ ...f, confirm: e.target.value }))} />
            {pwErr.confirm && <p className="form-error">{pwErr.confirm}</p>}
          </div>
        </div>
        <button className="btn btn-primary" style={{ marginTop: 4 }} onClick={changePassword}>
          Update Password
        </button>
      </div>

      {/* Danger zone */}
      <div className={styles.dangerZone}>
        <h3 className={styles.dangerTitle}>⚠️ Danger Zone</h3>
        <div className={styles.dangerRow}>
          <div>
            <div className={styles.dangerLabel}>Sign out of all devices</div>
            <div className={styles.dangerDesc}>This will log you out from all sessions</div>
          </div>
          <button className="btn btn-ghost" style={{ fontSize: 13, color: "var(--orange)", borderColor: "rgba(255,107,43,0.3)" }}
            onClick={handleLogout}>
            Sign Out
          </button>
        </div>
        <div className={styles.dangerRow}>
          <div>
            <div className={styles.dangerLabel}>Delete Account</div>
            <div className={styles.dangerDesc}>Permanently delete your account and all data</div>
          </div>
          <button
            className="btn"
            style={{ fontSize: 13, background: "rgba(255,71,87,0.1)", color: "var(--red)", border: "1px solid rgba(255,71,87,0.3)" }}
            onClick={() => addToast("Please contact support to delete your account", "info")}
          >
            Delete
          </button>
        </div>
      </div>

    </div>
  );
}

function Field({ label, value, error, editing, onChange, type = "text", placeholder = "" }) {
  return (
    <div className={styles.field}>
      <label className={styles.fieldLabel}>{label}</label>
      {editing ? (
        <>
          <input className="input" type={type} placeholder={placeholder} value={value} onChange={onChange} />
          {error && <p className="form-error">{error}</p>}
        </>
      ) : (
        <div className={styles.fieldValue}>
          {value || <span className={styles.fieldEmpty}>Not set</span>}
        </div>
      )}
    </div>
  );
}
