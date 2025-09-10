// src/components/Layout/Header.jsx
import { useAuth } from "../../hooks/useAuth";
import { LogOut } from "lucide-react";

const COLORS = {
  tekhelet: "#3d348b",
  slateBlue: "#7678ed",
  yellow: "#f7b801",
  tangerine: "#f18701",
  persimmon: "#f35b04",
};


function getDisplayName(email) {
  if (!email) return "User";

  // take only the part before @
  let namePart = email.split("@")[0];

  // replace special characters/underscores/dots with spaces
  namePart = namePart.replace(/[^a-zA-Z]+/g, " ");

  // split into words, capitalize each, and join back
  return namePart
    .split(" ")
    .filter(Boolean) // remove empty
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}


const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header
      className="shadow-md border-b"
      style={{
        background: `linear-gradient(90deg, ${COLORS.tekhelet}, ${COLORS.slateBlue})`,
        color: "white",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side (Logo / Title) */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold tracking-wide">
              Algorithm Visualizer
            </h1>
          </div>

          {/* Right side (User + Logout) */}
          <div className="flex items-center space-x-6">
            <span className="text-sm font-medium opacity-90">
              Welcome, <span className="font-semibold">{getDisplayName(user?.email)}</span>
            </span>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold shadow-sm transition-colors"
              style={{
                backgroundColor: COLORS.persimmon,
                color: "white",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = COLORS.tangerine)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = COLORS.persimmon)
              }
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
