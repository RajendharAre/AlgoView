import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  RotateCcw, 
  BarChart3, 
  Activity, 
  RefreshCw,
  Lock,
  ArrowLeft,
  History
} from 'lucide-react';
import ArrayVisualizer from './ArrayVisualizer';

/**
 * Sorting Algorithm Visualization Component
 * Provides a complete visualization interface for sorting algorithms
 * 
 * @param {Object} props - Component props
 * @param {Function} props.algorithmGenerator - Generator function for the sorting algorithm
 * @param {string} props.algorithmName - Name of the algorithm for display
 * @param {Object} props.initialArray - Initial array to sort (optional)
 * @param {Object} props.customColors - Custom color palette (optional)
 * @param {boolean} props.allowUserInput - Whether to allow user input (default: true)
 * @param {Function} props.onComplete - Callback when sorting completes
 * @param {Object} props.complexityInfo - Complexity information to display
 */
const SortingVisualization = ({
  algorithmGenerator,
  algorithmName,
  initialArray = null,
  customColors = null,
  allowUserInput = true,
  onComplete = null,
  complexityInfo = null
}) => {
  const [array, setArray] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [speedIndex, setSpeedIndex] = useState(2); // Default to 1.75x speed
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  
  // Algorithm Tracking State
  const [comparing, setComparing] = useState([]); 
  const [sortedIndices, setSortedIndices] = useState([]);
  const [swapping, setSwapping] = useState([]);
  const [stats, setStats] = useState({ comparisons: 0, swaps: 0 });
  const [currentStep, setCurrentStep] = useState(`${algorithmName} ready`);
  const [iteration, setIteration] = useState(0);

  const speedRef = useRef(457); // 1.75x default
  const isRunningRef = useRef(false);
  const algorithmIteratorRef = useRef(null);

  // Speed options matching the original component
  const SPEEDS = [
    { label: '1x', value: 800 },
    { label: '1.5x', value: 533 },
    { label: '1.75x', value: 457 },
    { label: '2x', value: 400 },
    { label: '2.5x', value: 320 },
    { label: '3x', value: 266 },
  ];

  useEffect(() => {
    speedRef.current = SPEEDS[speedIndex].value;
  }, [speedIndex]);

  // Handle manual text input
  const handleInputChange = (e) => {
    if (isRunning) return;
    
    const val = e.target.value;
    setInputValue(val);
    
    // Parse the string: filter out non-numbers and map to integers
    const parsedArray = val.split(',')
      .map(item => item.trim())
      .filter(item => item !== "" && !isNaN(item))
      .map(item => Math.min(Math.max(parseInt(item, 10), 5), 100)); // Clamp between 5 and 100
    
    setArray(parsedArray);
    resetVisualization();
  };

  // Generate random data
  const generateRandomArray = () => {
    if (isRunning) return;
    const count = 12;
    const newArray = Array.from({ length: count }, () => Math.floor(Math.random() * 80) + 10);
    setArray(newArray);
    setInputValue(newArray.join(', '));
    resetVisualization();
  };

  // Reset visualization state
  const resetVisualization = () => {
    setIsRunning(false);
    setIsCompleted(false);
    isRunningRef.current = false;
    setSortedIndices([]);
    setComparing([]);
    setSwapping([]);
    setStats({ comparisons: 0, swaps: 0 });
    setCurrentStep(`${algorithmName} ready`);
    setIteration(0);
    if (algorithmIteratorRef.current) {
      algorithmIteratorRef.current = null;
    }
  };

  // Reset everything
  const reset = () => {
    resetVisualization();
    if (initialArray) {
      setArray([...initialArray]);
      setInputValue(initialArray.join(', '));
    } else {
      generateRandomArray();
    }
  };

  useEffect(() => {
    // Initialize with either provided array or generate random
    if (initialArray) {
      setArray([...initialArray]);
      setInputValue(initialArray.join(', '));
    } else {
      generateRandomArray();
    }
  }, [initialArray]);

  const sleep = () => new Promise(r => setTimeout(r, speedRef.current));

  // Normalize step data from different algorithm types to a consistent format
  const normalizeStepData = (step, arrayLength) => {
    const normalized = { ...step };
    
    // Handle different algorithm formats
    if (step.keyIndex !== undefined) {
      // Insertion Sort format
      normalized.compared = [];
      if (step.comparingIndex !== null && step.comparingIndex !== undefined) {
        normalized.compared.push(step.comparingIndex);
      }
      if (step.keyIndex !== null && step.keyIndex !== undefined) {
        normalized.compared.push(step.keyIndex);
      }
      
      normalized.swapping = [];
      if (step.shiftingIndex !== null && step.shiftingIndex !== undefined) {
        normalized.swapping.push(step.shiftingIndex);
      }
      if (step.placedIndex !== null && step.placedIndex !== undefined) {
        normalized.swapping.push(step.placedIndex);
      }
      
      // Set sorted indices based on doneIndices
      if (Array.isArray(step.doneIndices)) {
        normalized.doneIndex = step.doneIndices.length;
      }
    } else if (step.range !== undefined) {
      // Merge Sort format
      normalized.compared = [];
      if (step.comparing && Array.isArray(step.comparing) && step.comparing.length >= 3) {
        // Extract indices from comparing array
        const [, leftIdx, rightIdx] = step.comparing;
        // Calculate actual indices based on range
        if (typeof leftIdx === 'number') normalized.compared.push(leftIdx);
        if (typeof rightIdx === 'number') normalized.compared.push(rightIdx);
      }
      
      normalized.swapping = [];
      if (step.mergedIndex !== null && step.mergedIndex !== undefined) {
        normalized.swapping.push(step.mergedIndex);
      }
      
      // For merge sort, sorted segments are determined by completed ranges
      normalized.doneIndex = step.range[1] + 1; // Simplified for visualization
    } else if (step.pivotIndex !== undefined || step.partitioning !== undefined) {
      // Quick Sort format (if it has pivot/partitioning properties)
      normalized.compared = [];
      if (step.comparingIndex !== undefined) {
        normalized.compared.push(step.comparingIndex);
      }
      if (step.pivotIndex !== undefined) {
        normalized.compared.push(step.pivotIndex);
      }
      
      normalized.swapping = [];
      if (step.swappingIndices !== undefined && Array.isArray(step.swappingIndices)) {
        normalized.swapping = [...step.swappingIndices];
      }
    } else {
      // Default format for bubble sort, selection sort, etc.
      normalized.compared = Array.isArray(step.compared) ? [...step.compared] : [];
      normalized.swapping = Array.isArray(step.swapping) ? [...step.swapping] : [];
      
      // Handle swapped property for backward compatibility
      if (Array.isArray(step.swapped)) {
        normalized.swapping = [...step.swapped];
      } else if (step.swapped === true && Array.isArray(step.compared)) {
        normalized.swapping = [...step.compared];
      }
    }
    
    // Ensure doneIndex is properly set
    if (step.doneIndex === undefined && step.doneIndices !== undefined && Array.isArray(step.doneIndices)) {
      normalized.doneIndex = step.doneIndices.length;
    }
    
    return normalized;
  };

  // Execute the sorting algorithm step by step
  const executeSort = async () => {
    if (isRunning || array.length < 2) return;
    
    setIsRunning(true);
    isRunningRef.current = true;
    setIsCompleted(false);
    
    // Create new iterator for the algorithm
    algorithmIteratorRef.current = algorithmGenerator(array);
    let localStats = { comparisons: 0, swaps: 0 };
    let stepCount = 0;

    try {
      while (true) {
        if (!isRunningRef.current) break;
        
        const result = algorithmIteratorRef.current.next();
        
        if (result.done) {
          // Algorithm completed
          break;
        }

        const step = result.value;
        stepCount++;
        
        // Normalize step data for different algorithm types
        const normalizedStep = normalizeStepData(step, array.length);
        
        // Update visualization state based on normalized step data
        if (Array.isArray(normalizedStep.compared)) {
          setComparing(normalizedStep.compared);
          localStats.comparisons += normalizedStep.compared.length > 1 ? 1 : 0; // Count comparison if comparing two elements
        }
        
        if (Array.isArray(normalizedStep.swapping)) {
          setSwapping(normalizedStep.swapping);
          if (normalizedStep.swapping.length > 0) {
            localStats.swaps++;
          }
        } else if (Array.isArray(normalizedStep.swapped)) {
          // For algorithms that yield swapped as array of indices
          setSwapping(normalizedStep.swapped);
          if (normalizedStep.swapped.length > 0) {
            localStats.swaps++;
          }
        } else if (normalizedStep.swapped === true && Array.isArray(normalizedStep.compared)) {
          // For algorithms that yield swapped: true
          setSwapping(normalizedStep.compared);
          localStats.swaps++;
        }
        
        if (step.doneIndex !== undefined) {
          // Mark elements as sorted
          const newSorted = [];
          for (let i = 0; i < step.doneIndex; i++) {
            newSorted.push(i);
          }
          setSortedIndices(newSorted);
        }
        
        // Update array if provided in step
        if (step.array) {
          setArray([...step.array]);
          setInputValue(step.array.join(', '));
        }
        
        setStats({ ...localStats });
        setCurrentStep(step.description || `Step ${stepCount}`);
        setIteration(stepCount);
        
        await sleep();
        
        // Clear temporary states
        setComparing([]);
        setSwapping([]);
      }
      
      // Mark all elements as sorted when complete
      const allSorted = Array.from({ length: array.length }, (_, i) => i);
      setSortedIndices(allSorted);
      setCurrentStep(`${algorithmName} completed!`);
      setIsCompleted(true);
      
      if (onComplete) {
        onComplete({
          iterations: stepCount,
          comparisons: localStats.comparisons,
          swaps: localStats.swaps,
          finalArray: array
        });
      }
      
    } catch (error) {
      console.error('Error during sorting:', error);
      setCurrentStep('Error occurred during sorting');
    } finally {
      setIsRunning(false);
      isRunningRef.current = false;
      algorithmIteratorRef.current = null;
    }
  };

  // Stop the current execution
  const stopExecution = () => {
    isRunningRef.current = false;
    setIsRunning(false);
    setCurrentStep('Execution stopped');
  };

  return (
    <div className="flex h-full bg-gray-50 text-gray-900 font-sans overflow-hidden">
      {/* Sidebar Command Center */}
      <aside className="w-80 bg-white border-r border-gray-200 flex flex-col shrink-0 shadow-lg z-20 overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-1">
            <button 
              onClick={() => window.history.back()} 
              className="w-8 h-8 bg-gray-900 rounded flex items-center justify-center text-white hover:bg-gray-800 transition-colors"
              aria-label="Go back to algorithms"
            >
              <ArrowLeft size={18} />
            </button>
            <h1 className="text-base font-bold tracking-tight">{algorithmName}</h1>
          </div>
          <p className="text-xs text-gray-500 uppercase tracking-widest font-black ml-11">
            Interactive Visualization
          </p>
        </div>

        {/* Speed Controls */}
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Activity size={12} /> Execution Speed
          </h3>
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-gray-50 rounded-xl border border-gray-200">
            {SPEEDS.map((s, idx) => (
              <button
                key={s.label}
                onClick={() => setSpeedIndex(idx)}
                className={`px-2 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  speedIndex === idx 
                    ? 'bg-gray-900 text-white shadow-md' 
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* User Input Section */}
        {allowUserInput && (
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2">Array Input</span>
              {isRunning && (
                <span className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                  <Lock size={8}/> Locked
                </span>
              )}
            </h3>
            <textarea 
              value={inputValue}
              onChange={handleInputChange}
              disabled={isRunning}
              placeholder="e.g. 10, 45, 22, 8, 30"
              className={`w-full h-24 p-4 text-xs font-mono rounded-xl border transition-all resize-none outline-none focus:ring-2 ${
                isRunning 
                  ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed' 
                  : 'bg-white border-gray-300 text-gray-900 focus:ring-gray-900 focus:border-transparent shadow-sm hover:border-gray-400'
              }`}
            />
            <p className="mt-2 text-xs text-gray-400 leading-tight">
              * Separate values by commas. Bars update automatically.
            </p>
          </div>
        )}

        {/* Action Controls */}
        <div className="p-6 border-b border-gray-100">
          <div className="space-y-2">
            <button 
              onClick={executeSort}
              disabled={isRunning || array.length < 2 || isCompleted}
              className="w-full py-3 bg-gray-900 text-white rounded-xl flex items-center justify-center gap-2 font-bold text-xs disabled:opacity-30 transition-all hover:bg-gray-800"
            >
              <Play size={14} fill="white" /> 
              {isRunning ? 'Running...' : isCompleted ? 'Completed' : 'Start Sorting'}
            </button>
            <div className="flex gap-2">
              <button 
                onClick={generateRandomArray} 
                disabled={isRunning}
                className="flex-1 py-2 bg-white border border-gray-200 text-gray-500 rounded-xl flex items-center justify-center gap-2 font-bold text-xs hover:bg-gray-50 transition-all disabled:opacity-30"
              >
                <RefreshCw size={14} /> Random
              </button>
              <button 
                onClick={reset} 
                className="flex-1 py-2 bg-white border border-gray-200 text-gray-500 rounded-xl flex items-center justify-center gap-2 font-bold text-xs hover:bg-gray-50 transition-all"
              >
                <RotateCcw size={14} /> Reset
              </button>
            </div>
          </div>
        </div>

        {/* Status & Stats */}
        <div className="flex-1 p-6 space-y-6">
          <div className={`p-4 rounded-xl border-l-4 transition-all ${
            isRunning 
              ? 'bg-gray-900 text-white border-white shadow-md' 
              : isCompleted 
                ? 'bg-green-50 border-green-500' 
                : 'bg-gray-50 border-gray-200'
          }`}>
            <p className="text-xs font-black uppercase opacity-60 tracking-widest mb-1">
              {isRunning ? 'Live Status' : isCompleted ? 'Completed' : 'Ready'}
            </p>
            <p className="text-xs font-bold truncate">{currentStep}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-white border border-gray-200 rounded-xl">
              <p className="text-xs font-black text-gray-400 uppercase mb-1">Comparisons</p>
              <p className="text-xl font-mono font-bold">{stats.comparisons}</p>
            </div>
            <div className="p-3 bg-white border border-gray-200 rounded-xl">
              <p className="text-xs font-black text-gray-400 uppercase mb-1">Swaps</p>
              <p className="text-xl font-mono font-bold">{stats.swaps}</p>
            </div>
          </div>

          {isCompleted && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-xs font-black text-blue-600 uppercase mb-1">Iterations</p>
              <p className="text-lg font-mono font-bold text-blue-800">{iteration}</p>
            </div>
          )}

          {/* Complexity Information */}
          {complexityInfo && (
            <div className="mt-auto pt-4 border-t border-gray-100">
              <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <History size={12} /> Complexity
              </h4>
              <div className="space-y-1 text-xs font-bold text-gray-500">
                {complexityInfo.time && (
                  <>
                    {complexityInfo.time.worst && (
                      <div className="flex justify-between">
                        <span>Worst:</span> 
                        <span className="font-mono">{complexityInfo.time.worst}</span>
                      </div>
                    )}
                    {complexityInfo.time.average && (
                      <div className="flex justify-between">
                        <span>Avg:</span> 
                        <span className="font-mono">{complexityInfo.time.average}</span>
                      </div>
                    )}
                    {complexityInfo.time.best && (
                      <div className="flex justify-between">
                        <span>Best:</span> 
                        <span className="font-mono">{complexityInfo.time.best}</span>
                      </div>
                    )}
                  </>
                )}
                {complexityInfo.space && (
                  <div className="flex justify-between">
                    <span>Space:</span> 
                    <span className="font-mono">{complexityInfo.space}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Visualization Area */}
      <main className="flex-1 relative bg-gray-50 flex flex-col items-center justify-center p-8">
        <ArrayVisualizer
          array={array}
          comparing={comparing}
          sorted={sortedIndices}
          swapping={swapping}
          colors={customColors}
          maxHeight={320}
          className="mb-8"
        />

        {/* Legend */}
        <div className="absolute bottom-6 flex items-center gap-6 p-4 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-xl">
          <LegendItem color="#ced4da" label="Unsorted" />
          <LegendItem color="#495057" label="Comparing" />
          <LegendItem color="#212529" label="Swapping" />
          <LegendItem color="#6c757d" label="Sorted" />
          <div className="h-4 w-px bg-gray-200 mx-2"></div>
          <div className="flex items-center gap-2">
            <BarChart3 size={14} className="text-gray-400" />
            <span className="text-xs font-black text-gray-400 uppercase">
              Elements: {array.length}
            </span>
          </div>
        </div>
      </main>
    </div>
  );
};

// Legend Item Component
const LegendItem = ({ color, label }) => (
  <div className="flex items-center gap-2">
    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
    <span className="text-xs font-black uppercase tracking-widest text-gray-500">
      {label}
    </span>
  </div>
);

export default SortingVisualization;