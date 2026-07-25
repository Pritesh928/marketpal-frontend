import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useCart } from "../context/CartContext";
import styles from "./css/Navbar.module.css";

export default function Navbar() {
  const { isLoggedIn, user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>

        <Link to="/home" className={styles.logo}>
          MarketPal
        </Link>

        <div className={styles.desktopNav}>
          <Link to="/home" className={styles.navLink}>Browse</Link>

          {isLoggedIn && (
          <Link to="/cart" className={styles.cartBtn}>
              🛒
            {cartCount > 0 && (
          <span className={styles.cartBadge}>{cartCount}</span>
          )}
          </Link>
        )}

          {isLoggedIn ? (
            <>
              <Link to="/sell" className={styles.navLink}>Sell</Link>
              <Link to="/my-products" className={styles.navLink}>My Products</Link>
              <span className={styles.username}>@{user?.username}</span>
              <button onClick={handleLogout} className={styles.logoutBtn}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={styles.navLink}>Login</Link>
              <Link to="/register" className={styles.registerBtn}>
                Register
              </Link>
            </>
          )}

          <button
            className={styles.themeBtn}
            onClick={toggleTheme}
            title={isDark ? "Light mode" : "Dark mode"}
          >
            {isDark ? "🌞" : "🌙"}
          </button>
        </div>

        <div className={styles.mobileRight}>
          <button className={styles.themeBtn} onClick={toggleTheme}>
            {isDark ? "🌞" : "🌙"}
          </button>
          <button
            className={styles.hamburger}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

      </div>

      {menuOpen && (
        <div className={styles.mobileMenu}>
          <Link to="/home" className={styles.mobileLink}
            onClick={() => setMenuOpen(false)}>Browse</Link>

          {isLoggedIn && (
              <Link to="/cart" className={styles.mobileLink}
                onClick={() => setMenuOpen(false)}>
                🛒 Cart {cartCount > 0 && `(${cartCount})`}
              </Link>
        )}

          {isLoggedIn ? (
            <>
              <Link to="/sell" className={styles.mobileLink}
                onClick={() => setMenuOpen(false)}>Sell</Link>
              <Link to="/my-products" className={styles.mobileLink}
                onClick={() => setMenuOpen(false)}>Listings</Link>
              <span className={styles.mobileUsername}>@{user?.username}</span>
              <button onClick={handleLogout} className={styles.mobileLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={styles.mobileLink}
                onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className={styles.mobileLink}
                onClick={() => setMenuOpen(false)}>Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
