import { createContext, useContext, useReducer, useState, useCallback, useEffect } from "react";
import { API_BASE } from "../data/constants";

function cartReducer(state, action) {
  switch (action.type) {

    case "SET_CART":
    return (action.payload.items || []).map((item) => ({
      _id:
  typeof item.product === "object"
    ? item.product._id
    : item.product,
      name: item.name,
      price: item.price,
      image: item.image,
      qty: item.quantity,
    }));

    case "ADD": {
      const idx = state.findIndex((i) => i._id === action.item._id);
      if (idx > -1) {
        return state.map((i, x) =>
          x === idx ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...state, { ...action.item, qty: 1 }];
    }

    case "INC":
      return state.map((i) =>
        i._id === action.id ? { ...i, qty: i.qty + 1 } : i
      );

    case "DEC":
      return state
        .map((i) =>
          i._id === action.id ? { ...i, qty: i.qty - 1 } : i
        )
        .filter((i) => i.qty > 0);

    case "REMOVE":
      return state.filter((i) => i._id !== action.id);

    case "CLEAR":
      return [];

    default:
      return state;
  }
}

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, []);
  const [cartOpen, setCartOpen] = useState(false);
  const [page, setPage] = useState("home");
  const [toasts, setToasts] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) return;

  const fetchUser = async () => {
    try {
      const res = await fetch(`${API_BASE}/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setUser(data.user || data);
      } else {
        localStorage.removeItem("token");
      }

    } catch (err) {
      console.log(err);
    }
  };

  fetchUser();
}, []);

  // ✅ FETCH CART FROM BACKEND
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch(`${API_BASE}/cart`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          dispatch({ type: "SET_CART", payload: data });
        }

      } catch (err) {
        console.log(err);
      }
    };

    if (user) fetchCart(); // ✅ only when user logged in
  }, [user]);

  // ✅ TOAST
  const addToast = useCallback((msg, type = "info") => {
    const id = Date.now();
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 3200);
  }, []);

  // ✅ ADD TO CART (BACKEND CONNECTED)
  const addToCart = useCallback(
    async (item) => {
      try {
          if (!item || !item._id && !item.id) {
          console.log("INVALID ITEM:", item);
          return;
        }
        const token = localStorage.getItem("token");

        const res = await fetch(`${API_BASE}/cart/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
          product: item._id || item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: 1,
        })
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message);
        }

        dispatch({ type: "SET_CART", payload: data });

        addToast(`${item.name} added to cart 🛒`, "success");

      } catch (err) {
        console.log(err);
        addToast("Error adding to cart", "error");
      }
    },
    [addToast]
  );

  const cartTotal = cart.reduce((s, i) => s + i.qty, 0);
  const cartSubtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <AppContext.Provider
      value={{
        cart,
        dispatch,
        addToCart,
        cartOpen,
        setCartOpen,
        cartTotal,
        cartSubtotal,
        page,
        setPage,
        user,
        setUser,
        toasts,
        addToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}