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
  Lock, 
  Circle, 
  AlertTriangle
} from 'lucide-react';
import CommonSidebar from '../../../../components/Visualisation/CommonSidebar';
import { bellmanFord, bellmanFordInfo } from '../../../../algorithms/Graph/bellmanFord';
import { COLORS } from '../../../../constants/visualizationConstants';
import ToolButton from './components/ToolButton';
import LegendItem from './components/LegendItem';
import DistanceTable from './components/DistanceTable';
import GraphCanvas from './components/GraphCanvas';
import { useGraphManagement } from './hooks/useGraphManagement';

const BellmanFordVisualization = () => {
  // Initial graph data
  const INITIAL_NODES = [
    { id: 1, x: 100, y: 150, label: 'A' },
    { id: 2, x: 300, y: 100, label: 'B' },
    { id: 3, x: 300, y: 300, label: 'C' },
    { id: 4, x: 500, y: 200, label: 'D' },
  ];
  
  const INITIAL_EDGES = [
    { u: 1, v: 2, weight: 6 },
    { u: 1, v: 3, weight: 7 },
    { u: 2, v: 3, weight: 8 },
    { u: 2, v: 4, weight: -4 },
    { u: 3, v: 4, weight: 9 },
    { u: 3, v: 2, weight: -3 },
  ];

  // Algorithm state reset function
  const resetAlgoState = () => {
    // Initialize distances to infinity for all nodes, except start node which is 0
    const initialDistances = {};
    const initialPrevious = {};
    
    nodes.forEach(node => {
      const effectiveStartNodeId = startNodeId || (nodes.length > 0 ? nodes[0].id : null);
      initialDistances[node.id] = node.id === effectiveStartNodeId ? 0 : Infinity;
      initialPrevious[node.id] = null;
    });
    
    setDistances(initialDistances);
    setPrevious(initialPrevious);
    setActiveEdgeIdx(-1);
    setIteration(0);
    setHasNegativeCycle(false);
    setFinalPath([]);
    setCurrentStep("Ready to perform relaxation passes.");
  };

  // Algorithm-specific state
  const [startNodeId, setStartNodeId] = useState(1);
  const [distances, setDistances] = useState({});
  const [previous, setPrevious] = useState({});
  const [activeEdgeIdx, setActiveEdgeIdx] = useState(-1);
  const [iteration, setIteration] = useState(0);
  const [hasNegativeCycle, setHasNegativeCycle] = useState(false);
  const [finalPath, setFinalPath] = useState([]);
  const [currentStep, setCurrentStep] = useState("Bellman-Ford relaxes all edges (V-1) times.");

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
    setNodes,
    setEdges,
    setMode,
    setIsRunning,
    setSpeedIndex,
    setLinkSource,
    handleCanvasClick,
    handleNodeClick: baseHandleNodeClick,
    resetGraph,
    clearGraph,
    sleep
  } = useGraphManagement(INITIAL_NODES, INITIAL_EDGES, resetAlgoState);

  // Enhanced node click handler for Bellman-Ford specific modes
  const handleNodeClick = (e, node) => {
    e.stopPropagation();
    if (isRunning) return;

    if (mode === 'START') {
      setStartNodeId(node.id);
    } else {
      // Handle DELETE and LINK modes through base handler
      baseHandleNodeClick(e, node);
      
      // Special handling for DELETE mode - update start node if needed
      if (mode === 'DELETE' && startNodeId === node.id) {
        const remainingNodes = nodes.filter(n => n.id !== node.id);
        setStartNodeId(remainingNodes.length > 0 ? remainingNodes[0].id : null);
      }
    }
  };

  // --- Bellman-Ford Algorithm ---
  const runAlgorithm = async () => {
    if (isRunning || !startNodeId || nodes.length === 0) return;
    
    setIsRunning(true);
    isRunningRef.current = true;
    resetAlgoState();

    const currentGraph = { 
      nodes: [...nodes], 
      edges: edges.map(edge => ({
        from: edge.u,
        to: edge.v,
        weight: edge.weight
      }))
    };

    const gen = bellmanFord(currentGraph, startNodeId);

    for (const state of gen) {
      if (!isRunningRef.current) return;

      setDistances({ ...state.distances });
      setPrevious({ ...state.previous });
      setIteration(state.iteration);
      setActiveEdgeIdx(state.activeEdge?.index ?? -1);
      setHasNegativeCycle(!!state.hasNegativeCycle);
      setCurrentStep(state.description);

      await sleep();
    }

    setIsRunning(false);
    isRunningRef.current = false;
  };

  const showPathTo = (targetId) => {
    if (isRunning || distances[targetId] === Infinity || hasNegativeCycle) return;
    const path = [];
    let curr = targetId;
    while (curr) {
      path.push(curr);
      curr = previous[curr];
    }
    setFinalPath(path.reverse());
    const label = nodes.find(n => n.id === targetId)?.label;
    setCurrentStep(`Shortest path to ${label} highlighted. Total Weight: ${distances[targetId]}`);
  };

  const resetAll = () => {
    resetGraph(INITIAL_NODES, INITIAL_EDGES);
    setStartNodeId(1);
  };

  const clearAll = clearGraph;

  const stats = { 
    iteration: iteration,
    hasNegativeCycle: hasNegativeCycle,
    currentStep: currentStep
  };

  return (
    <div className="flex h-screen bg-[#f8f9faff] text-[#212529] font-sans overflow-hidden">
      <CommonSidebar
        algorithmTitle="Bellman-Ford Algorithm"
        algorithmSubtitle="Shortest Path with Negative Weights"
        isRunning={isRunning}
        onRunAlgorithm={runAlgorithm}
        onGenerateRandom={resetAll}
        onReset={clearAll}
        speedIndex={speedIndex}
        onSpeedChange={setSpeedIndex}
        currentStep={currentStep}
        stats={stats}
        complexityInfo={bellmanFordInfo.complexity}
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
             <ToolButton active={mode === 'LINK'} onClick={() => setMode('LINK')} disabled={isRunning} icon={<LinkIcon size={16}/>} label="Link Edge (Directed)" desc="Drag from Start to End" />
             <ToolButton active={mode === 'START'} onClick={() => setMode('START')} disabled={isRunning} icon={<Circle size={14}/>} label="Source" desc="Origin for passes" />
             <ToolButton active={mode === 'DELETE'} onClick={() => setMode('DELETE')} disabled={isRunning} icon={<Trash2 size={16}/>} label="Delete" desc="Remove graph items" danger />
          </div>
        </div>

        {/* Additional Metrics for Bellman-Ford */}
        <div className="p-6 border-b border-[#f1f3f5] space-y-3">
          
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="p-3 bg-white border border-[#dee2e6] rounded-xl">
              <p className="text-[8px] font-black text-[#adb5bd] uppercase mb-1">Pass</p>
              <p className="text-lg font-bold font-mono text-[#212529]">
                {iteration > 0 ? iteration : '-'}
                <span className="text-[10px] text-[#adb5bd] font-normal ml-1">/ {nodes.length > 0 ? nodes.length : 0}</span>
              </p>
            </div>
            <div className="p-3 bg-white border border-[#dee2e6] rounded-xl">
              <p className="text-[8px] font-black text-[#adb5bd] uppercase mb-1">Negative Cycle</p>
              <p className={`text-xs font-bold font-mono uppercase ${hasNegativeCycle ? 'text-red-500' : 'text-green-500'}`}>
                {hasNegativeCycle ? 'Yes' : (iteration === nodes.length ? 'No' : '-')}
              </p>
            </div>
          </div>
        </div>

        <DistanceTable
          nodes={nodes}
          distances={distances}
          previous={previous}
          activeNode={null}
          showPathTo={showPathTo}
        />
      </CommonSidebar>

      {/* Main Workspace */}
      <main className="flex-1 relative bg-[#f8f9faff] overflow-hidden" onClick={handleCanvasClick}>
        <GraphCanvas
          nodes={nodes}
          edges={edges}
          handleCanvasClick={handleCanvasClick}
          handleNodeClick={handleNodeClick}
          svgRef={svgRef}
          highlightEdges={[activeEdgeIdx]}
          highlightNodes={nodes.reduce((acc, node) => {
            acc[node.id] = {
              fill: node.id === startNodeId ? COLORS.platinum : 'white',
              stroke: node.id === startNodeId ? COLORS.platinum : COLORS.alabasterGrey,
              scale: finalPath.includes(node.id) ? '1.2' : '1'
            };
            return acc;
          }, {})}
        />

        {/* Legend Overlay */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 px-8 py-4 bg-white/90 backdrop-blur-sm border border-[#dee2e6] rounded-3xl shadow-2xl">
           <div className="flex items-center gap-8">
              <LegendItem color={COLORS.carbonBlack} label="Scanning / Path" />
              <LegendItem color={COLORS.platinum} label="Distance Known" />
              <LegendItem color="white" label="Unprocessed" border />
           </div>
           <div className="w-full h-px bg-[#dee2e6] opacity-50"></div>
           <div className="flex items-center gap-2">
             <Info size={14} className="text-[#adb5bd]" />
             <span className="text-[9px] font-black text-[#adb5bd] uppercase tracking-wide">
                Bellman-Ford: Iteratively relaxes all edges to find shortest paths and detect negative cycles.
             </span>
           </div>
        </div>
      </main>
    </div>
  );
};

export default BellmanFordVisualization;