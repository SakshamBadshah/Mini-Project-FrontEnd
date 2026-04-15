import { AppProvider, useApp } from "./context/AppContext";
import Navbar         from "./components/Navbar";
import CartDrawer     from "./components/CartDrawer";
import ToastContainer from "./components/Toast";
import Footer         from "./components/Footer";
import HomePage       from "./pages/HomePage";
import MenuPage       from "./pages/MenuPage";
import OrdersPage     from "./pages/OrdersPage";
import AboutPage      from "./pages/AboutPage";
import CheckoutPage   from "./pages/CheckoutPage";
import AuthPage       from "./pages/AuthPage";
import AccountPage    from "./pages/AccountPage";
import MapPage        from "./pages/MapPage";       // ← NEW
import "./styles/global.css";

function Shell() {
  const { page } = useApp();
  const hideShell = page === "login";

  return (
    <>
      {!hideShell && <Navbar />}

      <main>
        {page === "home"     && <HomePage />}
        {page === "menu"     && <MenuPage />}
        {page === "orders"   && <OrdersPage />}
        {page === "about"    && <AboutPage />}
        {page === "checkout" && <CheckoutPage />}
        {page === "login"    && <AuthPage />}
        {page === "account"  && <AccountPage />}
        {page === "map"      && <MapPage />}        {/* ← NEW */}
      </main>

      {!hideShell && <Footer />}

      <CartDrawer />
      <ToastContainer />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}
