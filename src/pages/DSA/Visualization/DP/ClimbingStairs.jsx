import React, { useState, useEffect, useRef } from 'react';
import { TrendingUp } from 'lucide-react';
import ClimbingStairsSidebar from './ClimbingStairsSidebar';
import climbingStairsInfo from './climbingStairsInfo';
import { COLORS, SPEEDS, MAX_STAIRS, STEP_HEIGHT_UNIT, PILLAR_WIDTH, PILLAR_GAP } from './climbingStairsUtils';

/**
 * Climbing Stairs (1D Dynamic Programming) Visualizer
 * Palette: Monochromatic "Snow to Carbon"
 * Feature: Precise Arc Trajectories between pillars
 */

const ClimbingStairs = () => {
  const [n, setN] = useState(10);
  const [dp, setDp] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isRunning, setIsRunning] = useState(false);
  const [speedIndex, setSpeedIndex] = useState(1);
  const [status, setStatus] = useState('Ready to start.');
  const containerRef = useRef(null);

  const speedRef = useRef(SPEEDS[1].value);
  const isRunningRef = useRef(false);

  useEffect(() => {
    speedRef.current = SPEEDS[speedIndex].value;
  }, [speedIndex]);

  const initDP = (stairs) => {
    const table = new Array(stairs + 1).fill(null);
    setDp(table);
    setCurrentIndex(-1);
    setIsRunning(false);
    isRunningRef.current = false;
    setStatus(`Target: Step ${stairs}. Press Start.`);
  };

  useEffect(() => {
    initDP(n);
  }, [n]);

  const sleep = () => new Promise(r => setTimeout(r, speedRef.current));

  const runAlgorithm = async () => {
    if (isRunning) return;
    setIsRunning(true);
    isRunningRef.current = true;

    const localDp = new Array(n + 1).fill(0);

    // Base Case 0
    setCurrentIndex(0);
    setStatus('Base Case: 1 way to reach ground floor.');
    localDp[0] = 1;
    setDp([...localDp]);
    await sleep();
    if (!isRunningRef.current) return;

    // Base Case 1
    setCurrentIndex(1);
    setStatus('Step 1: 1 way (single 1-step jump from ground).');
    localDp[1] = 1;
    setDp([...localDp]);
    await sleep();
    if (!isRunningRef.current) return;

    // Iterative DP
    for (let i = 2; i <= n; i++) {
      if (!isRunningRef.current) return;
      setCurrentIndex(i);
      setStatus(`Calculating Step ${i}...`);
      await sleep();
      if (!isRunningRef.current) return;

      localDp[i] = localDp[i - 1] + localDp[i - 2];
      setDp([...localDp]);
      setStatus(
        `Step ${i} = ${localDp[i - 1]} + ${localDp[i - 2]} = ${localDp[i]} ways.`
      );
      await sleep();
    }

    setStatus(`Complete! Total ways: ${localDp[n]}.`);
    setIsRunning(false);
    isRunningRef.current = false;
  };

  const handleSpeedChange = (idx) => {
    setSpeedIndex(idx);
  };

  const handleReset = () => {
    initDP(n);
  };

  return (
    <div className="flex h-screen bg-[#f8f9faff] text-[#212529] font-sans overflow-hidden">
      {/* Sidebar */}
      <ClimbingStairsSidebar
        n={n}
        setN={setN}
        isRunning={isRunning}
        speedIndex={speedIndex}
        onSpeedChange={handleSpeedChange}
        onRun={runAlgorithm}
        onReset={handleReset}
        status={status}
        dp={dp}
        currentIndex={currentIndex}
        MAX_STAIRS={MAX_STAIRS}
        SPEEDS={SPEEDS}
        complexityInfo={climbingStairsInfo}
      />

      {/* Main Workspace */}
      <main className="flex-1 relative flex flex-col items-center justify-center p-8 bg-[#f8f9faff]">
        <div
          className="relative flex items-end justify-center h-[600px] w-full max-w-5xl"
          ref={containerRef}
        >
          {/* Jump Arcs Layer */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-10">
            {currentIndex >= 2 && isRunning && (
              <g className="animate-in fade-in duration-500">
                {/* Arc from i-1 */}
                <path
                  d={(() => {
                    const startX = (currentIndex - 1) * (PILLAR_WIDTH + PILLAR_GAP) + PILLAR_WIDTH / 2;
                    const startY = 600 - (currentIndex * STEP_HEIGHT_UNIT) - 60;
                    const endX =
                      currentIndex * (PILLAR_WIDTH + PILLAR_GAP) + PILLAR_WIDTH / 2;
                    const endY = 600 - ((currentIndex + 1) * STEP_HEIGHT_UNIT) - 60;
                    const midX = (startX + endX) / 2;
                    const midY = Math.min(startY, endY) - 50;
                    return `M ${startX} ${startY} Q ${midX} ${midY} ${endX} ${endY}`;
                  })()}
                  fill="none"
                  stroke={COLORS.carbonBlack}
                  strokeWidth="3"
                  strokeDasharray="6,4"
                  className="animate-[dash_1s_linear_infinite]"
                />
                {/* Arc from i-2 */}
                <path
                  d={(() => {
                    const startX = (currentIndex - 2) * (PILLAR_WIDTH + PILLAR_GAP) + PILLAR_WIDTH / 2;
                    const startY = 600 - ((currentIndex - 1) * STEP_HEIGHT_UNIT) - 60;
                    const endX =
                      currentIndex * (PILLAR_WIDTH + PILLAR_GAP) + PILLAR_WIDTH / 2;
                    const endY = 600 - ((currentIndex + 1) * STEP_HEIGHT_UNIT) - 60;
                    const midX = (startX + endX) / 2;
                    const midY = Math.min(startY, endY) - 100;
                    return `M ${startX} ${startY} Q ${midX} ${midY} ${endX} ${endY}`;
                  })()}
                  fill="none"
                  stroke={COLORS.slateGrey}
                  strokeWidth="2"
                  strokeDasharray="6,4"
                  className="animate-[dash_1.5s_linear_infinite]"
                />
              </g>
            )}
          </svg>

          {/* Visual Stairs */}
          <div className="flex items-end gap-[20px] pb-[60px] relative">
            {Array.from({ length: n + 1 }).map((_, i) => {
              const isCurrent = currentIndex === i;
              const isDep = i === currentIndex - 1 || i === currentIndex - 2;
              const isDone = dp[i] !== null;

              return (
                <div
                  key={i}
                  className="flex flex-col items-center w-[50px] transition-all duration-500"
                >
                  {/* Ways Label */}
                  <div
                    className={`mb-3 transition-all duration-500 h-6 flex items-center justify-center ${
                      isDone ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-black whitespace-nowrap border ${
                        isCurrent
                          ? 'bg-[#212529] text-white border-[#212529] shadow-xl animate-bounce'
                          : 'bg-white text-[#6c757d] border-[#dee2e6]'
                      }`}
                    >
                      {dp[i]}
                    </span>
                  </div>

                  {/* Stair Pillar */}
                  <div
                    className={`w-full transition-all duration-500 rounded-t-xl flex items-center justify-center border-t-4
                      ${
                        isCurrent
                          ? 'bg-[#212529] border-[#212529] shadow-2xl scale-105 z-20'
                          : isDep
                          ? 'bg-[#adb5bd] border-[#6c757d] scale-105 shadow-md'
                          : isDone
                          ? 'bg-white border-[#dee2e6] text-[#dee2e6]'
                          : 'bg-[#e9ecefff] border-transparent opacity-20'
                      }
                    `}
                    style={{ height: `${(i + 1) * STEP_HEIGHT_UNIT}px` }}
                  >
                    <span
                      className={`text-[10px] font-black rotate-90 sm:rotate-0 ${
                        isCurrent || isDep ? 'text-white' : 'text-[#ced4da]'
                      }`}
                    >
                      {i}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Ground Marker */}
          <div className="absolute bottom-[40px] left-0 right-0 border-t border-[#dee2e6] flex justify-center">
            <span className="bg-[#f8f9faff] px-4 -mt-3 text-[9px] font-black uppercase text-[#adb5bd] tracking-[0.4em]">
              Foundation
            </span>
          </div>
        </div>

        {/* Legend Overlay */}
        <div className="mt-4 flex flex-col items-center gap-3 px-10 py-5 bg-white border border-[#dee2e6] rounded-3xl shadow-xl">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#212529]"></div>
              <span className="text-[9px] font-black uppercase text-[#6c757d]">Target Step</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#adb5bd]"></div>
              <span className="text-[9px] font-black uppercase text-[#6c757d]">Dependencies</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-0.5 bg-[#6c757d] border-dashed border-t-2"></div>
              <span className="text-[9px] font-black uppercase text-[#6c757d]">Logic Flow</span>
            </div>
          </div>
          <div className="w-full h-px bg-[#f1f3f5]"></div>
          <div className="flex items-center gap-2 text-[#adb5bd]">
            <TrendingUp size={14} />
            <span className="text-[10px] font-black uppercase tracking-wider">
              Solution: dp[i] = dp[i-1] + dp[i-2]
            </span>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -20;
          }
        }
      `}</style>
    </div>
  );
};

export default ClimbingStairs;
