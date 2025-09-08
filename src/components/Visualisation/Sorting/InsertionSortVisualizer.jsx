// src/components/Visualization/Sorting/InsertionSortVisualizer.jsx
import React from "react";
import { motion as Motion } from "framer-motion";
import "../../../styles/visualizers.css";

const InsertionSortVisualizer = ({
  data = [],
  step = {},
  stepIndex = null,
  totalSteps = null,
}) => {
  const arr = Array.isArray(step?.array) ? step.array : data;

  const keyIndex = typeof step?.keyIndex === "number" ? step.keyIndex : null;
  const comparingIndex =
    typeof step?.comparingIndex === "number" ? step.comparingIndex : null;
  const shiftingIndex =
    typeof step?.shiftingIndex === "number" ? step.shiftingIndex : null;
  const placedIndex =
    typeof step?.placedIndex === "number" ? step.placedIndex : null;
  const doneIndices = Array.isArray(step?.doneIndices) ? step.doneIndices : [];

  return (
    <div className="insertion-visualizer-root">
      {/* Cards */}
      <div className="cards-row">
        {arr.map((value, idx) => {
          let stateClass = "card-neutral";
          if (idx === keyIndex) stateClass = "card-key";
          else if (idx === placedIndex) stateClass = "card-placed";
          else if (idx === shiftingIndex) stateClass = "card-shifting";
          else if (idx === comparingIndex) stateClass = "card-comparing";
          else if (doneIndices.includes(idx)) stateClass = "card-done";

          return (
            <Motion.div
              key={idx}
              layout
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className={`card ${stateClass}`}
            >
              <div className="card-value">{value}</div>
            </Motion.div>
          );
        })}
      </div>

      {/* Legend only */}
      <div className="legend">
        <span className="legend-item">
          <span className="legend-swatch sw-key" /> Key
        </span>
        <span className="legend-item">
          <span className="legend-swatch sw-compare" /> Comparing
        </span>
        <span className="legend-item">
          <span className="legend-swatch sw-shift" /> Shifting
        </span>
        <span className="legend-item">
          <span className="legend-swatch sw-done" /> Sorted
        </span>
      </div>

      {/* Optional step counter (kept minimal) */}
      {typeof stepIndex === "number" && typeof totalSteps === "number" && (
        <div className="step-counter">
          Step {stepIndex + 1} / {totalSteps}
        </div>
      )}
    </div>
  );
};

export default InsertionSortVisualizer;
