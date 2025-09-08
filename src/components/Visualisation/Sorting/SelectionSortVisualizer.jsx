/* eslint-disable no-unused-vars */
// src/components/SelectionSortVisualizer.jsx
import React, { useEffect, useRef, useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { selectionSortGenerator } from "../algorithms/selectionSort";
import "../styles/visualizers.css"; // ensure path is correct

/**
 * Props:
 * - initialArray: number[] (defaults to random)
 * - cardWidth, cardHeight (optional)
 */
export default function SelectionSortVisualizer({
  initialArray = [64, 25, 12, 22, 11],
  cardWidth = 84,
  cardHeight = 110,
}) {
  const [array, setArray] = useState(initialArray.slice());
  const [genState, setGenState] = useState(null); // last yielded object
  const generatorRef = useRef(null);
  const timerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(600); // ms per step
  const [stepIndex, setStepIndex] = useState(0);
  const snapshotHistoryRef = useRef([]);

  // init generator
  const initGenerator = (arr) => {
    generatorRef.current = selectionSortGenerator(arr);
    snapshotHistoryRef.current = [];
    const first = generatorRef.current.next();
    if (!first.done) {
      snapshotHistoryRef.current.push(first.value);
      setGenState(first.value);
      setStepIndex(0);
    }
  };

  useEffect(() => {
    initGenerator(array);
    return cleanupTimer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function cleanupTimer() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  function play() {
    if (isPlaying) return;
    setIsPlaying(true);
    timerRef.current = setInterval(() => {
      stepForward();
    }, speed);
  }

  function pause() {
    setIsPlaying(false);
    cleanupTimer();
  }

  function reset(newArray = null) {
    pause();
    const arr = newArray ? newArray.slice() : array.slice();
    setArray(arr);
    initGenerator(arr);
  }

  // advance one step
  function stepForward() {
    if (!generatorRef.current) return;
    const next = generatorRef.current.next();
    if (next.done) {
      pause();
      return;
    }
    snapshotHistoryRef.current.push(next.value);
    setGenState(next.value);
    setStepIndex((s) => s + 1);
  }

  // step backward using history (simple)
  function stepBackward() {
    pause();
    const history = snapshotHistoryRef.current;
    if (history.length <= 1) return;
    history.pop();
    const prev = history[history.length - 1];
    setGenState(prev);
    setStepIndex(history.length - 1);
    // Note: generator cannot be rewound; this approach relies on history snapshots.
  }

  // speed change effect
  useEffect(() => {
    if (isPlaying) {
      cleanupTimer();
      timerRef.current = setInterval(stepForward, speed);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speed]);

  // helper to build card state class
  const getCardStateClass = (index) => {
    if (!genState) return "card-neutral";

    const done = genState.doneIndices;
    if (done && done.has(index)) return "card-done";

    const swap = genState.swapIndices;
    if (swap && (swap[0] === index || swap[1] === index)) return "card-shifting";

    if (genState.currentIndex === index && genState.minIndex === index) {
      // current target (rare case)
      return "card-key";
    }

    if (genState.minIndex === index) return "card-key";
    if (genState.comparingIndex === index) return "card-comparing";

    return "card-neutral";
  };

  // helper to identify if this is the current swap pair to briefly animate
  const isSwapActive = (index) => {
    if (!genState) return false;
    const swap = genState.swapIndices;
    return swap && (swap[0] === index || swap[1] === index);
  };

  // Utility: randomize array
  function randomize() {
    const newArr = Array.from({ length: 8 }, () =>
      Math.floor(Math.random() * 100) + 1
    );
    setArray(newArr);
    reset(newArr);
  }

  // Render card components
  return (
    <div className="insertion-visualizer-root" style={{ width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div className="cards-row" aria-live="polite">
          <AnimatePresence initial={false}>
            {genState &&
              genState.array.map((value, idx) => {
                const stateClass = getCardStateClass(idx);
                return (
                  <Motion.div
                    key={`card-${idx}-${value}`} // include value so position changes animate smoothly
                    layout
                    initial={{ scale: 0.98, opacity: 0 }}
                    animate={{
                      scale: isSwapActive(idx) ? 1.06 : 1,
                      opacity: 1,
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className={`card ${stateClass}`}
                    style={{
                      width: cardWidth,
                      height: cardHeight,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div className="card-value" aria-hidden="false">
                      {value}
                    </div>
                  </Motion.div>
                );
              })}
          </AnimatePresence>
        </div>
      </div>

      {/* controls + legend */}
      <div className="info-area" style={{ maxWidth: 980, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button
            onClick={() => {
              if (isPlaying) pause();
              else play();
            }}
            className="control-btn"
            aria-pressed={isPlaying}
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? "Pause" : "Play"}
          </button>
          <button onClick={stepBackward} className="control-btn" title="Step back">
            ←
          </button>
          <button onClick={stepForward} className="control-btn" title="Step forward">
            →
          </button>
          <button onClick={() => reset(array)} className="control-btn" title="Reset">
            Reset
          </button>
          <button onClick={randomize} className="control-btn" title="Randomize">
            Randomize
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <label style={{ fontSize: 12, color: "#444" }}>Speed</label>
            <input
              type="range"
              min="150"
              max="1400"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
            />
          </div>
        </div>

        <div style={{ textAlign: "right" }}>
          <div className="legend" role="list" aria-hidden="false">
            <div className="legend-item" role="listitem">
              <span className="legend-swatch sw-key" /> <span>Current Min</span>
            </div>
            <div className="legend-item" role="listitem">
              <span className="legend-swatch sw-compare" /> <span>Comparing</span>
            </div>
            <div className="legend-item" role="listitem">
              <span className="legend-swatch sw-shift" /> <span>Swapping</span>
            </div>
            <div className="legend-item" role="listitem">
              <span className="legend-swatch sw-done" /> <span>Sorted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
