import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Activity, Keyboard, Lock, History, RefreshCw, RotateCcw, Play, Info, Target } from 'lucide-react';
import CommonSidebar from '../../../../components/Visualisation/CommonSidebar';
import ArrayBlock from '../../../../components/Visualisation/ArrayBlock';
import Legend from '../../../../components/Visualisation/Legend';
import { heapSortInfo } from '../../../../algorithms/Sorting/heapSort';
import { COLORS, SPEEDS } from '../../../../constants/visualizationConstants';

const HeapSortVisualization = () => {
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
      <CommonSidebar
        algorithmTitle="Heap Sort"
        algorithmSubtitle="Tree-Based Sorting"
        inputValue={inputValue}
        onInputChange={handleInputChange}
        isRunning={isRunning}
        onRunAlgorithm={heapSort}
        onGenerateRandom={generateRandomArray}
        onReset={resetAll}
        speedIndex={speedIndex}
        onSpeedChange={setSpeedIndex}
        currentStep={currentStep}
        stats={stats}
        complexityInfo={heapSortInfo.complexity}
        runButtonText="Build & Sort Heap"
        inputPlaceholder="50, 20, 10, 40, 30..."
        inputLabel="Comma-Input"
      />

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
                        <ArrayBlock
                            key={idx}
                            value={val}
                            index={idx}
                            isComparing={isComparing}
                            isSwapping={isSwapping}
                            isSorted={isSorted}
                            size="normal"
                            showIndex={false}
                        />
                    );
                })}
            </div>
        </div>

        {/* Tree View (Heap Visualization) */}
        <div className="flex-1 relative p-6 pt-2 pb-12 -mt-6">
            <p className="text-center text-[9px] font-black uppercase text-[#adb5bd] mb-6 tracking-[0.2em]">Binary Max-Heap Logic</p>
            
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
                                  isComparing ? 'bg-[#6c757d] text-white border-[#6c757d] scale-110' : 'bg-white border-[#dee2e6]'}`}
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
        <Legend 
          items={[
            { color: COLORS.carbonBlack, label: "Swapping / Root" },
            { color: COLORS.slateGrey, label: "Comparing" },
            { color: COLORS.platinum, label: "In Heap" },
            { color: COLORS.alabasterGrey, label: "Sorted" }
          ]}
          description="Heap Sort: Max element rises to root, then extracted"
        />
      </main>
    </div>
  );
};

export default HeapSortVisualization;