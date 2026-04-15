import { useState, useRef, useEffect } from "react";
import { useApp } from "../context/AppContext";
import Icons from "./Icons";
import styles from "./Navbar.module.css";

function getInitials(name) {
  if (!name || typeof name !== 'string') {
    return "??"; 
  }

  try {
    const parts = name.trim().split(" ");
    const initials = parts
      .filter(part => part.length > 0)
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
    
    return initials || "??";
  } catch (err) {
    return "??";
  }
}

export default function Navbar() {
  const { page, setPage, cartTotal, setCartOpen, user, setUser, addToast } = useApp();
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("token");
    addToast("Logged out successfully 👋", "info");
    setPage("home");
    setDropOpen(false);
  };
  const NAV_LINKS = [
    { id: "home",   label: "Home"   },
    { id: "menu",   label: "Menu"   },
    { id: "map",    label: "Map" },
    { id: "orders", label: "Orders" },
    { id: "about",  label: "About"  },
  ];

  return (
    <nav className={styles.navbar}>
      <div className={styles.inner}>

        <div className={styles.logo} onClick={() => setPage("home")}>
          <span>🍔</span>
          Food<span className={styles.dot}>Dash</span>
        </div>

        <div className={styles.links}>
          {NAV_LINKS.map((l) => (
            <button
              key={l.id}
              className={`${styles.link} ${page === l.id ? styles.active : ""}`}
              onClick={() => setPage(l.id)}
            >
              {l.label}
            </button>
          ))}
        </div>

        <div className={styles.actions}>

          {user ? (
            <div className={styles.accountWrap} ref={dropRef}>
              <button
                className={`${styles.accountBtn} ${dropOpen ? styles.accountBtnOpen : ""}`}
                onClick={() => setDropOpen((v) => !v)}
              >
                <div className={styles.accountAvatar}>{getInitials(user.name)}</div>
                <span className={styles.accountName}>{user.name.split(" ")[0]}</span>
                <span className={styles.accountChevron} style={{ transform: dropOpen ? "rotate(180deg)" : "none" }}>▾</span>
              </button>

              {dropOpen && (
                <div className={styles.dropdown}>
                  <div className={styles.dropUser}>
                    <div className={styles.dropAvatar}>{getInitials(user.name)}</div>
                    <div>
                      <div className={styles.dropName}>{user.name}</div>
                      <div className={styles.dropEmail}>{user.email}</div>
                    </div>
                  </div>
                  <div className={styles.dropDivider} />
                  {[
                    { icon: "👤", label: "My Profile"  },
                    { icon: "📦", label: "My Orders"   },
                    { icon: "📍", label: "Addresses"   },
                    { icon: "💳", label: "Payments"    },
                    { icon: "⚙️", label: "Settings"    },
                  ].map((item) => (
                    <button
                      key={item.label}
                      className={styles.dropItem}
                      onClick={() => { setPage("account"); setDropOpen(false); }}
                    >
                      <span className={styles.dropItemIcon}>{item.icon}</span>
                      {item.label}
                    </button>
                  ))}
                  <div className={styles.dropDivider} />
                  <button className={`${styles.dropItem} ${styles.dropItemLogout}`} onClick={handleLogout}>
                    <Icons.LogOut /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button className="btn btn-ghost" style={{ padding: "8px 16px", fontSize: 13 }} onClick={() => setPage("login")}>
              <Icons.User /> Sign In
            </button>
          )}

          <button className={styles.cartBtn} onClick={() => setCartOpen(true)}>
            <Icons.Cart />
            Cart
            {cartTotal > 0 && (
              <span className={styles.cartCount}>{cartTotal > 99 ? "99+" : cartTotal}</span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
