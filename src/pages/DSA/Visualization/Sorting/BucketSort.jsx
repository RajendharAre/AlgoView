import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Activity, Keyboard, Lock, History, RefreshCw, RotateCcw, Play, Info } from 'lucide-react';
import CommonSidebar from '../../../../components/Visualisation/CommonSidebar';
import ArrayBlock from '../../../../components/Visualisation/ArrayBlock';
import Legend from '../../../../components/Visualisation/Legend';
import { bucketSortInfo } from '../../../../algorithms/Sorting/bucketSort';
import { COLORS, SPEEDS, BUCKET_RANGES } from '../../../../constants/visualizationConstants';

const BucketSortVisualization = () => {
  const [array, setArray] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [speedIndex, setSpeedIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  
  // Algorithm Tracking State
  const [buckets, setBuckets] = useState([[], [], [], [], []]);
  const [activeElementIdx, setActiveElementIdx] = useState(-1);
  const [phase, setPhase] = useState('IDLE'); 
  const [currentBucketIdx, setCurrentBucketIdx] = useState(-1);
  const [stats, setStats] = useState({ scattered: 0, gathered: 0 });
  const [currentStep, setCurrentStep] = useState("Add numbers (0-99) to begin");
  
  const speedRef = useRef(SPEEDS[0].value);
  const isRunningRef = useRef(false);
  
  useEffect(() => {
    speedRef.current = SPEEDS[speedIndex].value;
  }, [speedIndex]);
  
  const generateRandomArray = () => {
    if (isRunning) return;
    const count = 10;
    const newArray = Array.from({ length: count }, () => Math.floor(Math.random() * 95));
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
      .map(v => Math.min(Math.max(parseInt(v, 10), 0), 99))
      .slice(0, 15);
    setArray(parsed);
    resetStates();
  };
  
  const resetStates = () => {
    setBuckets([[], [], [], [], []]);
    setActiveElementIdx(-1);
    setCurrentBucketIdx(-1);
    setPhase('IDLE');
    setStats({ scattered: 0, gathered: 0 });
    setCurrentStep("Ready to distribute");
  };
  
  useEffect(() => {
    generateRandomArray();
  }, []);
  
  const sleep = () => new Promise(r => setTimeout(r, speedRef.current));
  
  const bucketSort = async () => {
    if (isRunning || array.length < 1) return;
    setIsRunning(true);
    isRunningRef.current = true;
    
    let localBuckets = [[], [], [], [], []];
    let localStats = { scattered: 0, gathered: 0 };
    let sourceArray = [...array];
    
    // Phase 1: Scatter
    setPhase('SCATTER');
    for (let i = 0; i < sourceArray.length; i++) {
      if (!isRunningRef.current) return;
      
      const val = sourceArray[i];
      const bIdx = Math.floor(val / 20);
      
      setActiveElementIdx(i);
      setCurrentStep(`Scattering ${val}: Fits in range ${BUCKET_RANGES[bIdx].label}`);
      await sleep();
      
      localBuckets[bIdx].push(val);
      localStats.scattered++;
      setBuckets([...localBuckets.map(b => [...b])]);
      setStats({ ...localStats });
      
      sourceArray[i] = null;
      setArray([...sourceArray]);
      await sleep();
    }
    setActiveElementIdx(-1);
    
    // Phase 2: Sort Buckets
    setPhase('SORT');
    for (let i = 0; i < localBuckets.length; i++) {
      if (!isRunningRef.current) return;
      if (localBuckets[i].length === 0) continue;
      
      setCurrentBucketIdx(i);
      setCurrentStep(`Sorting Bucket ${BUCKET_RANGES[i].label}`);
      await sleep();
      
      localBuckets[i].sort((a, b) => a - b);
      setBuckets([...localBuckets.map(b => [...b])]);
      await sleep();
    }
    setCurrentBucketIdx(-1);
    
    // Phase 3: Gather
    setPhase('GATHER');
    let k = 0;
    let resultArray = new Array(localStats.scattered).fill(null);
    for (let i = 0; i < localBuckets.length; i++) {
      setCurrentBucketIdx(i);
      for (let j = 0; j < localBuckets[i].length; j++) {
        if (!isRunningRef.current) return;
        
        const val = localBuckets[i][j];
        setCurrentStep(`Gathering ${val} from ${BUCKET_RANGES[i].label}`);
        
        resultArray[k] = val;
        localStats.gathered++;
        
        let tempBuckets = localBuckets.map(b => [...b]);
        tempBuckets[i][j] = "✓"; 
        setBuckets(tempBuckets);
        
        setArray([...resultArray]);
        setStats({ ...localStats });
        k++;
        await sleep();
      }
    }
    
    setPhase('IDLE');
    setCurrentBucketIdx(-1);
    setInputValue(resultArray.join(', '));
    setCurrentStep("Bucket Sort Complete");
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
      {/* Sidebar */}
      <CommonSidebar
        algorithmTitle="Bucket Sort"
        algorithmSubtitle="Distribution Logic"
        inputValue={inputValue}
        onInputChange={handleInputChange}
        isRunning={isRunning}
        onRunAlgorithm={bucketSort}
        onGenerateRandom={generateRandomArray}
        onReset={resetAll}
        speedIndex={speedIndex}
        onSpeedChange={setSpeedIndex}
        currentStep={currentStep}
        stats={stats}
        complexityInfo={bucketSortInfo.complexity}
        runButtonText="Run"
        inputPlaceholder="0, 45, 12, 88, 23..."
        inputLabel="Array Input"
      />
      
      {/* Main Workspace */}
      <main className="flex-1 flex flex-col bg-[#f8f9faff] relative overflow-hidden">
        
        {/* Source Array Area */}
        <div className="p-8 border-b border-[#dee2e6] bg-white">
            <p className="text-center text-[9px] font-black uppercase text-[#adb5bd] mb-4 tracking-[0.2em]">Source / Final Array</p>
            <div className="flex justify-center gap-2 flex-wrap">
                {array.map((val, idx) => {
                    const isActive = activeElementIdx === idx;
                    const isPlaceholder = val === null;
                    
                    return (
                        <ArrayBlock
                            key={idx}
                            value={val}
                            index={idx}
                            isActive={isActive}
                            inRange={!isPlaceholder}
                            size="normal"
                            showIndex={false}
                        />
                    );
                })}
            </div>
        </div>
        
        {/* The Buckets Area */}
        <div className="flex-1 p-8 flex flex-col items-center">
            <p className="text-center text-[9px] font-black uppercase text-[#adb5bd] mb-6 tracking-[0.2em]">Buckets Partition</p>
            
            <div className="flex gap-4 w-full max-w-5xl justify-center h-full max-h-64">
                {buckets.map((bucket, bIdx) => {
                    const isActive = currentBucketIdx === bIdx;
                    return (
                        <div 
                            key={bIdx}
                            className={`flex-1 flex flex-col transition-all duration-300
                                ${isActive ? 'scale-105' : ''}
                            `}
                        >
                            <div className={`flex-1 bg-white rounded-t-2xl border-2 border-b-0 p-3 flex flex-col gap-2 overflow-y-auto
                                ${isActive ? 'border-[#212529] shadow-inner' : 'border-[#e9ecefff]'}
                            `}>
                                {bucket.map((val, vIdx) => (
                                    <div 
                                        key={vIdx} 
                                        className={`p-2 rounded-lg text-center text-[11px] font-bold shadow-sm transition-all
                                            ${val === "✓" ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-[#f1f3f5] border border-[#dee2e6]'}
                                        `}
                                    >
                                        {val}
                                    </div>
                                ))}
                            </div>
                            <div className={`py-2 text-center text-[10px] font-black uppercase rounded-b-xl border-2 border-t-0
                                ${isActive ? 'bg-[#212529] text-white border-[#212529]' : 'bg-[#e9ecefff] text-[#adb5bd] border-[#e9ecefff]'}
                            `}>
                                {BUCKET_RANGES[bIdx].label}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
        
        {/* Legend Overlay */}
        <Legend 
          items={[
            { color: COLORS.carbonBlack, label: "Active Element" },
            { color: COLORS.platinum, label: "Distributed" },
            { color: COLORS.brightSnow, label: "Unsorted" }
          ]}
          description="Scatter Phase → Sort Phase → Gather Phase"
        />
      </main>
    </div>
  );
};

export default BucketSortVisualization;