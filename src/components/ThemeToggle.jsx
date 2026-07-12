import React from "react";
import { useTheme } from "../context/ThemeContext";
import styles from "./css/ThemeToggle.module.css";

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      className={styles.toggle}
      onClick={toggleTheme}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-label="Toggle theme"
    >
      {isDark ? "🔆" : "🌙"}
    </button>
  );
}