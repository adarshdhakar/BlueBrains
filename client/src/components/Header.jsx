import { Moon, Sun, LayoutDashboard, Home as HomeIcon } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const Header = ({ theme, setTheme }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isHomePage = location.pathname.startsWith("/home");

  return (
    <header
      className="w-full sticky top-0 z-30 bg-transparent backdrop-blur border-b"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3 justify-between">
        <a
          onClick={() => navigate("/")}
          className="flex items-center gap-3 cursor-pointer"
        >
          <img
            src="/download.png"
            alt="BlueBrains Logo"
            className="h-8 w-8 rounded-xl object-cover"
          />
          <div>
            <div
              className="text-sm tracking-widest font-bold uppercase"
              style={{ color: "var(--text)" }}
            >
              BlueBrains
            </div>
            <div className="text-xs" style={{ color: "var(--subtext)" }}>
              Misinformation Combater
            </div>
          </div>
        </a>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              navigate(!isHomePage ? "/home" : "/dashboard");
            }}
            className="px-3 py-1.5 rounded-xl border flex items-center gap-2 cursor-pointer"
            style={{ borderColor: "var(--border)", color: "var(--text)" }}
            aria-label={isHomePage ? "Go to Dashboard" : "Go to Home"}
          >
            {!isHomePage ? (
              <HomeIcon size={16} />
            ) : (
              <LayoutDashboard size={16} />
            )}
            <span className="text-sm">{isHomePage ? "Dashboard" : "Home"}</span>
          </button>

          {!isHomePage && (
            <button
              onClick={() =>
                setTheme((t) => {
                  const next = t === "dark" ? "light" : "dark";
                  try {
                    localStorage.setItem("theme", next);
                    document.documentElement.setAttribute("data-theme", next);
                    if (next === "dark") {
                      document.documentElement.classList.add("dark");
                    } else {
                      document.documentElement.classList.remove("dark");
                    }
                  } catch (e) {
                    console.warn("Could not persist theme", e);
                  }
                  return next;
                })
              }
              className="px-3 py-1.5 rounded-xl border flex items-center gap-2 cursor-pointer"
              style={{ borderColor: "var(--border)", color: "var(--text)" }}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
              <span className="text-sm">
                {theme === "dark" ? "Light" : "Dark"}
              </span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
