import { createContext, useContext, useReducer, useState, useCallback } from "react";

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const idx = state.findIndex((i) => i._id === action.item._id);
      if (idx > -1) return state.map((i, x) => (x === idx ? { ...i, qty: i.qty + 1 } : i));
      return [...state, { ...action.item, qty: 1 }];
    }
    case "INC":    return state.map((i) => (i._id === action.id ? { ...i, qty: i.qty + 1 } : i));
    case "DEC":    return state.map((i) => (i._id === action.id ? { ...i, qty: i.qty - 1 } : i)).filter((i) => i.qty > 0);
    case "REMOVE": return state.filter((i) => i._id !== action.id);
    case "CLEAR":  return [];
    default:       return state;
  }
}

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [cart, dispatch]        = useReducer(cartReducer, []);
  const [cartOpen, setCartOpen] = useState(false);
  const [page, setPage]         = useState("home");
  const [toasts, setToasts]     = useState([]);

  const [user, setUser] = useState(null);

  const addToast = useCallback((msg, type = "info") => {
    const id = Date.now();
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  const addToCart = useCallback(
    (item) => {
      dispatch({ type: "ADD", item });
      addToast(`${item.name} added to cart 🛒`, "success");
    },
    [addToast]
  );

  const cartTotal    = cart.reduce((s, i) => s + i.qty, 0);
  const cartSubtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <AppContext.Provider
      value={{
        cart, dispatch, addToCart,
        cartOpen, setCartOpen,
        cartTotal, cartSubtotal,
        page, setPage,
        user, setUser,
        toasts, addToast,
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
