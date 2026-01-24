import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  RotateCcw, 
  Zap, 
  Activity, 
  Info, 
  RefreshCw, 
  Keyboard,
  Lock,
  Target,
  ArrowRightLeft,
  ArrowLeft
} from 'lucide-react';
import CommonSidebar from '../../../components/Visualisation/CommonSidebar';
import ArrayBlock from '../../../components/Visualisation/ArrayBlock';
import Legend from '../../../components/Visualisation/Legend';
import { quickSortInfo } from '../../../algorithms/Sorting/quickSort';

/**
 * Quick Sort Block Visualizer
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

const QuickSortVisualization = () => {
  const [array, setArray] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [speedIndex, setSpeedIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  
  // Algorithm Tracking State
  const [pivotIndex, setPivotIndex] = useState(-1);
  const [pointerI, setPointerI] = useState(-1);
  const [pointerJ, setPointerJ] = useState(-1);
  const [activeRange, setActiveRange] = useState([-1, -1]);
  const [sortedIndices, setSortedIndices] = useState(new Set());
  const [stats, setStats] = useState({ comparisons: 0, swaps: 0 });
  const [currentStep, setCurrentStep] = useState("Add numbers to begin");

  const speedRef = useRef(SPEEDS[0].value);
  const isRunningRef = useRef(false);

  useEffect(() => {
    speedRef.current = SPEEDS[speedIndex].value;
  }, [speedIndex]);

  const generateRandomArray = () => {
    if (isRunning) return;
    const count = 10;
    const newArray = Array.from({ length: count }, () => Math.floor(Math.random() * 90) + 10);
    setArray(newArray);
    setInputValue(newArray.join(', '));
    resetStates();
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
    resetStates();
  };

  const resetStates = () => {
    setPivotIndex(-1);
    setPointerI(-1);
    setPointerJ(-1);
    setActiveRange([-1, -1]);
    setSortedIndices(new Set());
    setStats({ comparisons: 0, swaps: 0 });
    setCurrentStep("Ready to sort");
  };

  useEffect(() => {
    generateRandomArray();
  }, []);

  const sleep = () => new Promise(r => setTimeout(r, speedRef.current));

  // Lomuto Partition Logic
  const partition = async (arr, low, high, localStats) => {
    let pivot = arr[high];
    setPivotIndex(high);
    setCurrentStep(`Picking pivot ${pivot} at index ${high}`);
    await sleep();

    let i = low - 1;
    setPointerI(i);

    for (let j = low; j < high; j++) {
      if (!isRunningRef.current) return;
      
      setPointerJ(j);
      localStats.comparisons++;
      setStats({ ...localStats });
      setCurrentStep(`Comparing ${arr[j]} with pivot ${pivot}`);
      await sleep();

      if (arr[j] < pivot) {
        i++;
        setPointerI(i);
        setCurrentStep(`${arr[j]} < ${pivot}, increment pointer I and swap`);
        
        let temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
        
        localStats.swaps++;
        setStats({ ...localStats });
        setArray([...arr]);
        await sleep();
      }
    }

    // Place pivot in correct position
    setCurrentStep(`Placing pivot ${pivot} in its final sorted position`);
    let temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;
    
    localStats.swaps++;
    setStats({ ...localStats });
    setArray([...arr]);
    setSortedIndices(prev => new Set([...prev, i + 1]));
    await sleep();

    return i + 1;
  };

  const quickSortRecursive = async (arr, low, high, localStats) => {
    if (low <= high) {
      if (!isRunningRef.current) return;
      
      setActiveRange([low, high]);
      let pi = await partition(arr, low, high, localStats);
      
      setPointerI(-1);
      setPointerJ(-1);
      setPivotIndex(-1);

      await quickSortRecursive(arr, low, pi - 1, localStats);
      await quickSortRecursive(arr, pi + 1, high, localStats);
    }
  };

  const startSort = async () => {
    if (isRunning || array.length < 2) return;
    setIsRunning(true);
    isRunningRef.current = true;
    let localStats = { comparisons: 0, swaps: 0 };
    let arr = [...array];
    
    await quickSortRecursive(arr, 0, arr.length - 1, localStats);
    
    if (isRunningRef.current) {
      setSortedIndices(new Set(arr.keys()));
      setCurrentStep("Quick Sort Complete");
    }
    
    setPivotIndex(-1);
    setPointerI(-1);
    setPointerJ(-1);
    setActiveRange([-1, -1]);
    setIsRunning(false);
    isRunningRef.current = false;
  };

  const resetAll = () => {
    isRunningRef.current = false;
    setIsRunning(false);
    generateRandomArray();
  };

  return (
    <div className="flex h-screen bg-[#f8f9faff] text-[#212529] font-sans overflow-hidden">
      <CommonSidebar
        algorithmTitle="Quick Sort"
        algorithmSubtitle="Partitioning Visualizer"
        inputValue={inputValue}
        onInputChange={handleInputChange}
        isRunning={isRunning}
        onRunAlgorithm={startSort}
        onGenerateRandom={generateRandomArray}
        onReset={resetAll}
        speedIndex={speedIndex}
        onSpeedChange={setSpeedIndex}
        currentStep={currentStep}
        stats={stats}
        complexityInfo={quickSortInfo.complexity}
        runButtonText="Start Partitioning"
        inputPlaceholder="38, 27, 43, 3, 9, 82, 10"
        inputLabel="Input Array"
      />

      {/* Workspace */}
      <main className="flex-1 flex flex-col items-center justify-center p-12 bg-[#f8f9faff] relative">
        
        {/* Pointer Labels */}
        <div className="mb-12 flex gap-4 absolute top-20 left-1/2 -translate-x-1/2">
          <div className="flex items-center gap-2 px-3 py-1 bg-white border border-[#dee2e6] rounded-full shadow-sm">
            <div className="w-2 h-2 rounded-full bg-[#6c757d]"></div>
            <span className="text-[9px] font-bold text-[#6c757d] uppercase tracking-wider">Pointer I (Smaller)</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-white border border-[#dee2e6] rounded-full shadow-sm">
            <div className="w-2 h-2 rounded-full bg-[#adb5bd]"></div>
            <span className="text-[9px] font-bold text-[#adb5bd] uppercase tracking-wider">Pointer J (Scanning)</span>
          </div>
        </div>

        {/* Array Display */}
        <div className="flex items-center gap-3">
          {array.map((val, idx) => {
            const isPivot = pivotIndex === idx;
            const isI = pointerI === idx;
            const isJ = pointerJ === idx;
            const inRange = idx >= activeRange[0] && idx <= activeRange[1];
            const isSorted = sortedIndices.has(idx);

            return (
              <div key={idx} className="flex flex-col items-center gap-4">
                <ArrayBlock
                  value={val}
                  index={idx}
                  isPivot={isPivot}
                  isI={isI}
                  isJ={isJ}
                  inRange={inRange}
                  isSorted={isSorted}
                  size="large"
                  showIndex={false}
                />
                <div className="flex flex-col items-center h-4">
                  {isPivot && <Target size={12} className="text-[#212529] animate-pulse" />}
                  {!isPivot && isI && <div className="text-[10px] font-black text-[#6c757d]">I</div>}
                  {!isPivot && isJ && <div className="text-[10px] font-black text-[#adb5bd]">J</div>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <Legend 
          items={[
            { color: COLORS.carbonBlack, label: "Active Pivot", icon: <Target size={10} className="text-white" /> },
            { color: COLORS.slateGrey, label: "Pointer I" },
            { color: COLORS.paleSlate2, label: "Pointer J" },
            { color: COLORS.alabasterGrey, label: "Sorted" }
          ]}
          description="Quick Sort: Partitioning array around a pivot"
        />

      </main>
    </div>
  );
};

const LegendItem = ({ color, label, icon }) => (
  <div className="flex items-center gap-2">
    <div className="w-4 h-4 rounded-md flex items-center justify-center" style={{ backgroundColor: color }}>
        {icon}
    </div>
    <span className="text-[9px] font-black uppercase text-[#6c757d] tracking-wide">{label}</span>
  </div>
);

export default QuickSortVisualization;