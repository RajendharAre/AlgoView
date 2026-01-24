import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  RotateCcw, 
  Square, 
  Activity, 
  Info, 
  RefreshCw, 
  Layers,
  Keyboard,
  Lock,
  Split,
  ArrowDown,
  ArrowLeft
} from 'lucide-react';
import CommonSidebar from '../../../../components/Visualisation/CommonSidebar';
import ArrayBlock from '../../../../components/Visualisation/ArrayBlock';
import Legend from '../../../../components/Visualisation/Legend';
import { mergeSortInfo } from '../../../../algorithms/Sorting/mergeSort';
import { COLORS, SPEEDS } from '../../../../constants/visualizationConstants';

/**
 * Merge Sort Block Visualizer
 * Palette: Monochromatic "Snow to Carbon"
 */

const MergeSortVisualization = () => {
  const [array, setArray] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [speedIndex, setSpeedIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  
  // Algorithm Tracking State
  const [activeRange, setActiveRange] = useState([-1, -1]);
  const [leftBuffer, setLeftBuffer] = useState([]);
  const [rightBuffer, setRightBuffer] = useState([]);
  const [comparing, setComparing] = useState({ side: null, index: -1 });
  const [currentStep, setCurrentStep] = useState("Add numbers to begin");
  const [stats, setStats] = useState({ comparisons: 0, merges: 0 });

  const speedRef = useRef(SPEEDS[0].value);
  const isRunningRef = useRef(false);

  useEffect(() => {
    speedRef.current = SPEEDS[speedIndex].value;
  }, [speedIndex]);

  const generateRandomArray = () => {
    if (isRunning) return;
    const count = 8; // Smaller count for better block visibility
    const newArray = Array.from({ length: count }, () => Math.floor(Math.random() * 90) + 10);
    setArray(newArray);
    setInputValue(newArray.join(', '));
    resetStates();
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputValue(val);
    const parsed = val.split(',').map(v => v.trim()).filter(v => v !== "" && !isNaN(v)).map(v => parseInt(v, 10)).slice(0, 12);
    setArray(parsed);
    resetStates();
  };

  const resetStates = () => {
    setActiveRange([-1, -1]);
    setLeftBuffer([]);
    setRightBuffer([]);
    setComparing({ side: null, index: -1 });
    setStats({ comparisons: 0, merges: 0 });
    setCurrentStep("Ready to sort");
  };

  useEffect(() => {
    generateRandomArray();
  }, []);

  const sleep = () => new Promise(r => setTimeout(r, speedRef.current));

  const merge = async (arr, l, m, r, localStats) => {
    let n1 = m - l + 1;
    let n2 = r - m;

    let L = arr.slice(l, m + 1);
    let R = arr.slice(m + 1, r + 1);

    // Visual: Show the buffers
    setLeftBuffer(L);
    setRightBuffer(R);
    setCurrentStep(`Divided into Left and Right buffers`);
    await sleep();

    let i = 0, j = 0, k = l;

    while (i < n1 && j < n2) {
      if (!isRunningRef.current) return;
      
      setComparing({ left: i, right: j });
      localStats.comparisons++;
      setStats({ ...localStats });
      setCurrentStep(`Comparing ${L[i]} and ${R[j]}`);
      await sleep();

      if (L[i] <= R[j]) {
        arr[k] = L[i];
        i++;
      } else {
        arr[k] = R[j];
        j++;
      }
      
      setArray([...arr]);
      setInputValue(arr.join(', '));
      k++;
      localStats.merges++;
      setStats({ ...localStats });
      await sleep();
    }

    while (i < n1) {
      if (!isRunningRef.current) return;
      arr[k] = L[i];
      setArray([...arr]);
      i++; k++;
      await sleep();
    }

    while (j < n2) {
      if (!isRunningRef.current) return;
      arr[k] = R[j];
      setArray([...arr]);
      j++; k++;
      await sleep();
    }

    setLeftBuffer([]);
    setRightBuffer([]);
    setComparing({ side: null, index: -1 });
  };

  const mergeSortRecursive = async (arr, l, r, localStats) => {
    if (l >= r) return;
    if (!isRunningRef.current) return;

    setActiveRange([l, r]);
    let m = l + Math.floor((r - l) / 2);
    
    setCurrentStep(`Splitting range [${l}-${r}] at index ${m}`);
    await sleep();

    await mergeSortRecursive(arr, l, m, localStats);
    await mergeSortRecursive(arr, m + 1, r, localStats);

    setActiveRange([l, r]);
    await merge(arr, l, m, r, localStats);
  };

  const startSort = async () => {
    if (isRunning || array.length < 2) return;
    setIsRunning(true);
    isRunningRef.current = true;
    let localStats = { comparisons: 0, merges: 0 };
    await mergeSortRecursive([...array], 0, array.length - 1, localStats);
    setIsRunning(false);
    isRunningRef.current = false;
    setCurrentStep("Merge Sort Complete");
    setActiveRange([-1, -1]);
  };

  const resetAll = () => {
    isRunningRef.current = false;
    setIsRunning(false);
    generateRandomArray();
  };

  return (
    <div className="flex h-screen bg-[#f8f9faff] text-[#212529] font-sans overflow-hidden">
      <CommonSidebar
        algorithmTitle="Merge Sort"
        algorithmSubtitle="Block Merging Logic"
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
        complexityInfo={mergeSortInfo.complexity}
        runButtonText="Visualize"
        inputPlaceholder="10, 20, 30..."
        inputLabel="Input Data"
      />

      {/* Workspace */}
      <main className="flex-1 flex flex-col items-center justify-center p-12 bg-[#f8f9faff]">
        
        {/* Main Array Display */}
        <div className="mb-12">
            <p className="text-center text-[10px] font-black uppercase text-[#adb5bd] mb-4 tracking-[0.2em]">Target Array</p>
            <div className="flex items-center gap-3">
                {array.map((val, idx) => {
                    const isActive = idx >= activeRange[0] && idx <= activeRange[1];
                    return (
                        <ArrayBlock
                            key={idx}
                            value={val}
                            index={idx}
                            isActive={isActive}
                            inRange={isActive}
                            size="large"
                            showIndex={false}
                        />
                    );
                })}
            </div>
        </div>

        {/* The Merging Interaction Area */}
        {isRunning && (leftBuffer.length > 0 || rightBuffer.length > 0) && (
            <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                <ArrowDown className="text-[#adb5bd] mb-6 animate-bounce" />
                <div className="flex gap-16">
                    {/* Left Buffer */}
                    <div className="flex flex-col items-center">
                        <p className="text-[9px] font-black uppercase text-[#6c757d] mb-2">Left Buffer</p>
                        <div className="flex gap-2">
                            {leftBuffer.map((val, idx) => (
                                <ArrayBlock 
                                    key={idx} 
                                    value={val}
                                    index={idx}
                                    isComparing={comparing.left === idx}
                                    size="normal"
                                    showIndex={false}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Right Buffer */}
                    <div className="flex flex-col items-center">
                        <p className="text-[9px] font-black uppercase text-[#6c757d] mb-2">Right Buffer</p>
                        <div className="flex gap-2">
                            {rightBuffer.map((val, idx) => (
                                <ArrayBlock 
                                    key={idx} 
                                    value={val}
                                    index={idx}
                                    isComparing={comparing.right === idx}
                                    size="normal"
                                    showIndex={false}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* Legend */}
        <div className="absolute bottom-10 flex gap-6 px-6 py-3 bg-white border border-[#dee2e6] rounded-2xl shadow-xl items-center">
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#212529] rounded"></div>
                <span className="text-[9px] font-black uppercase text-[#6c757d]">Comparing</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-white border-2 border-[#212529] rounded"></div>
                <span className="text-[9px] font-black uppercase text-[#6c757d]">Current Sub-range</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#e9ecefff] rounded"></div>
                <span className="text-[9px] font-black uppercase text-[#6c757d]">Waiting</span>
            </div>
        </div>

      </main>
    </div>
  );
};

export default MergeSortVisualization;