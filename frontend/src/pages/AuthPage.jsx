import { useState } from "react";
import { useApp } from "../context/AppContext";
import { API_BASE } from "../data/constants";
import Icons from "../components/Icons";
import styles from "./AuthPage.module.css";

export default function AuthPage() {
  const { setPage, setUser, addToast } = useApp();

  const [isLogin, setIsLogin] = useState(true);
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors]   = useState({});
  const [form, setForm]       = useState({ name: "", email: "", password: "", confirm: "" });

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((er) => ({ ...er, [key]: "", api: "" }));
  };

  /* ── Validate ── */
  const validate = () => {
    const e = {};
    if (!isLogin && !form.name.trim())              e.name    = "Full name is required";
    if (!form.email.trim())                         e.email   = "Email is required";
    else if (form.email.length > 50)		            e.email   = "Email is too long";
    else if (!/\S+@\S+\.\S+/.test(form.email))      e.email   = "Invalid email address";
    if (!form.password)                             e.password = "Password is required";
    else if (form.password.length < 6)              e.password = "Minimum 6 characters";
    else if (form.password.length > 12)		    e.password = "Maximum 12 characters allowed";
    if (!isLogin && form.password !== form.confirm) e.confirm  = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ── Submit (FIXED LOGIC ORDER) ── */
  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);

    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/signup";

      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "" 
        },
        body: JSON.stringify({
          name: form.name, // Added back for Signup!
          email: form.email.trim(),
          password: form.password,
        }),
      });

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const textError = await res.text();
        setErrors({ api: "Server error. Check backend logs." });
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        setErrors({ api: data.message || "Invalid credentials" });
        return;
      }

      // 1. SAVE DATA FIRST
      localStorage.setItem("token", data.token);
      
      // 2. CHECK IF USER DATA EXISTS BEFORE TOASTING
      if (!data.user || !data.user.name) {
        console.error("User data missing from response", data);
        setUser(data.user || { name: "User" }); // Fallback
      } else {
        setUser(data.user);
      }

      // 3. TOAST FIRST (While component is still mounted)
      addToast(
        isLogin
          ? `Welcome back, ${data.user?.name || 'User'}! 👋`
          : `Account created successfully 🎉`,
        "success"
      );

      // 4. REDIRECT LAST
      setPage("home");

    } catch (error) {
      console.error("Login Error:", error);
      setErrors({ api: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };
  const onKeyDown = (e) => { if (e.key === "Enter") handleSubmit(); };

  const switchMode = () => {
    setIsLogin((v) => !v);
    setErrors({});
    setForm({ name: "", email: "", password: "", confirm: "" });
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>

        {/* Logo */}
        <div className={styles.logo}>
          <span className={styles.logoEmoji}>🍔</span>
          <span className={styles.logoText}>FoodDash</span>
        </div>

        <h2 className={styles.title}>{isLogin ? "Welcome back" : "Create account"}</h2>
        <p className={styles.sub}>
          {isLogin ? "Sign in to continue ordering" : "Join thousands of food lovers today"}
        </p>

        {/* API error */}
        {errors.api && (
          <div className={styles.apiError}>{errors.api}</div>
        )}

        {/* Name (signup only) */}
        {!isLogin && (
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="input" placeholder="Arjun Singh" value={form.name} onChange={set("name")} onKeyDown={onKeyDown} />
            {errors.name && <p className="form-error">{errors.name}</p>}
          </div>
        )}

        {/* Email */}
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input className="input" type="email" placeholder="you@example.com" value={form.email} onChange={set("email")} onKeyDown={onKeyDown} />
          {errors.email && <p className="form-error">{errors.email}</p>}
        </div>

        {/* Password */}
        <div className="form-group">
          <label className="form-label">Password</label>
          <div className={styles.pwWrap}>
            <input
              className="input"
              type={showPw ? "text" : "password"}
              placeholder="••••••••"
              style={{ paddingRight: 46 }}
              value={form.password}
              onChange={set("password")}
              onKeyDown={onKeyDown}
            />
            <button
              className={styles.pwToggle}
              type="button"
              onClick={() => setShowPw((v) => !v)}
            >
              {showPw ? <Icons.EyeOff /> : <Icons.Eye />}
            </button>
          </div>
          {errors.password && <p className="form-error">{errors.password}</p>}
        </div>

        {/* Confirm password (signup) */}
        {!isLogin && (
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input className="input" type="password" value={form.confirm} onChange={set("confirm")} onKeyDown={onKeyDown} />
            {errors.confirm && <p className="form-error">{errors.confirm}</p>}
          </div>
        )}

        {/* Submit */}
        <button
          className="btn btn-primary"
          style={{ width: "100%", padding: "14px", fontSize: 15 }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Please wait..." : isLogin ? "Sign In →" : "Create Account →"}
        </button>

        {/* Switch */}
        <p className={styles.switchText}>
          {isLogin ? "New to FoodDash?" : "Already have an account?"}{" "}
          <span className={styles.switchLink} onClick={switchMode}>
            {isLogin ? "Sign up free" : "Sign in"}
          </span>
        </p>

      </div>
    </div>
  );
}