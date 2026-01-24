import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  RotateCcw, 
  Binary, 
  Activity, 
  Info, 
  RefreshCw, 
  Keyboard,
  Lock,
  GitBranch,
  History,
  ArrowDownToLine
} from 'lucide-react';

/**
 * Heap Sort Visualizer
 * Palette: Monochromatic "Snow to Carbon"
 */

const COLORS = {
  brightSnow: '#f8f9faff',
  platinum: '#e9ecefff',
  alabasterGrey: '#dee2e6ff',
  paleSlate: '#ced4daff',
  paleSlate2: '#adb5bdff',
  slateGrey: '#6c757dff',
  ironGrey: '#495057ff',
  gunmetal: '#343a40ff',
  carbonBlack: '#212529ff',
};

const SPEEDS = [
  { label: '1x', value: 1000 },
  { label: '1.5x', value: 666 },
  { label: '1.75x', value: 571 },
  { label: '2x', value: 500 },
  { label: '2.5x', value: 400 },
  { label: '3x', value: 333 },
];

const App = () => {
  const [array, setArray] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [speedIndex, setSpeedIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  
  // Algorithm Tracking State
  const [comparing, setComparing] = useState([]); // [parent, child]
  const [swapping, setSwapping] = useState([]);   // [idx1, idx2]
  const [heapSize, setHeapSize] = useState(-1);
  const [stats, setStats] = useState({ comparisons: 0, swaps: 0 });
  const [currentStep, setCurrentStep] = useState("Add numbers to begin");

  const speedRef = useRef(SPEEDS[0].value);
  const isRunningRef = useRef(false);

  useEffect(() => {
    speedRef.current = SPEEDS[speedIndex].value;
  }, [speedIndex]);

  const generateRandomArray = () => {
    if (isRunning) return;
    const count = 7; // Kept small for clear tree visualization
    const newArray = Array.from({ length: count }, () => Math.floor(Math.random() * 80) + 10);
    setArray(newArray);
    setInputValue(newArray.join(', '));
    resetStates(newArray.length);
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputValue(val);
    const parsed = val.split(',')
      .map(v => v.trim())
      .filter(v => v !== "" && !isNaN(v))
      .map(v => parseInt(v, 10))
      .slice(0, 15);
    setArray(parsed);
    resetStates(parsed.length);
  };

  const resetStates = (len) => {
    setComparing([]);
    setSwapping([]);
    setHeapSize(len || -1);
    setStats({ comparisons: 0, swaps: 0 });
    setCurrentStep("Ready to sort");
  };

  useEffect(() => {
    generateRandomArray();
  }, []);

  const sleep = () => new Promise(r => setTimeout(r, speedRef.current));

  const heapify = async (arr, n, i, localStats) => {
    if (!isRunningRef.current) return;
    
    let largest = i;
    let l = 2 * i + 1;
    let r = 2 * i + 2;

    // Compare with Left Child
    if (l < n) {
      setComparing([i, l]);
      localStats.comparisons++;
      setStats({ ...localStats });
      setCurrentStep(`Comparing parent ${arr[i]} with left child ${arr[l]}`);
      await sleep();
      if (arr[l] > arr[largest]) largest = l;
    }

    // Compare with Right Child
    if (r < n) {
      setComparing([i, r]);
      localStats.comparisons++;
      setStats({ ...localStats });
      setCurrentStep(`Comparing parent ${arr[largest]} with right child ${arr[r]}`);
      await sleep();
      if (arr[r] > arr[largest]) largest = r;
    }

    if (largest !== i) {
      setSwapping([i, largest]);
      setCurrentStep(`Swapping ${arr[i]} and ${arr[largest]} to maintain Max Heap`);
      
      let temp = arr[i];
      arr[i] = arr[largest];
      arr[largest] = temp;
      
      localStats.swaps++;
      setStats({ ...localStats });
      setArray([...arr]);
      setInputValue(arr.join(', '));
      await sleep();
      
      setSwapping([]);
      setComparing([]);
      await heapify(arr, n, largest, localStats);
    }
    setComparing([]);
  };

  const heapSort = async () => {
    if (isRunning || array.length < 2) return;
    setIsRunning(true);
    isRunningRef.current = true;
    
    let arr = [...array];
    let n = arr.length;
    let localStats = { comparisons: 0, swaps: 0 };

    // Phase 1: Build Max Heap
    setCurrentStep("Phase 1: Building Max Heap");
    setHeapSize(n);
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      await heapify(arr, n, i, localStats);
    }

    // Phase 2: Extract elements
    setCurrentStep("Phase 2: Extracting Max and Sorting");
    for (let i = n - 1; i > 0; i--) {
      if (!isRunningRef.current) return;

      setSwapping([0, i]);
      setCurrentStep(`Extracting root ${arr[0]} to end position ${i}`);
      
      let temp = arr[0];
      arr[0] = arr[i];
      arr[i] = temp;
      
      localStats.swaps++;
      setStats({ ...localStats });
      setArray([...arr]);
      setHeapSize(i); // Visually reduce the heap size
      await sleep();
      setSwapping([]);

      await heapify(arr, i, 0, localStats);
    }

    setHeapSize(0);
    setCurrentStep("Heap Sort Complete");
    setIsRunning(false);
    isRunningRef.current = false;
  };

  const resetAll = () => {
    isRunningRef.current = false;
    setIsRunning(false);
    generateRandomArray();
  };

  // Helper to calculate tree node positions
  const getNodePos = (index, total) => {
    const level = Math.floor(Math.log2(index + 1));
    const itemsInLevel = Math.pow(2, level);
    const posInLevel = index - (itemsInLevel - 1);
    const x = (posInLevel + 0.5) * (100 / itemsInLevel);
    const y = (level + 1) * 80;
    return { x: `${x}%`, y };
  };

  return (
    <div className="flex h-screen bg-[#f8f9faff] text-[#212529] font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-80 bg-white border-r border-[#dee2e6] flex flex-col shrink-0 shadow-lg z-20 overflow-y-auto">
        <div className="p-6 border-b border-[#f1f3f5]">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 bg-[#212529] rounded flex items-center justify-center text-white">
              <Binary size={18} />
            </div>
            <h1 className="text-base font-bold tracking-tight">Heap Sort</h1>
          </div>
          <p className="text-[10px] text-[#6c757d] uppercase tracking-widest font-black ml-11">Tree-Based Sorting</p>
        </div>

        <div className="p-6 border-b border-[#f1f3f5]">
           <h3 className="text-[10px] font-black text-[#adb5bd] uppercase tracking-wider mb-3 flex items-center gap-2">
             <Activity size={12} /> Speed
           </h3>
           <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#f8f9faff] rounded-xl border border-[#dee2e6]">
              {SPEEDS.map((s, idx) => (
                <button
                  key={s.label}
                  onClick={() => setSpeedIndex(idx)}
                  className={`px-2 py-1.5 text-[10px] font-bold rounded-lg transition-all ${speedIndex === idx ? 'bg-[#212529] text-white shadow-md' : 'text-[#6c757d] hover:bg-slate-100'}`}
                >
                  {s.label}
                </button>
              ))}
           </div>
        </div>

        <div className="p-6 border-b border-[#f1f3f5]">
          <h3 className="text-[10px] font-black text-[#adb5bd] uppercase tracking-wider mb-4 flex items-center justify-between">
            <span className="flex items-center gap-2"><Keyboard size={12} /> Comma-Input</span>
            {isRunning && <Lock size={10} className="text-amber-600" />}
          </h3>
          <textarea 
            value={inputValue}
            onChange={handleInputChange}
            disabled={isRunning}
            className="w-full h-20 p-3 text-xs font-mono rounded-xl border border-[#dee2e6] focus:ring-1 focus:ring-black outline-none transition-all resize-none"
            placeholder="50, 20, 10, 40, 30..."
          />
        </div>

        <div className="p-6 border-b border-[#f1f3f5] space-y-2">
            <button 
              onClick={heapSort}
              disabled={isRunning}
              className="w-full py-3 bg-[#212529] text-white rounded-xl flex items-center justify-center gap-2 font-bold text-xs disabled:opacity-30 transition-transform active:scale-95 shadow-md"
            >
              <Play size={14} fill="white" /> Build & Sort Heap
            </button>
            <div className="flex gap-2">
                <button onClick={generateRandomArray} disabled={isRunning} className="flex-1 py-2 bg-white border border-[#dee2e6] text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-50 transition-all">
                    <RefreshCw size={12} className="inline mr-1" /> Random
                </button>
                <button onClick={resetAll} className="flex-1 py-2 bg-white border border-[#dee2e6] text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-50 transition-all">
                    <RotateCcw size={12} className="inline mr-1" /> Reset
                </button>
            </div>
        </div>

        <div className="flex-1 p-6 space-y-4">
            <div className={`p-4 rounded-xl border-l-4 transition-all ${isRunning ? 'bg-[#212529] text-white' : 'bg-[#f8f9faff] border-[#dee2e6]'}`}>
                <p className="text-[9px] font-black uppercase opacity-60 mb-1">Status</p>
                <p className="text-xs font-bold leading-tight">{currentStep}</p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-3 bg-white border border-[#dee2e6] rounded-xl">
                    <p className="text-[8px] font-black text-[#adb5bd] uppercase mb-1">Comps</p>
                    <p className="text-lg font-bold font-mono">{stats.comparisons}</p>
                </div>
                <div className="p-3 bg-white border border-[#dee2e6] rounded-xl">
                    <p className="text-[8px] font-black text-[#adb5bd] uppercase mb-1">Swaps</p>
                    <p className="text-lg font-bold font-mono">{stats.swaps}</p>
                </div>
            </div>
            <div className="mt-auto pt-4 border-t border-[#f1f3f5]">
               <h4 className="text-[10px] font-black text-[#adb5bd] uppercase tracking-widest mb-3 flex items-center gap-2">
                 <History size={12} /> Complexity
               </h4>
               <div className="space-y-1 text-[10px] font-bold text-[#6c757d]">
                  <div className="flex justify-between"><span>Worst:</span> <span className="font-mono">O(n log n)</span></div>
                  <div className="flex justify-between"><span>Space:</span> <span className="font-mono">O(1)</span></div>
               </div>
            </div>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col bg-[#f8f9faff] relative overflow-hidden">
        
        {/* Array View (Horizontal Blocks) */}
        <div className="p-8 border-b border-[#dee2e6] bg-white">
            <p className="text-center text-[9px] font-black uppercase text-[#adb5bd] mb-4 tracking-[0.2em]">Array Representation</p>
            <div className="flex justify-center gap-2">
                {array.map((val, idx) => {
                    const isComparing = comparing.includes(idx);
                    const isSwapping = swapping.includes(idx);
                    const isSorted = idx >= heapSize && heapSize !== -1;

                    return (
                        <div 
                            key={idx}
                            className={`w-12 h-12 rounded-lg flex items-center justify-center text-xs font-black border-2 transition-all duration-300
                                ${isSwapping ? 'bg-[#212529] text-white border-[#212529] scale-110' : 
                                  isComparing ? 'bg-[#6c757d] text-white border-[#6c757d] scale-105' : 
                                  isSorted ? 'bg-[#dee2e6] text-[#adb5bd] border-transparent' : 'bg-white border-[#e9ecefff]'}
                            `}
                        >
                            {val}
                        </div>
                    );
                })}
            </div>
        </div>

        {/* Tree View (Heap Visualization) */}
        <div className="flex-1 relative p-12">
            <p className="text-center text-[9px] font-black uppercase text-[#adb5bd] mb-12 tracking-[0.2em]">Binary Max-Heap Logic</p>
            
            <div className="relative w-full h-full max-w-2xl mx-auto">
                {/* Render Edges first */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                    {array.map((_, i) => {
                        if (i >= heapSize && isRunning) return null;
                        const left = 2 * i + 1;
                        const right = 2 * i + 2;
                        const parentPos = getNodePos(i, array.length);
                        
                        return [left, right].map(child => {
                            if (child >= array.length || (child >= heapSize && isRunning)) return null;
                            const childPos = getNodePos(child, array.length);
                            return (
                                <line 
                                    key={`edge-${i}-${child}`}
                                    x1={parentPos.x} y1={parentPos.y} 
                                    x2={childPos.x} y2={childPos.y} 
                                    stroke={COLORS.alabasterGrey} strokeWidth="2"
                                />
                            );
                        });
                    })}
                </svg>

                {/* Render Nodes */}
                {array.map((val, i) => {
                    const isSorted = i >= heapSize && heapSize !== -1;
                    if (isSorted && isRunning) return null; // Hide from tree as it's extracted

                    const pos = getNodePos(i, array.length);
                    const isComparing = comparing.includes(i);
                    const isSwapping = swapping.includes(i);

                    return (
                        <div 
                            key={`node-${i}`}
                            className={`absolute -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full flex items-center justify-center text-sm font-black transition-all duration-500 shadow-md border-2
                                ${isSwapping ? 'bg-[#212529] text-white border-[#212529] scale-125 z-10' : 
                                  isComparing ? 'bg-[#6c757d] text-white border-[#6c757d] scale-110' : 'bg-white border-[#dee2e6]'}
                            `}
                            style={{ left: pos.x, top: pos.y }}
                        >
                            {val}
                            <div className="absolute -bottom-6 text-[8px] font-bold text-[#adb5bd]">i:{i}</div>
                        </div>
                    );
                })}
            </div>
        </div>

        {/* Legend Overlay */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 px-8 py-4 bg-white/90 backdrop-blur-sm border border-[#dee2e6] rounded-3xl shadow-2xl">
           <div className="flex items-center gap-6">
              <LegendItem color={COLORS.carbonBlack} label="Swapping / Root" />
              <LegendItem color={COLORS.slateGrey} label="Comparing" />
              <LegendItem color={COLORS.platinum} label="In Heap" />
              <LegendItem color={COLORS.alabasterGrey} label="Sorted" />
           </div>
           
           <div className="w-full h-px bg-[#dee2e6] opacity-50"></div>
           
           <div className="flex items-center gap-2">
             <Info size={14} className="text-[#adb5bd]" />
             <span className="text-[9px] font-black text-[#adb5bd] uppercase tracking-wide">
               Heap Sort: Max element rises to root, then extracted
             </span>
           </div>
        </div>
      </main>
    </div>
  );
};

const LegendItem = ({ color, label }) => (
  <div className="flex items-center gap-2">
    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
    <span className="text-[9px] font-black uppercase text-[#6c757d] tracking-wide">{label}</span>
  </div>
);

export default App;