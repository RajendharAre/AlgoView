// src/components/Layout/Header.jsx
import { useAuth } from "../../hooks/useAuth";
import { Brain } from "lucide-react";
import UserProfile from "../Common/UserProfile";

const COLORS = {
  tekhelet: "#3d348b",
  slateBlue: "#7678ed",
  yellow: "#f7b801",
  tangerine: "#f18701",
  persimmon: "#f35b04",
};

const Header = () => {
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
          <div className="flex items-center gap-3">
            <Brain className="h-8 w-8 text-white" />
            <h1 className="text-xl font-bold tracking-wide">
              Algorithm Visualizer
            </h1>
          </div>

          {/* Right side (User Profile) */}
          <div className="flex items-center">
            <UserProfile />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
