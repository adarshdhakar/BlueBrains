import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import ReportsPage from "./pages/ReportsPage";
import "./App.css";

export default function App() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    try {
      // Correctly read from localStorage, providing a fallback
      const saved = localStorage.getItem("theme");
      if (saved === "dark" || saved === "light") {
        setTheme(saved);
      }
    } catch (e) {
      console.warn("Could not read theme from localStorage", e);
    }
  }, []);

  // Effect to update the document when the theme changes
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    try {
      localStorage.setItem("theme", theme);
    } catch (e) {
      console.warn("Could not persist theme", e);
    }
  }, [theme]);

  return (
    <Router>
      <Routes>
        {/* ADDED: This route redirects the base URL "/" to "/home" */}
        <Route path="/" element={<Navigate to="/home" />} />

        <Route
          path="/home"
          element={<Home theme={theme} setTheme={setTheme} />}
        />
        <Route
          path="/dashboard"
          element={<Dashboard theme={theme} setTheme={setTheme} />}
        />
        <Route
          path="/view-reports"
          element={<ReportsPage theme={theme} setTheme={setTheme} />}
        />
      </Routes>
    </Router>
  );
}
