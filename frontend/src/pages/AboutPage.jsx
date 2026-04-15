import styles from "./AboutPage.module.css";

const FEATURES = [
  { icon: "⚡", title: "Lightning Fast Delivery",  desc: "Our optimized delivery network ensures your food arrives hot and fresh in under 30 minutes, every time." },
  { icon: "🔐", title: "Secure Payments",          desc: "Integrated with Razorpay & Stripe with end-to-end encryption. Your payment data is always protected." },
  { icon: "🍽️", title: "200+ Restaurants",         desc: "From local gems to popular chains — browse a curated list of the best restaurants near you." },
  { icon: "📍", title: "Live Order Tracking",      desc: "Track your order in real-time from the kitchen to your doorstep with live GPS updates." },
  { icon: "⭐", title: "Verified Reviews",         desc: "Every rating and review is from a verified customer who actually ordered. No fake reviews, ever." },
  { icon: "🎁", title: "Exclusive Deals",          desc: "Get personalised deals and offers based on your taste preferences and order history." },
];

const HOW_IT_WORKS = [
  ["01", "Browse",  "Explore menus from hundreds of local restaurants filtered by cuisine, rating, or price."],
  ["02", "Order",   "Add your favourites to cart and checkout securely with multiple payment options."],
  ["03", "Track",   "Watch your order in real-time as it moves from the kitchen to your door."],
  ["04", "Enjoy",   "Fresh, hot food delivered to you. Rate your experience and earn rewards."],
];

const STATS = [
  ["200+", "Restaurants"],
  ["50K+", "Happy Customers"],
  ["4.8 ★", "Average Rating"],
  ["< 30 min", "Avg. Delivery"],
];

const TEAM = [];

const STACK = [];

export default function AboutPage() {
  return (
    <div className="page">

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <span className="badge" style={{ marginBottom: 18 }}>About FoodDash</span>
        <h1 className={styles.heroTitle}>
          Connecting you with<br />
          <span className={styles.accent}>Great Food</span>
        </h1>
        <p className={styles.heroSub}>
          FoodDash is a modern food delivery platform built with React, Node.js,
          and MongoDB — designed to deliver an unmatched ordering experience.
        </p>
        <div className={styles.stackTags}>
          {STACK.map((t) => <span key={t} className="tag">{t}</span>)}
        </div>
      </section>

      {/* ── Features ── */}
      <section className={styles.section}>
        <span className="badge" style={{ marginBottom: 14 }}>Features</span>
        <h2 className={styles.sectionTitle}>Why choose FoodDash?</h2>
        <div className={styles.featGrid}>
          {FEATURES.map((f) => (
            <div className={styles.featCard} key={f.title}>
              <div className={styles.featIcon}>{f.icon}</div>
              <div className={styles.featTitle}>{f.title}</div>
              <div className={styles.featDesc}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <span className="badge" style={{ marginBottom: 14 }}>Process</span>
        <h2 className={styles.sectionTitle}>How It Works</h2>
        <div className={styles.stepsGrid}>
          {HOW_IT_WORKS.map(([n, t, d]) => (
            <div className={styles.stepCard} key={n}>
              <div className={styles.stepNum}>{n}</div>
              <div className={styles.stepTitle}>{t}</div>
              <div className={styles.stepDesc}>{d}</div>
            </div>
          ))}
        </div>
      </section>

      <div className={styles.statsWrap}>
        <div className={styles.statsBanner}>
          {STATS.map(([v, l]) => (
            <div key={l} className={styles.statItem}>
              <div className={styles.statVal}>{v}</div>
              <div className={styles.statLbl}>{l}</div>
            </div>
          ))}
        </div>
      </div>
      
      <section className={styles.section} style={{ textAlign: "center" }}>
        <span className="badge" style={{ marginBottom: 14 }}>Our Team</span>
        <h2 className={styles.sectionTitle}>Meet the Builders</h2>
        <p className={styles.teamSub}>Built with ❤️ by our passionate team</p>
        <div className={styles.teamGrid}>
          {TEAM.map((m) => (
            <div className={styles.teamCard} key={m.name}>
              <div className={styles.avatar}>{m.emoji}</div>
              <div className={styles.teamName}>{m.name}</div>
              <div className={styles.teamRole}>{m.role}</div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
