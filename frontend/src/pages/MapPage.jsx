import { useState, useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";
import styles from "./MapPage.module.css";

const RESTAURANTS = [
  
  {
    id: 1,
    name: "Brijwasi Sweets & Restaurant",
    emoji: "🍛",
    cuisine: "Indian • Sweets",
    rating: 4.8,
    time: "20 min",
    price: "₹₹",
    address: "Holi Gate, Mathura",
    lat: 27.5040,
    lng: 77.6740,
    open: true,
    popular: ["Peda", "Kachori", "Rabri"],
    minOrder: 99,
  },
  {
    id: 2,
    name: "Govinda's Pure Veg",
    emoji: "🥗",
    cuisine: "Pure Veg • Thali",
    rating: 4.7,
    time: "25 min",
    price: "₹",
    address: "Near ISKCON, Mathura",
    lat: 27.5414,
    lng: 77.6754,
    open: true,
    popular: ["Thali", "Sabji", "Dal Makhani"],
    minOrder: 149,
  },
  {
    id: 3,
    name: "Natraj Dhaba",
    emoji: "🍲",
    cuisine: "Dhaba Style • North Indian",
    rating: 4.5,
    time: "30 min",
    price: "₹",
    address: "Krishna Nagar, Mathura",
    lat: 27.4924,
    lng: 77.6737,
    open: true,
    popular: ["Dal Tadka", "Roti", "Paneer Butter Masala"],
    minOrder: 119,
  },
  {
    id: 4,
    name: "Prem Sagar Lassi",
    emoji: "🥛",
    cuisine: "Beverages • Sweets",
    rating: 4.9,
    time: "10 min",
    price: "₹",
    address: "Vishram Ghat, Mathura",
    lat: 27.5008,
    lng: 77.6763,
    open: true,
    popular: ["Lassi", "Makkhan", "Shrikhand"],
    minOrder: 49,
  },
  {
    id: 5,
    name: "Shree Krishna Bhojanalaya",
    emoji: "🍱",
    cuisine: "Vegetarian • Traditional",
    rating: 4.6,
    time: "35 min",
    price: "₹₹",
    address: "Dwarkadhish Temple Road, Mathura",
    lat: 27.5034,
    lng: 77.6711,
    open: false,
    popular: ["Poori Sabji", "Halwa", "Khichdi"],
    minOrder: 129,
  },
  {
    id: 6,
    name: "Mathura Chaat Corner",
    emoji: "🍿",
    cuisine: "Street Food • Chaat",
    rating: 4.4,
    time: "15 min",
    price: "₹",
    address: "Station Road, Mathura",
    lat: 27.4930,
    lng: 77.6660,
    open: true,
    popular: ["Aloo Tikki", "Papri Chaat", "Gol Gappe"],
    minOrder: 59,
  },
  {
    id: 7,
    name: "Hotel Radha Shyam",
    emoji: "🍽️",
    cuisine: "Multi-cuisine • Family",
    rating: 4.3,
    time: "40 min",
    price: "₹₹₹",
    address: "Civil Lines, Mathura",
    lat: 27.5090,
    lng: 77.6580,
    open: true,
    popular: ["Veg Biryani", "Paneer Tikka", "Gulab Jamun"],
    minOrder: 249,
  },
  {
    id: 8,
    name: "Banke Bihari Fast Food",
    emoji: "🍔",
    cuisine: "Fast Food • Snacks",
    rating: 4.2,
    time: "20 min",
    price: "₹",
    address: "New Colony, Mathura",
    lat: 27.5130,
    lng: 77.6810,
    open: true,
    popular: ["Veg Burger", "Sandwich", "French Fries"],
    minOrder: 79,
  },
];

const MATHURA_CENTER = [27.5040, 77.6740];

export default function MapPage() {
  const { addToCart, setPage } = useApp();
  const mapRef       = useRef(null);
  const leafletRef   = useRef(null);
  const markersRef   = useRef([]);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter]     = useState("all");
  const [search, setSearch]     = useState("");
  const [mapLoaded, setMapLoaded] = useState(false);

  const filtered = RESTAURANTS.filter((r) => {
    const matchFilter = filter === "all" || (filter === "open" && r.open);
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) ||
                        r.cuisine.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  useEffect(() => {
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id   = "leaflet-css";
      link.rel  = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }
    if (window.L) { initMap(); return; }

    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = initMap;
    document.head.appendChild(script);

    return () => {
      if (leafletRef.current) {
        leafletRef.current.remove();
        leafletRef.current = null;
      }
    };
  }, []);

  const initMap = () => {
    if (leafletRef.current || !mapRef.current) return;
    const L = window.L;

    const map = L.map(mapRef.current, {
      center: MATHURA_CENTER,
      zoom: 14,
      zoomControl: true,
    });

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> © <a href="https://carto.com/">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19,
      }
    ).addTo(map);

    leafletRef.current = map;
    setMapLoaded(true);
    plotMarkers(map, RESTAURANTS);
  };

  const plotMarkers = (map, restaurants) => {
    const L = window.L;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    restaurants.forEach((r) => {
      const icon = L.divIcon({
        className: "",
        html: `
          <div style="
            display:flex;flex-direction:column;align-items:center;cursor:pointer;
          ">
            <div style="
              width:44px;height:44px;border-radius:50%;
              background:${r.open ? "#ff6b2b" : "#3a3a3e"};
              border:3px solid ${r.open ? "#ff8f5e" : "#555"};
              display:flex;align-items:center;justify-content:center;
              font-size:20px;
              box-shadow:0 4px 16px ${r.open ? "rgba(255,107,43,0.5)" : "rgba(0,0,0,0.4)"};
              transition:all 0.2s;
            ">${r.emoji}</div>
            <div style="
              width:0;height:0;
              border-left:7px solid transparent;
              border-right:7px solid transparent;
              border-top:10px solid ${r.open ? "#ff6b2b" : "#3a3a3e"};
              margin-top:-2px;
            "></div>
          </div>`,
        iconSize: [44, 56],
        iconAnchor: [22, 56],
        popupAnchor: [0, -56],
      });

      const marker = L.marker([r.lat, r.lng], { icon }).addTo(map);
      marker.bindPopup(`
        <div style="
          background:#141416;border:1px solid rgba(255,255,255,0.1);
          border-radius:12px;padding:16px;min-width:200px;color:#f0ede8;
          font-family:'DM Sans',sans-serif;
        ">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
            <span style="font-size:24px">${r.emoji}</span>
            <div>
              <div style="font-weight:700;font-size:14px;">${r.name}</div>
              <div style="color:#8a8680;font-size:11px;">${r.cuisine}</div>
            </div>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px;">
            <span style="background:rgba(255,107,43,0.15);color:#ff6b2b;padding:2px 8px;border-radius:50px;font-size:11px;font-weight:600;">★ ${r.rating}</span>
            <span style="background:rgba(255,255,255,0.07);color:#8a8680;padding:2px 8px;border-radius:50px;font-size:11px;">⏱ ${r.time}</span>
            <span style="background:${r.open ? "rgba(61,220,132,0.12)" : "rgba(255,71,87,0.12)"};color:${r.open ? "#3ddc84" : "#ff4757"};padding:2px 8px;border-radius:50px;font-size:11px;font-weight:600;">${r.open ? "● Open" : "● Closed"}</span>
          </div>
          <div style="color:#8a8680;font-size:11px;margin-bottom:4px;">📍 ${r.address}</div>
          <div style="color:#8a8680;font-size:11px;">Min order: ${r.price} · ₹${r.minOrder}</div>
        </div>`,
        {
          maxWidth: 260,
          className: "fd-popup",
        }
      );

      marker.on("click", () => setSelected(r));
      markersRef.current.push(marker);
    });
  };

  useEffect(() => {
    if (!leafletRef.current || !window.L) return;
    plotMarkers(leafletRef.current, filtered);
  }, [filter, search]);
  const flyTo = (r) => {
    setSelected(r);
    if (leafletRef.current) {
      leafletRef.current.flyTo([r.lat, r.lng], 16, { duration: 1.2 });
    }
  };

  return (
    <div className="page">
      <div className={styles.pageHeader}>
        <div>
          <span className="badge" style={{ marginBottom: 12 }}>📍 Live Map</span>
          <h1 className={styles.title}>Restaurants Near You</h1>
          <p className={styles.sub}>Mathura, Uttar Pradesh · {filtered.length} restaurants found</p>
        </div>
        <button className="btn btn-ghost" onClick={() => setPage("menu")} style={{ flexShrink: 0 }}>
          ← Back to Menu
        </button>
      </div>

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarTop}>
            <div className={styles.searchWrap}>
              <span className={styles.searchIcon}>🔍</span>
              <input
                className={styles.searchInput}
                placeholder="Search restaurants..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className={styles.filterRow}>
              {[["all", "🍽️ All"], ["open", "✅ Open Now"]].map(([v, l]) => (
                <button
                  key={v}
                  className={`${styles.filterBtn} ${filter === v ? styles.filterBtnActive : ""}`}
                  onClick={() => setFilter(v)}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.list}>
            {filtered.length === 0 ? (
              <div className={styles.emptyList}>
                <div style={{ fontSize: 40, marginBottom: 10 }}>🍽️</div>
                <div>No restaurants found</div>
              </div>
            ) : (
              filtered.map((r) => (
                <div
                  key={r.id}
                  className={`${styles.card} ${selected?.id === r.id ? styles.cardActive : ""}`}
                  onClick={() => flyTo(r)}
                >
                  <div className={styles.cardTop}>
                    <div className={styles.cardEmoji}>{r.emoji}</div>
                    <div className={styles.cardInfo}>
                      <div className={styles.cardName}>{r.name}</div>
                      <div className={styles.cardCuisine}>{r.cuisine}</div>
                    </div>
                    <span
                      className={styles.openDot}
                      style={{ background: r.open ? "var(--green)" : "var(--red)" }}
                    />
                  </div>
                  <div className={styles.cardMeta}>
                    <span className={styles.rating}>★ {r.rating}</span>
                    <span>·</span>
                    <span>⏱ {r.time}</span>
                    <span>·</span>
                    <span>{r.price}</span>
                  </div>
                  <div className={styles.cardAddress}>📍 {r.address}</div>

                  {selected?.id === r.id && (
                    <div className={styles.cardExpanded}>
                      <div className={styles.popularLabel}>Popular dishes:</div>
                      <div className={styles.popularTags}>
                        {r.popular.map((p) => (
                          <span key={p} className={styles.popularTag}>{p}</span>
                        ))}
                      </div>
                      <div className={styles.cardActions}>
                        <button
                          className="btn btn-primary"
                          style={{ flex: 1, padding: "10px", fontSize: 13 }}
                          onClick={(e) => { e.stopPropagation(); setPage("menu"); }}
                        >
                          Order Now →
                        </button>
                        <button
                          className="btn btn-ghost"
                          style={{ padding: "10px 14px", fontSize: 13 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(`https://www.google.com/maps?q=${r.lat},${r.lng}`, "_blank");
                          }}
                        >
                          🗺️
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </aside>

        <div className={styles.mapWrap}>
          <div ref={mapRef} className={styles.map} />
          {!mapLoaded && (
            <div className={styles.mapLoading}>
              <div className={styles.mapLoadingSpinner} />
              <div>Loading Mathura map...</div>
            </div>
          )}
          {mapLoaded && (
            <div className={styles.legend}>
              <div className={styles.legendTitle}>Legend</div>
              <div className={styles.legendRow}>
                <span className={styles.legendDot} style={{ background: "var(--orange)" }} />
                <span>Open restaurant</span>
              </div>
              <div className={styles.legendRow}>
                <span className={styles.legendDot} style={{ background: "#3a3a3e", border: "2px solid #555" }} />
                <span>Closed</span>
              </div>
            </div>
          )}
          {mapLoaded && (
            <button
              className={styles.resetBtn}
              onClick={() => {
                leafletRef.current?.flyTo(MATHURA_CENTER, 14, { duration: 1.2 });
                setSelected(null);
              }}
            >
              🎯 Reset View
            </button>
          )}
          {mapLoaded && (
            <div className={styles.statsOverlay}>
              <div className={styles.statChip}>
                <span style={{ color: "var(--green)" }}>●</span>
                {RESTAURANTS.filter((r) => r.open).length} Open
              </div>
              <div className={styles.statChip}>
                📍 Mathura, UP
              </div>
            </div>
          )}
        </div>
      </div>
      <style>{`
        .leaflet-popup-content-wrapper {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          padding: 0 !important;
        }
        .leaflet-popup-content { margin: 0 !important; }
        .leaflet-popup-tip-container { display: none !important; }
        .leaflet-control-zoom a {
          background: #141416 !important;
          color: #f0ede8 !important;
          border-color: rgba(255,255,255,0.1) !important;
        }
        .leaflet-control-zoom a:hover {
          background: #ff6b2b !important;
          color: #fff !important;
        }
        .leaflet-control-attribution {
          background: rgba(12,12,14,0.8) !important;
          color: #5a5752 !important;
          font-size: 10px !important;
        }
        .leaflet-control-attribution a { color: #8a8680 !important; }
        .fd-popup .leaflet-popup-content-wrapper { border-radius: 12px !important; }
      `}</style>
    </div>
  );
}
