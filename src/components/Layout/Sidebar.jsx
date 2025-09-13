// src/components/Layout/Sidebar.jsx
import React, { useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight } from "lucide-react";
import { ALGORITHMS } from "../../utils/algorithmConstants";

const COLORS = {
  tekhelet: "#3d348b",       // Deep blue
  slateBlue: "#7678ed",      // Purple-blue
  yellow: "#f7b801",         // Selective Yellow
  tangerine: "#f18701",      // Orange
  persimmon: "#f35b04",      // Red-orange
};

const Sidebar = ({ selectedAlgorithm, onAlgorithmSelect }) => {
  const algorithmGroups = {
    "Sorting Algorithms": [
      "bubbleSort",
      "quickSort",
      "mergeSort",
      "insertionSort",
      "selectionSort",
    ],
    "Searching Algorithms": ["linearSearch", "binarySearch"],
    "Graph Algorithms": ["dijkstra", "bfs", "dfs"],
  };

  // Track which group is open (accordion style)
  const [openGroup, setOpenGroup] = useState(null);

  const toggleGroup = (category) => {
    setOpenGroup((prev) => (prev === category ? null : category));
  };

  return (
    <div
      className="w-64 h-screen p-4 text-white"
      style={{ backgroundColor: COLORS.tekhelet }}
    >
      <h2 className="text-xl font-bold mb-6">Algorithms</h2>

      {Object.entries(algorithmGroups).map(([category, algorithms]) => {
        const isOpen = openGroup === category;

        return (
          <div key={category} className="mb-4">
            {/* Category Header */}
            <button
              onClick={() => toggleGroup(category)}
              className="flex justify-between items-center w-full px-3 py-2 rounded-lg font-semibold tracking-wide"
              style={{
                backgroundColor: isOpen ? COLORS.slateBlue : "transparent",
                transition: "background 0.25s ease",
              }}
            >
              <span>{category}</span>
              {isOpen ? (
                <ChevronDown size={18} className="text-white" />
              ) : (
                <ChevronRight size={18} className="text-white" />
              )}
            </button>

            {/* Dropdown Items */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <Motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden mt-1"
                >
                  <div className="space-y-1">
                    {algorithms.map((algoId) => {
                      const isActive = selectedAlgorithm === algoId;
                      return (
                        <button
                          key={algoId}
                          onClick={() => onAlgorithmSelect(algoId)}
                          className="w-full text-left px-3 py-2 rounded-lg transition-colors"
                          style={{
                            backgroundColor: isActive
                              ? COLORS.yellow
                              : "transparent",
                            color: isActive ? COLORS.tekhelet : "#e0e0e0",
                          }}
                        >
                          {ALGORITHMS[algoId.toUpperCase()]?.name || algoId}
                        </button>
                      );
                    })}
                  </div>
                </Motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

export default Sidebar;
