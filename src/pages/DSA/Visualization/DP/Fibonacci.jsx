import React, { useState, useEffect, useRef } from 'react'
import { ChevronRight, TrendingUp } from 'lucide-react'
import FibonacciSidebar from './FibonacciSidebar'
import fibonacciInfo from './fibonacciInfo'
import { COLORS, SPEEDS, MAX_N, DEFAULT_N } from './fibonacciUtils'

/**
 * Fibonacci Sequence Visualizer
 * Bottom-Up Dynamic Programming with Responsive Design
 */

const Fibonacci = () => {
  const [n, setN] = useState(DEFAULT_N)
  const [sequence, setSequence] = useState([])
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [isRunning, setIsRunning] = useState(false)
  const [speedIndex, setSpeedIndex] = useState(1)
  const [status, setStatus] = useState('Adjust n and press Start to generate the sequence.')

  const speedRef = useRef(SPEEDS[1].value)
  const isRunningRef = useRef(false)
  const svgRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    speedRef.current = SPEEDS[speedIndex].value
  }, [speedIndex])

  const initAlgo = count => {
    const arr = new Array(count + 1).fill(null)
    setSequence(arr)
    setCurrentIndex(-1)
    setIsRunning(false)
    isRunningRef.current = false
    setStatus(`Target: F(${count}). Ready to calculate.`)
  }

  useEffect(() => {
    initAlgo(n)
  }, [n])

  const sleep = () => new Promise(r => setTimeout(r, speedRef.current))

  const runFibonacci = async () => {
    if (isRunning) return
    setIsRunning(true)
    isRunningRef.current = true

    const localFib = new Array(n + 1).fill(0)

    // Base Case 0
    setCurrentIndex(0)
    setStatus('Base Case: F(0) = 0')
    localFib[0] = 0
    setSequence([...localFib])
    await sleep()
    if (!isRunningRef.current) return

    // Base Case 1
    if (n >= 1) {
      setCurrentIndex(1)
      setStatus('Base Case: F(1) = 1')
      localFib[1] = 1
      setSequence([...localFib])
      await sleep()
      if (!isRunningRef.current) return
    }

    // Iterative DP
    for (let i = 2; i <= n; i++) {
      if (!isRunningRef.current) return
      setCurrentIndex(i)
      setStatus(`Calculating F(${i}): Summing F(${i - 1}) and F(${i - 2}).`)
      await sleep()
      if (!isRunningRef.current) return

      localFib[i] = localFib[i - 1] + localFib[i - 2]
      setSequence([...localFib])
      setStatus(`F(${i}) = ${localFib[i - 1]} + ${localFib[i - 2]} = ${localFib[i]}.`)
      await sleep()
    }

    setStatus(`Complete! The ${n}-th Fibonacci number is ${localFib[n]}.`)
    setIsRunning(false)
    isRunningRef.current = false
  }

  return (
    <div className="flex flex-col h-screen bg-[#f8f9faff] text-[#212529] font-sans">
      {/* Layout wrapper - Stacks on mobile, side-by-side on desktop */}
      <div className="md:flex md:flex-row md:h-screen flex flex-col flex-1">
        {/* Sidebar - On mobile at TOP (full width), on desktop on LEFT */}
        <div className="w-full md:w-80 h-auto md:h-full overflow-y-auto md:border-r border-t md:border-t-0">
          <FibonacciSidebar
            n={n}
            setN={setN}
            isRunning={isRunning}
            speedIndex={speedIndex}
            onSpeedChange={setSpeedIndex}
            onRun={runFibonacci}
            onReset={() => {
              isRunningRef.current = false
              initAlgo(n)
            }}
            status={status}
            sequence={sequence}
            currentIndex={currentIndex}
            SPEEDS={SPEEDS}
            MAX_N={MAX_N}
            complexityInfo={fibonacciInfo}
          />
        </div>

        {/* Canvas Area - FILLS remaining space */}
        <main className="flex-1 relative bg-[#f8f9faff] overflow-hidden">
          {/* Visualization Container - Responsive */}
          <div
            ref={containerRef}
            className="relative w-full h-full flex items-end justify-center p-4 md:p-8"
          >
            {/* SVG arcs - Responsive */}
            <svg
              ref={svgRef}
              className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-10"
            >
              {currentIndex >= 2 && isRunning && (
                <g className="animate-in fade-in duration-500">
                  {/* Arc from i-1 */}
                  <path
                    d={(() => {
                      const containerWidth = containerRef.current?.clientWidth || 600
                      const pillarGap = Math.max(40, containerWidth / (n + 3))
                      const startX = (currentIndex - 1) * pillarGap + pillarGap / 2
                      const startY = 400 - Math.min(sequence[currentIndex - 1] * 5, 200)
                      const endX = currentIndex * pillarGap + pillarGap / 2
                      const endY = 400 - Math.min(sequence[currentIndex] * 5, 200)
                      return `M ${startX} ${startY} Q ${(startX + endX) / 2} ${startY - 60} ${endX} ${endY}`
                    })()}
                    fill="none"
                    stroke={COLORS.carbonBlack}
                    strokeWidth="2"
                    strokeDasharray="6,4"
                    className="animate-[dash_1s_linear_infinite]"
                  />
                  {/* Arc from i-2 */}
                  <path
                    d={(() => {
                      const containerWidth = containerRef.current?.clientWidth || 600
                      const pillarGap = Math.max(40, containerWidth / (n + 3))
                      const startX = (currentIndex - 2) * pillarGap + pillarGap / 2
                      const startY = 400 - Math.min(sequence[currentIndex - 2] * 5, 200)
                      const endX = currentIndex * pillarGap + pillarGap / 2
                      const endY = 400 - Math.min(sequence[currentIndex] * 5, 200)
                      return `M ${startX} ${startY} Q ${(startX + endX) / 2} ${startY - 100} ${endX} ${endY}`
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

            {/* Pillars - Responsive */}
            <div className="flex items-end gap-1 sm:gap-2 pb-12 md:pb-16 px-2 sm:px-4">
              {Array.from({ length: n + 1 }).map((_, i) => {
                const isCurrent = currentIndex === i
                const isDep = i === currentIndex - 1 || i === currentIndex - 2
                const isDone = sequence[i] !== null
                const height = isDone ? Math.min(sequence[i] * 5 + 20, 300) : 20

                return (
                  <div
                    key={i}
                    className="flex flex-col items-center w-10 sm:w-14 md:w-16 transition-all duration-500"
                  >
                    {/* Value Label */}
                    <div
                      className={`mb-1 sm:mb-2 md:mb-3 transition-all duration-500 h-4 md:h-6 flex items-center justify-center ${
                        isDone ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      <span
                        className={`px-1.5 sm:px-2 py-0.5 rounded text-[8px] sm:text-[9px] md:text-[10px] font-black border ${
                          isCurrent
                            ? 'bg-[#212529] text-white border-[#212529] animate-bounce shadow-lg'
                            : 'bg-white text-[#6c757d] border-[#dee2e6]'
                        }`}
                      >
                        {sequence[i]}
                      </span>
                    </div>

                    {/* Pillar */}
                    <div
                      className={`w-full transition-all duration-500 rounded-t-lg md:rounded-t-xl border-t-2 md:border-t-4 flex items-center justify-center
                      ${
                        isCurrent
                          ? 'bg-[#212529] border-[#212529] shadow-2xl scale-105 z-20'
                          : isDep
                            ? 'bg-[#adb5bd] border-[#6c757d] shadow-md'
                            : isDone
                              ? 'bg-white border-[#dee2e6]'
                              : 'bg-[#e9ecefff] border-transparent opacity-20'
                      }
                    `}
                      style={{ height: `${height}px` }}
                    >
                      <span
                        className={`text-[7px] sm:text-[9px] md:text-[10px] font-black text-center ${
                          isCurrent || isDep ? 'text-white' : 'text-[#ced4da]'
                        }`}
                      >
                        F({i})
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Ground Line */}
            <div className="absolute bottom-10 md:bottom-16 left-2 sm:left-4 right-2 sm:right-4 border-t border-[#dee2e6] flex justify-center">
              <span className="bg-[#f8f9faff] px-2 sm:px-4 -mt-2 md:-mt-3 text-[7px] sm:text-[8px] md:text-[9px] font-black uppercase text-[#adb5bd] tracking-widest md:tracking-[0.4em]">
                Iterative Growth
              </span>
            </div>
          </div>

          {/* Legend - Responsive - Absolute to not affect layout */}
          <div className="absolute bottom-2 md:bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 md:gap-3 px-3 md:px-10 py-2 md:py-4 bg-white/95 border border-[#dee2e6] rounded-xl md:rounded-2xl shadow-lg w-11/12 md:w-auto max-w-md md:max-w-2xl">
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 md:gap-8 w-full justify-center text-[7px] sm:text-[8px] md:text-[9px]">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-[#212529]"></div>
                <span className="font-black uppercase text-[#6c757d]">Active</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-[#adb5bd]"></div>
                <span className="font-black uppercase text-[#6c757d]">Addends</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-[#6c757d]"></div>
                <span className="font-black uppercase text-[#6c757d]">Path</span>
              </div>
            </div>
            <div className="w-full h-px bg-[#f1f3f5]"></div>
            <div className="flex items-center gap-1 md:gap-2 text-[#adb5bd]">
              <TrendingUp size={12} className="md:w-4 md:h-4" />
              <span className="text-[7px] sm:text-[8px] md:text-[10px] font-black uppercase tracking-widest">
                F(n) = F(n-1) + F(n-2)
              </span>
            </div>
          </div>
          <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -20;
          }
        }
      `}</style>
        </main>
      </div>
    </div>
  )
}

export default Fibonacci
