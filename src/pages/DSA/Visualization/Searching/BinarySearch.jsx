import React, { useState, useEffect, useRef } from 'react';
import { Search, Play, RotateCcw, Activity, Info, RefreshCw, Keyboard, Lock, Target, ArrowDown, History, AlertCircle, CheckCircle, Split } from 'lucide-react';
import CommonSidebar from '../../../../components/Visualisation/CommonSidebar';
import ArrayBlock from '../../../../components/Visualisation/ArrayBlock';
import Legend from '../../../../components/Visualisation/Legend';
import { binarySearchInfo } from '../../../../algorithms/Searching/binarySearch';
import { COLORS, SPEEDS } from '../../../../constants/visualizationConstants';

const BinarySearchVisualization = () => {
  const [array, setArray] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [targetValue, setTargetValue] = useState("");
  const [speedIndex, setSpeedIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // Algorithm Tracking State
  const [low, setLow] = useState(-1);
  const [high, setHigh] = useState(-1);
  const [mid, setMid] = useState(-1);
  const [foundIndex, setFoundIndex] = useState(-1);
  const [comparisons, setComparisons] = useState(0);
  const [currentStep, setCurrentStep] = useState("Array is auto-sorted for Binary Search");
  const [searchFailed, setSearchFailed] = useState(false);

  const speedRef = useRef(SPEEDS[0].value);
  const isRunningRef = useRef(false);

  useEffect(() => {
    speedRef.current = SPEEDS[speedIndex].value;
  }, [speedIndex]);

  const generateRandomArray = () => {
    if (isRunning) return;
    const count = 12; 
    const newArray = Array.from({ length: count }, () => Math.floor(Math.random() * 90) + 10);
    const sorted = newArray.sort((a, b) => a - b);
    const randomTarget = sorted[Math.floor(Math.random() * sorted.length)];
    
    setArray(sorted);
    setInputValue(sorted.join(', '));
    setTargetValue(randomTarget.toString());
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
    
    const sorted = [...parsed].sort((a, b) => a - b);
    setArray(sorted);
    resetStates();
  };

  const resetStates = () => {
    setLow(-1);
    setHigh(-1);
    setMid(-1);
    setFoundIndex(-1);
    setComparisons(0);
    setSearchFailed(false);
    setCurrentStep("Ready to search");
  };

  useEffect(() => {
    generateRandomArray();
  }, []);

  const sleep = () => new Promise(r => setTimeout(r, speedRef.current));



  const runAlgorithm = async () => {
    if (isRunning || array.length === 0 || targetValue === "") return;
    
    setIsRunning(true);
    isRunningRef.current = true;
    resetStates();

    const target = parseInt(targetValue, 10);
    const gen = binarySearchInfo.generator(array, target);

    for (const state of gen) {
      if (!isRunningRef.current) return;

      setLow(state.low);
      setHigh(state.high);
      setMid(state.mid);
      setFoundIndex(state.foundIndex);
      setComparisons(state.comparisons);
      setCurrentStep(state.currentStep);
      setSearchFailed(state.searchFailed);

      await sleep();
    }

    setIsRunning(false);
    isRunningRef.current = false;
  };

  const resetAll = () => {
    isRunningRef.current = false;
    setIsRunning(false);
    generateRandomArray();
  };

  const legendItems = [
    { color: COLORS.carbonBlack, label: "Match Found" },
    { color: COLORS.slateGrey, label: "Current Mid" },
    { color: COLORS.platinum, label: "Search Space" }
  ];

  return (
    <div className="flex h-screen bg-[#f8f9faff] text-[#212529] font-sans overflow-hidden">
      <CommonSidebar
        algorithmTitle="Binary Search"
        algorithmSubtitle="Logarithmic Visualization"
        inputValue={inputValue}
        onInputChange={handleInputChange}
        isRunning={isRunning}
        onRunAlgorithm={runAlgorithm}
        onGenerateRandom={generateRandomArray}
        onReset={resetAll}
        targetValue={targetValue}
        onTargetChange={(e) => setTargetValue(e.target.value.replace(/[^0-9]/g, ''))}
        speedIndex={speedIndex}
        onSpeedChange={setSpeedIndex}
        disabled={isRunning}
        currentStep={currentStep}
        stats={{ comparisons: comparisons }}
        complexityInfo={binarySearchInfo.complexity}
      />


      {/* Main Workspace */}
      <main className="flex-1 flex flex-col bg-[#f8f9faff] relative overflow-hidden">
        
        {/* Target Overlay */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 text-center z-10">
             <p className="text-[10px] font-black uppercase text-[#adb5bd] mb-2 tracking-[0.2em]">Searching For</p>
             <div className="w-16 h-16 rounded-2xl bg-[#212529] text-white flex items-center justify-center text-xl font-black shadow-2xl border-4 border-white">
                {targetValue || '?'}
             </div>
        </div>

        {/* Elements Grid - Standardized flex flow for zero row collision */}
        <div className="flex-1 flex items-center justify-center px-12 overflow-y-auto py-32">
            <div className="flex flex-wrap justify-center items-start gap-x-4 gap-y-8 max-w-5xl transition-all duration-500">
                {array.map((val, idx) => {
                    const isMid = mid === idx;
                    const isLow = low === idx;
                    const isHigh = high === idx;
                    const isMatched = foundIndex === idx;
                    
                    const isExcluded = (low !== -1 && high !== -1) && (idx < low || idx > high);
                    const shouldFade = isExcluded && !isMatched;

                    return (
                        <div key={idx} className="flex flex-col items-center min-w-[64px] transition-all duration-500">
                            {/* Top Slot: Mid Pointer */}
                            <div className="h-10 flex flex-col items-center justify-end mb-2 w-full">
                                {isMid && (
                                    <div className="flex flex-col items-center animate-bounce">
                                        <ArrowDown size={12} className="text-[#212529]" />
                                        <span className="text-[7px] font-black bg-[#212529] text-white px-1.5 py-0.5 rounded leading-none uppercase tracking-tighter">Mid</span>
                                    </div>
                                )}
                            </div>

                            {/* Center Slot: Element Block */}
                            <ArrayBlock
                                value={val}
                                isActive={isMatched}
                                isCompared={isMid}
                                isExcluded={shouldFade}
                                excludedOpacity="opacity-20"
                                excludedScale="scale-90"
                                excludedColor="bg-[#e9ecefff]"
                                excludedTextColor="text-[#adb5bd]"
                                excludedBorderColor="border-transparent"
                                activeColor="bg-[#212529]"
                                activeTextColor="text-white"
                                activeBorderColor="border-[#212529]"
                                activeScale="scale-125"
                                comparedColor="bg-[#6c757d]"
                                comparedTextColor="text-white"
                                comparedBorderColor="border-[#6c757d]"
                                comparedScale="scale-110"
                                normalColor="bg-white"
                                normalTextColor="text-[#212529]"
                                normalBorderColor="border-[#e9ecefff]"
                            />

                            {/* Bottom Slot: Range Pointers and Index */}
                            <div className="h-14 flex flex-col items-center mt-1 w-full">
                                {!isMatched && (isLow || isHigh) && (
                                    <div className={`flex flex-col items-center transition-opacity duration-300 ${shouldFade ? 'opacity-20' : 'opacity-100'}`}>
                                        <ArrowDown size={10} className="text-[#adb5bd] rotate-180" />
                                        <span className="text-[7px] font-black border border-[#ced4da] px-1 py-0.5 rounded text-[#6c757d] bg-white whitespace-nowrap shadow-xs uppercase">
                                            {isLow && isHigh ? 'L+H' : isLow ? 'LOW' : 'HIGH'}
                                        </span>
                                    </div>
                                )}
                                <span className={`text-[8px] font-bold text-[#adb5bd] uppercase tracking-tighter mt-1 ${shouldFade ? 'opacity-10' : 'opacity-100'}`}>idx {idx}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>

        {/* Legend Overlay */}
        <Legend 
          items={legendItems} 
          description="Binary Search: Splits range in half each step to achieve O(log n) performance." 
        />
      </main>
    </div>
  );
};

export default BinarySearchVisualization;