import React, { useState, useEffect } from 'react';
import { 
  Play, 
  RotateCcw, 
  Plus, 
  Link as LinkIcon, 
  Trash2, 
  Activity, 
  Info, 
  MousePointer2, 
  Lock
} from 'lucide-react';
import CommonSidebar from '../../../../components/Visualisation/CommonSidebar';
import { floydWarshall, floydWarshallInfo } from '../../../../algorithms/Graph/floydWarshall';
import { COLORS } from '../../../../constants/visualizationConstants';
import ToolButton from './components/ToolButton';
import LegendItem from './components/LegendItem';
import GraphCanvas from './components/GraphCanvas';
import { useGraphManagement } from './hooks/useGraphManagement';

const FloydWarshallVisualization = () => {
  // Initial graph data
  const INITIAL_NODES = [
    { id: 0, x: 150, y: 100, label: '0' },
    { id: 1, x: 450, y: 100, label: '1' },
    { id: 2, x: 150, y: 350, label: '2' },
    { id: 3, x: 450, y: 350, label: '3' },
  ];
  
  const INITIAL_EDGES = [
    { u: 0, v: 1, weight: 3 },
    { u: 0, v: 2, weight: 8 },
    { u: 1, v: 2, weight: 2 },
    { u: 2, v: 3, weight: 1 },
    { u: 1, v: 3, weight: 5 },
  ];

  // Algorithm state reset function
  const resetAlgoState = () => {
    setCurrentK(-1);
    setCurrentI(-1);
    setCurrentJ(-1);
    setMatrix([]);
    setCurrentStep("Ready to initialize distance matrix.");
  };

  // Algorithm-specific state
  const [matrix, setMatrix] = useState([]);
  const [currentK, setCurrentK] = useState(-1);
  const [currentI, setCurrentI] = useState(-1);
  const [currentJ, setCurrentJ] = useState(-1);
  const [currentStep, setCurrentStep] = useState("Floyd-Warshall finds all-pairs shortest paths.");

  // Use reusable graph management hook
  const {
    nodes,
    edges,
    mode,
    isRunning,
    speedIndex,
    linkSource,
    svgRef,
    isRunningRef,
    setMode,
    setIsRunning,
    setSpeedIndex,
    setLinkSource,
    handleCanvasClick,
    handleNodeClick,
    resetGraph,
    clearGraph,
    sleep
  } = useGraphManagement(INITIAL_NODES, INITIAL_EDGES, resetAlgoState);

  // Floyd-Warshall algorithm doesn't need special node click handling
  // The base handleNodeClick from the hook handles DELETE and LINK modes

  // --- Floyd-Warshall Algorithm ---
  const runAlgorithm = async () => {
    if (isRunning || nodes.length === 0) return;
    
    setIsRunning(true);
    isRunningRef.current = true;
    
    const currentGraph = { 
      nodes: [...nodes], 
      edges: edges.map(edge => ({
        from: edge.u,
        to: edge.v,
        weight: edge.weight
      }))
    };

    const gen = floydWarshall(currentGraph);

    for (const state of gen) {
      if (!isRunningRef.current) return;

      setMatrix(state.dist.map(row => [...row]));
      setCurrentK(state.k ?? -1);
      setCurrentI(state.i ?? -1);
      setCurrentJ(state.j ?? -1);
      setCurrentStep(state.description);

      await sleep();
    }

    setIsRunning(false);
    isRunningRef.current = false;
  };

  const resetAll = () => resetGraph(INITIAL_NODES, INITIAL_EDGES);
  const clearAll = clearGraph;

  const stats = { 
    currentStep: currentStep
  };

  return (
    <div className="flex h-screen bg-[#f8f9faff] text-[#212529] font-sans overflow-hidden">
      <CommonSidebar
        algorithmTitle="Floyd-Warshall Algorithm"
        algorithmSubtitle="All-Pairs Shortest Path"
        isRunning={isRunning}
        onRunAlgorithm={runAlgorithm}
        onGenerateRandom={resetAll}
        onReset={clearAll}
        speedIndex={speedIndex}
        onSpeedChange={setSpeedIndex}
        currentStep={currentStep}
        stats={stats}
        complexityInfo={floydWarshallInfo.complexity}
        runButtonText="Run"
        showInput={false}
      >
        {/* Graph Tools */}
        <div className="p-6 border-b border-[#f1f3f5]">
          <h3 className="text-[10px] font-black text-[#adb5bd] uppercase tracking-wider mb-4 flex items-center justify-between">
            <span className="flex items-center gap-2"><MousePointer2 size={12} /> Graph Tools</span>
            {isRunning && <Lock size={10} className="text-amber-600" />}
          </h3>
          <div className="space-y-1.5">
             <ToolButton active={mode === 'ADD'} onClick={() => setMode('ADD')} disabled={isRunning} icon={<Plus size={16}/>} label="Add Node" desc="Place new vertices" />
             <ToolButton active={mode === 'LINK'} onClick={() => setMode('LINK')} disabled={isRunning} icon={<LinkIcon size={16}/>} label="Link Edge" desc="Connect vertices" />
             <ToolButton active={mode === 'DELETE'} onClick={() => setMode('DELETE')} disabled={isRunning} icon={<Trash2 size={16}/>} label="Delete" desc="Remove graph items" danger />
          </div>
        </div>

        {/* Status Display */}
        <div className="p-6 border-b border-[#f1f3f5]">
          <div className={`p-4 rounded-xl border-l-4 transition-all ${isRunning ? 'bg-[#212529] text-white shadow-md' : 'bg-[#f8f9faff] border-[#dee2e6]'}`}>
            <p className="text-[9px] font-black uppercase opacity-60 mb-1">Status</p>
            <p className="text-xs font-bold leading-tight h-10 overflow-hidden">{currentStep}</p>
          </div>
        </div>

        {/* Distance Matrix Display */}
        <div className="flex-1 p-6 space-y-4">
          <div className="space-y-3">
            <h4 className="text-[10px] font-black text-[#adb5bd] uppercase tracking-widest flex items-center gap-2">
              <Activity size={12} /> Distance Matrix
            </h4>
            <div className="bg-white border border-[#dee2e6] rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-center text-[9px] border-collapse">
                <thead className="bg-[#f8f9faff] border-b border-[#dee2e6]">
                  <tr>
                    <th className="p-2 border-r border-[#dee2e6]"></th>
                    {nodes.map(n => <th key={n.id} className={`p-2 font-black border-r border-[#dee2e6] ${currentJ === n.id ? 'bg-[#212529] text-white' : ''}`}>{n.label}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {matrix.map((row, i) => (
                    <tr key={i} className={`border-b border-[#f1f3f5] ${currentI === i ? 'bg-[#e9ecefff]' : ''}`}>
                      <td className={`p-2 font-black border-r border-[#dee2e6] ${currentI === i ? 'bg-[#212529] text-white' : 'bg-[#f8f9faff]'}`}>{nodes[i]?.label}</td>
                      {row.map((val, j) => (
                        <td key={j} className={`p-2 font-mono border-r border-[#f1f3f5] ${currentI === i && currentJ === j ? 'bg-[#6c757d] text-white font-bold' : (currentK === j || currentK === i ? 'bg-[#f1f3f5]' : '')}`}>
                          {val === Infinity ? '∞' : val}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </CommonSidebar>

      {/* Main Workspace */}
      <main className="flex-1 relative bg-[#f8f9faff] overflow-hidden" onClick={handleCanvasClick}>
        <GraphCanvas
          nodes={nodes}
          edges={edges}
          handleCanvasClick={handleCanvasClick}
          handleNodeClick={handleNodeClick}
          svgRef={svgRef}
          showArrows={true}
          highlightEdges={edges.reduce((acc, edge, idx) => {
            const isActive = (currentI === edge.u && currentJ === edge.v) || 
                           (currentI === edge.u && currentK === edge.v) || 
                           (currentK === edge.u && currentJ === edge.v);
            if (isActive) acc.push(idx);
            return acc;
          }, [])}
          highlightNodes={nodes.reduce((acc, node) => {
            const isK = currentK === node.id;
            const isI = currentI === node.id;
            const isJ = currentJ === node.id;
            
            if (isK) {
              acc[node.id] = {
                fill: COLORS.carbonBlack,
                stroke: COLORS.carbonBlack,
                textColor: 'white',
                scale: '1.3',
                label: { text: 'PIVOT (K)', position: 'top', color: COLORS.carbonBlack }
              };
            } else if (isI || isJ) {
              acc[node.id] = {
                fill: COLORS.slateGrey,
                stroke: COLORS.slateGrey,
                textColor: 'white',
                scale: '1.15',
                label: { 
                  text: isI ? 'SRC (I)' : 'DEST (J)', 
                  position: isI ? 'bottom' : 'right', 
                  color: COLORS.slateGrey 
                }
              };
            }
            return acc;
          }, {})}
        />

        {/* Legend Overlay */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 px-8 py-4 bg-white/90 backdrop-blur-sm border border-[#dee2e6] rounded-3xl shadow-2xl">
           <div className="flex items-center gap-8">
              <LegendItem color={COLORS.carbonBlack} label="Intermediate (K)" />
              <LegendItem color={COLORS.slateGrey} label="Source / Destination" />
              <LegendItem color="white" label="Unvisited" border />
              <div className="flex items-center gap-1.5">
                <svg width="10" height="10" viewBox="0 0 10 10" className="text-[#adb5bd]">
                  <path d="M 0 5 L 10 5" stroke="currentColor" strokeWidth="2" markerEnd="url(#arrow)" />
                </svg>
                <span className="text-[9px] font-black uppercase text-[#6c757d]">Directed Only</span>
              </div>
           </div>
           <div className="w-full h-px bg-[#dee2e6] opacity-50"></div>
           <div className="flex items-center gap-2">
             <Info size={14} className="text-[#adb5bd]" />
             <span className="text-[9px] font-black text-[#adb5bd] uppercase tracking-wide">
                Floyd-Warshall: Iteratively update distances between all pairs using intermediate node K.
             </span>
           </div>
        </div>
      </main>
    </div>
  );
};

export default FloydWarshallVisualization;