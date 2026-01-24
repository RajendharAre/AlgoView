import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Activity, Keyboard, Lock, History, RefreshCw, RotateCcw, Play, Info, Target, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import CommonSidebar from '../../../../components/Visualisation/CommonSidebar';
import ArrayBlock from '../../../../components/Visualisation/ArrayBlock';
import Legend from '../../../../components/Visualisation/Legend';
import { linearSearchInfo } from '../../../../algorithms/Searching/linearSearch';
import { COLORS, SPEEDS } from '../../../../constants/visualizationConstants';

const LinearSearchVisualization = () => {
  const [array, setArray] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [targetValue, setTargetValue] = useState("");
  const [speedIndex, setSpeedIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  
  // Algorithm Tracking State
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [foundIndex, setFoundIndex] = useState(-1);
  const [comparisons, setComparisons] = useState(0);
  const [currentStep, setCurrentStep] = useState("Enter an array and target");
  const [searchFailed, setSearchFailed] = useState(false);

  const speedRef = useRef(SPEEDS[0].value);
  const isRunningRef = useRef(false);

  useEffect(() => {
    speedRef.current = SPEEDS[speedIndex].value;
  }, [speedIndex]);

  const generateRandomArray = () => {
    if (isRunning) return;
    const count = 10;
    const newArray = Array.from({ length: count }, () => Math.floor(Math.random() * 90) + 10);
    const randomTarget = newArray[Math.floor(Math.random() * newArray.length)];
    
    setArray(newArray);
    setInputValue(newArray.join(', '));
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
    setArray(parsed);
    resetStates();
  };

  const handleTargetChange = (e) => {
    setTargetValue(e.target.value.replace(/[^0-9]/g, ''));
  };

  const resetStates = () => {
    setCurrentIndex(-1);
    setFoundIndex(-1);
    setComparisons(0);
    setSearchFailed(false);
    setCurrentStep("Ready to search");
  };

  useEffect(() => {
    generateRandomArray();
  }, []);

  const sleep = () => new Promise(r => setTimeout(r, speedRef.current));

  const linearSearch = async () => {
    if (isRunning || array.length === 0 || targetValue === "") return;
    
    setIsRunning(true);
    isRunningRef.current = true;
    resetStates();
    
    const target = parseInt(targetValue, 10);
    let localComparisons = 0;

    for (let i = 0; i < array.length; i++) {
      if (!isRunningRef.current) return;

      setCurrentIndex(i);
      localComparisons++;
      setComparisons(localComparisons);
      setCurrentStep(`Checking index ${i}: Is ${array[i]} equal to ${target}?`);
      await sleep();

      if (array[i] === target) {
        setFoundIndex(i);
        setCurrentIndex(-1); // Stop highlighting scanning
        setCurrentStep(`Match Found! Target ${target} is at index ${i}.`);
        setIsRunning(false);
        isRunningRef.current = false;
        return;
      }
    }

    // Logic for "Not Found"
    setCurrentIndex(-1); 
    setSearchFailed(true);
    setCurrentStep(`Target ${target} was not found in the array.`);
    setIsRunning(false);
    isRunningRef.current = false;
  };

  const resetAll = () => {
    isRunningRef.current = false;
    setIsRunning(false);
    generateRandomArray();
  };

  // Determine status card colors
  const stats = { comparisons };

  return (
    <div className="flex h-screen bg-[#f8f9faff] text-[#212529] font-sans overflow-hidden">
      {/* Sidebar */}
      <CommonSidebar
        algorithmTitle="Linear Search"
        algorithmSubtitle="Sequential Scan"
        inputValue={inputValue}
        onInputChange={handleInputChange}
        isRunning={isRunning}
        onRunAlgorithm={linearSearch}
        onGenerateRandom={generateRandomArray}
        onReset={resetAll}
        speedIndex={speedIndex}
        onSpeedChange={setSpeedIndex}
        currentStep={currentStep}
        stats={stats}
        complexityInfo={linearSearchInfo.complexity}
        runButtonText="Start Search"
        inputPlaceholder="10, 20, 30..."
        targetValue={targetValue}
        onTargetChange={handleTargetChange}
      />

      
      {/* Main Workspace */}
      <main className="flex-1 flex flex-col bg-[#f8f9faff] relative overflow-hidden">
        
        {/* Target Indicator */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 text-center">
             <p className="text-[10px] font-black uppercase text-[#adb5bd] mb-2 tracking-[0.2em]">Searching For</p>
             <div className="w-16 h-16 rounded-2xl bg-[#212529] text-white flex items-center justify-center text-xl font-black shadow-2xl border-4 border-white">
                {targetValue || '?'}
             </div>
        </div>

        {/* Elements Grid */}
        <div className="flex-1 flex items-center justify-center px-12">
            <div className="flex flex-wrap justify-center gap-4 max-w-4xl">
                {array.map((val, idx) => {
                    const isScanning = currentIndex === idx;
                    const isMatched = foundIndex === idx;
                    const isPast = (isRunning && currentIndex > idx) || (searchFailed && foundIndex === -1);

                    return (
                        <div key={idx} className="flex flex-col items-center gap-2">
                            <ArrayBlock
                                value={val}
                                index={idx}
                                isComparing={isScanning}
                                isSorted={isMatched}
                                isActive={isPast}
                                size="large"
                                showIndex={true}
                            />
                            <div className="h-4 flex items-center justify-center">
                                {isScanning && <ArrowRight size={12} className="text-[#212529] rotate-90" />}
                                {isMatched && <Target size={12} className="text-[#212529]" />}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>

        {/* Legend Overlay */}
        <Legend 
          items={[
            { color: COLORS.carbonBlack, label: "Found Match" },
            { color: COLORS.slateGrey, label: "Scanning" },
            { color: COLORS.platinum, label: "Passed / Unvisited" }
          ]}
          description="Linear Search: Checking each element sequentially until a match is found"
        />
      </main>
    </div>
  );
};

export default LinearSearchVisualization;