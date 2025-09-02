/* eslint-disable no-unused-vars */
// src/components/Visualization/ArrayVisualizer.jsx
import { motion } from "framer-motion";

const ArrayVisualizer = ({ data, highlights = [], algorithmType = "Sorting" }) => {
  // Get highlight info for an index
  const getHighlight = (index) => highlights.find((h) => h.index === index);

  // --------- Sorting (bars or bubbles) ---------
  if (algorithmType === "Sorting") {
    const maxValue = Math.max(...data, 10);

    return (
      <div className="w-full bg-gray-100 rounded-lg p-4">
        <div className="flex items-end justify-center gap-1 h-64">
          {data.map((value, index) => {
            const highlight = getHighlight(index);
            let color = "bg-blue-500";
            if (highlight) {
              switch (highlight.color || highlight.type) {
                case "compare":
                  color = "bg-yellow-500";
                  break;
                case "swap":
                  color = "bg-red-500";
                  break;
                case "sorted":
                  color = "bg-green-500";
                  break;
                default:
                  color = "bg-blue-500";
              }
            }

            return (
              <motion.div
                key={index}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  height: `${(value / maxValue) * 100}%`,
                }}
                transition={{ type: "spring", damping: 15, stiffness: 100 }}
                className={`
                  w-8 rounded-t-lg flex items-center justify-center 
                  text-white text-xs font-bold transition-all duration-300
                  ${color}
                `}
                style={{ minWidth: "2rem" }}
              >
                {value}
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }

  // --------- Linear Search ---------
  if (algorithmType === "Searching") {
    return (
      <div className="flex justify-center gap-2 p-6">
        {data.map((value, index) => {
          const highlight = getHighlight(index);

          let color = "bg-gray-200";
          if (highlight) {
            switch (highlight.color || highlight.type) {
              case "checking":
                color = "bg-yellow-400 text-black";
                break;
              case "found":
                color = "bg-green-500 text-white";
                break;
              default:
                color = "bg-gray-200";
            }
          }

          return (
            <motion.div
              key={index}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className={`w-12 h-12 flex items-center justify-center border rounded shadow-md font-bold ${color}`}
            >
              {value}
            </motion.div>
          );
        })}
      </div>
    );
  }

  // --------- Binary Search ---------
  if (algorithmType === "BinarySearch") {
    return (
      <div className="flex justify-center gap-4 p-6">
        {data.map((value, index) => {
          const highlight = getHighlight(index);

          let color = "bg-gray-300";
          let label = null;

          if (highlight) {
            switch (highlight.type) {
              case "low":
                label = "L";
                color = "bg-blue-400";
                break;
              case "mid":
                label = "M";
                color = "bg-yellow-400";
                break;
              case "high":
                label = "H";
                color = "bg-red-400";
                break;
              case "found":
                label = "✓";
                color = "bg-green-500 text-white animate-pulse";
                break;
              default:
                color = "bg-gray-300";
            }
          }

          return (
            <motion.div
              key={index}
              className="flex flex-col items-center"
              initial={{ opacity: 1 }}
              animate={{
                opacity:
                  highlight && ["low", "mid", "high", "found"].includes(highlight.type)
                    ? 1
                    : 0.3,
                scale: highlight?.type === "mid" ? 1.2 : 1,
              }}
              transition={{ duration: 0.5 }}
            >
              {label && (
                <div className="mb-1 font-bold text-lg text-gray-700">{label}</div>
              )}
              <div
                className={`w-14 h-14 flex items-center justify-center rounded-full shadow-lg font-bold ${color}`}
              >
                {value}
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  }

  // --------- Fallback ---------
  return (
    <div className="text-gray-500 p-6">
      No visualization available for this algorithm type
    </div>
  );
};

export default ArrayVisualizer;
