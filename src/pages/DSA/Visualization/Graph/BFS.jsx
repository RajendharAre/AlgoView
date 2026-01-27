import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  RotateCcw, 
  Share2, 
  Plus, 
  Link as LinkIcon, 
  Trash2, 
  Activity, 
  Info, 
  MousePointer2, 
  Lock, 
  Circle, 
  ChevronRight, 
  ListOrdered
} from 'lucide-react';
import CommonSidebar from '../../../../components/Visualisation/CommonSidebar';
import { bfsInfo } from '../../../../algorithms/Graph/bfs';
import { COLORS, SPEEDS } from '../../../../constants/visualizationConstants';

const BFSVisualization = () => {
  const [nodes, setNodes] = useState([
    { id: 1, x: 250, y: 150, label: '0' },
    { id: 2, x: 450, y: 150, label: '1' },
    { id: 3, x: 250, y: 350, label: '2' },
    { id: 4, x: 450, y: 350, label: '3' },
  ]);
  const [edges, setEdges] = useState([
    { u: 1, v: 2 }, { u: 1, v: 3 }, { u: 2, v: 4 }, { u: 3, v: 4 }
  ]);
  
  const [mode, setMode] = useState('ADD'); 
  const [startNodeId, setStartNodeId] = useState(null);
  
  const [isRunning, setIsRunning] = useState(false);
  const [visited, setVisited] = useState(new Set());
  const [queue, setQueue] = useState([]);
  const [activeNode, setActiveNode] = useState(null);
  const [traversalOrder, setTraversalOrder] = useState([]);
  const [speedIndex, setSpeedIndex] = useState(1);
  const [componentsFound, setComponentsFound] = useState(0);
  
  const [currentStep, setCurrentStep] = useState("Configure the graph or press Start to begin.");
  const [linkSource, setLinkSource] = useState(null);

  const speedRef = useRef(SPEEDS[1].value);
  const isRunningRef = useRef(false);
  const svgRef = useRef(null);

  useEffect(() => {
    speedRef.current = SPEEDS[speedIndex].value;
  }, [speedIndex]);

  // --- Graph Management ---

  const handleCanvasClick = (e) => {
    if (isRunning || mode !== 'ADD') return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setNodes([...nodes, { id: Date.now(), x, y, label: nodes.length.toString() }]);
    resetAlgoState();
  };

  const handleNodeClick = (e, node) => {
    e.stopPropagation();
    if (isRunning) return;

    if (mode === 'DELETE') {
      setNodes(nodes.filter(n => n.id !== node.id));
      setEdges(edges.filter(edge => edge.u !== node.id && edge.v !== node.id));
      if (startNodeId === node.id) setStartNodeId(null);
      resetAlgoState();
    } else if (mode === 'LINK') {
      if (!linkSource) {
        setLinkSource(node.id);
      } else if (linkSource !== node.id) {
        const exists = edges.some(edge => (edge.u === linkSource && edge.v === node.id) || (edge.u === node.id && edge.v === linkSource));
        if (!exists) setEdges([...edges, { u: linkSource, v: node.id }]);
        setLinkSource(null);
        resetAlgoState();
      }
    } else if (mode === 'START') {
      setStartNodeId(node.id);
      resetAlgoState();
    }
  };

  const resetAlgoState = () => {
    setVisited(new Set());
    setQueue([]);
    setActiveNode(null);
    setTraversalOrder([]);
    setComponentsFound(0);
    setCurrentStep("Ready to start BFS traversal.");
  };

  const sleep = () => new Promise(r => setTimeout(r, speedRef.current));

  // --- BFS Traversal ---
  
  const runAlgorithm = async () => {
    if (isRunning || nodes.length === 0) return;
    
    setIsRunning(true);
    isRunningRef.current = true;
    resetAlgoState();

    // Use current state of nodes and edges to ensure latest graph is used
    const currentGraph = { nodes: [...nodes], edges: [...edges] };
    
    // Use the startNodeId if set, otherwise use the first node as default
    const actualStartNodeId = startNodeId ? startNodeId : (nodes.length > 0 ? nodes[0].id : null);
    
    if (!actualStartNodeId) {
      setCurrentStep("No nodes available to start traversal");
      setIsRunning(false);
      isRunningRef.current = false;
      return;
    }
    
    const gen = bfsInfo.generator(currentGraph, actualStartNodeId);

    for (const state of gen) {
      if (!isRunningRef.current) return;

      setVisited(new Set(state.visited));
      setQueue([...state.queue]);
      setActiveNode(state.activeNode);
      setTraversalOrder([...state.traversalOrder]);
      setCurrentStep(state.currentStep);
      setComponentsFound(state.componentsFound);

      await sleep();
    }

    setIsRunning(false);
    isRunningRef.current = false;
  };

  const resetAll = () => {
    setNodes([
      { id: 1, x: 250, y: 150, label: '0' },
      { id: 2, x: 450, y: 150, label: '1' },
      { id: 3, x: 250, y: 350, label: '2' },
      { id: 4, x: 450, y: 350, label: '3' },
    ]);
    setEdges([
      { u: 1, v: 2 }, { u: 1, v: 3 }, { u: 2, v: 4 }, { u: 3, v: 4 }
    ]);
    setStartNodeId(1); // Set the default start node to the first node (id: 1)
    resetAlgoState();
  };

  const clearAll = () => {
    setNodes([]);
    setEdges([]);
    resetAlgoState();
  };

  const stats = { 
    visitedNodes: visited.size,
    totalNodes: nodes.length,
    components: componentsFound
  };

  return (
    <div className="flex h-screen bg-[#f8f9faff] text-[#212529] font-sans overflow-hidden">
      <CommonSidebar
        algorithmTitle="BFS Visualizer"
        algorithmSubtitle="Breadth-First Search"
        isRunning={isRunning}
        onRunAlgorithm={runAlgorithm}
        onGenerateRandom={resetAll}
        onReset={clearAll}
        speedIndex={speedIndex}
        onSpeedChange={setSpeedIndex}
        currentStep={currentStep}
        stats={stats}
        complexityInfo={bfsInfo.complexity}
        runButtonText="Run"
        inputLabel=""
        inputPlaceholder=""
        showInput={false}
      >
        {/* Graph Tools */}
        <div className="p-6 border-b border-[#f1f3f5]">
          <h3 className="text-[10px] font-black text-[#adb5bd] uppercase tracking-wider mb-4 flex items-center justify-between">
            <span className="flex items-center gap-2"><MousePointer2 size={12} /> Graph Tools</span>
            {isRunning && <Lock size={10} className="text-amber-600" />}
          </h3>
          <div className="space-y-1.5">
             <ToolButton active={mode === 'ADD'} onClick={() => setMode('ADD')} disabled={isRunning} icon={<Plus size={16}/>} label="Add Node" desc="Create new vertices" />
             <ToolButton active={mode === 'LINK'} onClick={() => setMode('LINK')} disabled={isRunning} icon={<LinkIcon size={16}/>} label="Connect" desc="Create edges" />
             <ToolButton active={mode === 'START'} onClick={() => setMode('START')} disabled={isRunning} icon={<Circle size={14}/>} label="Start Node" desc="Traversal root" />
             <ToolButton active={mode === 'DELETE'} onClick={() => setMode('DELETE')} disabled={isRunning} icon={<Trash2 size={16}/>} label="Delete" desc="Remove elements" danger />
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 p-6 space-y-6">
          {traversalOrder.length > 0 && (
            <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
              <h4 className="text-[10px] font-black text-[#212529] uppercase tracking-widest flex items-center gap-2">
                <ListOrdered size={12} /> Traversal Order
              </h4>
              <div className="flex flex-wrap items-center gap-1 p-2 bg-[#f8f9faff] rounded-xl border border-[#dee2e6]">
                 {traversalOrder.map((nodeId, i) => {
                   const nodeLabel = nodes.find(n => n.id === nodeId)?.label;
                   return (
                     <React.Fragment key={i}>
                       <div className="px-2 py-1 bg-[#212529] text-white text-[10px] font-bold rounded-lg shadow-sm">{nodeLabel}</div>
                       {i < traversalOrder.length - 1 && <ChevronRight size={10} className="text-[#adb5bd]" />}
                     </React.Fragment>
                   )
                 })}
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3 bg-white border border-[#dee2e6] rounded-xl">
                  <p className="text-[8px] font-black text-[#adb5bd] uppercase mb-1">Visited</p>
                  <p className="text-lg font-bold font-mono">{visited.size} / {nodes.length}</p>
              </div>
              <div className="p-3 bg-white border border-[#dee2e6] rounded-xl">
                  <p className="text-[8px] font-black text-[#adb5bd] uppercase mb-1">Components</p>
                  <p className="text-lg font-bold font-mono">{componentsFound}</p>
              </div>
              <div className="p-3 bg-white border border-[#dee2e6] rounded-xl">
                  <p className="text-[8px] font-black text-[#adb5bd] uppercase mb-1">Queue Size</p>
                  <p className="text-lg font-bold font-mono">{queue.length}</p>
              </div>
          </div>
        </div>
      </CommonSidebar>

      {/* Workspace */}
      <main className="flex-1 relative bg-[#f8f9faff] overflow-hidden" onClick={handleCanvasClick}>
        <svg ref={svgRef} className="w-full h-full cursor-crosshair">
          {edges.map((edge, i) => {
            const u = nodes.find(n => n.id === edge.u); 
            const v = nodes.find(n => n.id === edge.v);
            if (!u || !v) return null;
            return <line key={i} x1={u.x} y1={u.y} x2={v.x} y2={v.y} stroke={COLORS.alabasterGrey} strokeWidth="2" strokeDasharray="4,4" />;
          })}
          {nodes.map((node) => {
            const isVisited = visited.has(node.id); 
            const inQueue = queue.includes(node.id);
            const isActive = activeNode === node.id; 
            const isStart = startNodeId === node.id;
            const isSelected = linkSource === node.id;
            let fill = 'white', stroke = COLORS.alabasterGrey, textColor = COLORS.carbonBlack, scale = '1';
            if (isActive) { 
              fill = COLORS.carbonBlack; 
              stroke = COLORS.carbonBlack; 
              textColor = 'white'; 
              scale = '1.25'; 
            }
            else if (isVisited) { 
              fill = COLORS.slateGrey; 
              stroke = COLORS.slateGrey; 
              textColor = 'white'; 
            }
            else if (inQueue) { 
              fill = COLORS.platinum; 
              stroke = COLORS.slateGrey; 
            }
            if (isStart) stroke = COLORS.carbonBlack; 
            if (isSelected) stroke = COLORS.ironGrey;
            return (
              <g key={node.id} onClick={(e) => handleNodeClick(e, node)} className="cursor-pointer transition-all duration-300" style={{ transform: `scale(${scale})`, transformOrigin: `${node.x}px ${node.y}px` }}>
                <circle cx={node.x} cy={node.y} r="22" fill={fill} stroke={stroke} strokeWidth={isStart || isSelected ? "3" : "2"} className="shadow-md" />
                <text x={node.x} y={node.y} textAnchor="middle" dy=".3em" fontSize="12" fontWeight="900" fill={textColor}>{node.label}</text>
                {isStart && <text x={node.x} y={node.y - 32} textAnchor="middle" fontSize="7" fontWeight="black" fill={COLORS.carbonBlack}>START</text>}
              </g>
            );
          })}
        </svg>

        {/* Legend Overlay */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 px-8 py-4 bg-white/90 backdrop-blur-sm border border-[#dee2e6] rounded-3xl shadow-2xl">
           <div className="flex items-center gap-8">
              <LegendItem color={COLORS.carbonBlack} label="Processing" />
              <LegendItem color={COLORS.slateGrey} label="Visited" />
              <LegendItem color={COLORS.platinum} label="In Queue" />
              <LegendItem color="white" label="Unvisited" border />
           </div>
           <div className="w-full h-px bg-[#dee2e6] opacity-50"></div>
           <div className="flex items-center gap-2">
             <Info size={14} className="text-[#adb5bd]" />
             <span className="text-[9px] font-black text-[#adb5bd] uppercase tracking-wide">
                Breadth-First Search: Explore nodes level-by-level using a FIFO Queue.
             </span>
           </div>
        </div>
      </main>
    </div>
  );
};

const ToolButton = ({ active, onClick, disabled, icon, label, desc, danger }) => (
  <button onClick={onClick} disabled={disabled} className={`w-full flex items-center gap-3 p-2.5 rounded-xl border transition-all text-left disabled:opacity-30 ${active ? 'bg-[#212529] border-[#212529] shadow-md translate-x-1' : 'bg-white border-transparent hover:bg-[#f8f9faff] hover:border-[#dee2e6]'}`}>
    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${active ? 'bg-white/20 text-white' : (danger ? 'bg-red-50 text-red-500' : 'bg-[#f1f3f5] text-[#6c757d]')}`}>{icon}</div>
    <div className="overflow-hidden"><div className={`text-[11px] font-bold truncate ${active ? 'text-white' : 'text-[#212529]'}`}>{label}</div><div className={`text-[8px] font-medium leading-none mt-0.5 truncate ${active ? 'text-white/60' : 'text-[#adb5bd]'}`}>{desc}</div></div>
  </button>
);

const LegendItem = ({ color, label, border }) => (
  <div className="flex items-center gap-2">
    <div className={`w-3 h-3 rounded-full ${border ? 'border border-[#dee2e6]' : ''}`} style={{ backgroundColor: color }}></div>
    <span className="text-[9px] font-black uppercase text-[#6c757d] tracking-wide">{label}</span>
  </div>
);

export default BFSVisualization;