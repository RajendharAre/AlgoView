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
  ListOrdered,
  Zap
} from 'lucide-react';

/**
 * DFS Visualizer
 * Focus: Deep discovery of nodes using a Stack/Recursion.
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
  { label: '1x', value: 800 },
  { label: '1.5x', value: 500 },
  { label: '2x', value: 300 },
  { label: '2.5x', value: 150 },
  { label: '3x', value: 80 },
];

const INITIAL_NODES = [
  { id: 1, x: 250, y: 150, label: '0' },
  { id: 2, x: 450, y: 150, label: '1' },
  { id: 3, x: 250, y: 350, label: '2' },
  { id: 4, x: 450, y: 350, label: '3' },
];

const INITIAL_EDGES = [
  { u: 1, v: 2 }, { u: 1, v: 3 }, { u: 2, v: 4 }, { u: 3, v: 4 }
];

const App = () => {
  // Graph State
  const [nodes, setNodes] = useState(INITIAL_NODES);
  const [edges, setEdges] = useState(INITIAL_EDGES);
  const [mode, setMode] = useState('ADD'); 
  const [startNodeId, setStartNodeId] = useState(1);
  
  // Animation State
  const [isRunning, setIsRunning] = useState(false);
  const [visited, setVisited] = useState(new Set());
  const [stack, setStack] = useState([]); // Visualizing the recursion stack
  const [activeNode, setActiveNode] = useState(null);
  const [traversalOrder, setTraversalOrder] = useState([]);
  const [speedIndex, setSpeedIndex] = useState(1);
  const [componentsFound, setComponentsFound] = useState(0);
  
  // UI State
  const [currentStep, setCurrentStep] = useState("DFS explores as deep as possible before backtracking.");
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
    setStack([]);
    setActiveNode(null);
    setTraversalOrder([]);
    setComponentsFound(0);
    setCurrentStep("Ready to start DFS traversal.");
  };

  const sleep = () => new Promise(r => setTimeout(r, speedRef.current));

  // --- DFS Traversal Logic ---

  const dfsVisit = async (u, localVisited, order) => {
    if (!isRunningRef.current) return;

    // Discovery phase
    localVisited.add(u);
    setVisited(new Set(localVisited));
    
    const nodeObj = nodes.find(n => n.id === u);
    order.push(nodeObj?.label);
    setTraversalOrder([...order]);
    
    setActiveNode(u);
    setStack(prev => [...prev, u]);
    setCurrentStep(`Discovering Node ${nodeObj?.label}`);
    await sleep();

    // Explore neighbors
    const neighbors = edges
      .filter(e => e.u === u || e.v === u)
      .map(e => (e.u === u ? e.v : e.u))
      .filter(v => !localVisited.has(v));

    for (const v of neighbors) {
      if (!isRunningRef.current) return;
      if (localVisited.has(v)) continue;

      setCurrentStep(`Moving from Node ${nodeObj?.label} to unexplored Node ${nodes.find(n => n.id === v)?.label}`);
      await dfsVisit(v, localVisited, order);
      
      // Post-recursion recovery
      setActiveNode(u);
      setCurrentStep(`Backtracking to Node ${nodeObj?.label}`);
      await sleep();
    }

    // Finished processing node
    setStack(prev => prev.slice(0, -1));
  };

  const runDFS = async () => {
    if (isRunning || nodes.length === 0) return;
    
    setIsRunning(true);
    isRunningRef.current = true;
    resetAlgoState();

    const localVisited = new Set();
    const order = [];
    let compCount = 0;

    const allNodeIds = nodes.map(n => n.id);
    const sortedRoots = startNodeId 
      ? [startNodeId, ...allNodeIds.filter(id => id !== startNodeId)] 
      : allNodeIds;

    for (let rootId of sortedRoots) {
      if (!isRunningRef.current) return;
      if (localVisited.has(rootId)) continue;

      compCount++;
      setComponentsFound(compCount);
      setCurrentStep(`Starting DFS traversal at Node ${nodes.find(n => n.id === rootId)?.label}`);
      await sleep();

      await dfsVisit(rootId, localVisited, order);
    }

    setCurrentStep(`DFS traversal complete.`);
    setIsRunning(false);
    isRunningRef.current = false;
    setActiveNode(null);
  };

  return (
    <div className="flex h-screen bg-[#f8f9faff] text-[#212529] font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-80 bg-white border-r border-[#dee2e6] flex flex-col shrink-0 shadow-lg z-20 overflow-y-auto">
        <div className="p-6 border-b border-[#f1f3f5]">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 bg-[#212529] rounded flex items-center justify-center text-white">
              <Zap size={18} fill="currentColor" />
            </div>
            <h1 className="text-base font-bold tracking-tight">DFS Visualizer</h1>
          </div>
          <p className="text-[10px] text-[#6c757d] uppercase tracking-widest font-black ml-11">Depth-First Search</p>
        </div>

        {/* Speed Controls */}
        <div className="p-6 border-b border-[#f1f3f5]">
           <h3 className="text-[10px] font-black text-[#adb5bd] uppercase tracking-wider mb-3 flex items-center gap-2">
             <Activity size={12} /> Execution Speed
           </h3>
           <div className="grid grid-cols-5 gap-1 p-1 bg-[#f8f9faff] rounded-xl border border-[#dee2e6]">
              {SPEEDS.map((s, idx) => (
                <button 
                  key={s.label} 
                  onClick={() => setSpeedIndex(idx)} 
                  className={`py-1.5 text-[10px] font-bold rounded-lg transition-all ${speedIndex === idx ? 'bg-[#212529] text-white shadow-md' : 'text-[#6c757d] hover:bg-slate-100'}`}
                >
                  {s.label}
                </button>
              ))}
           </div>
        </div>

        {/* Tools */}
        <div className="p-6 border-b border-[#f1f3f5]">
          <h3 className="text-[10px] font-black text-[#adb5bd] uppercase tracking-wider mb-4 flex items-center justify-between">
            <span className="flex items-center gap-2"><MousePointer2 size={12} /> Graph Tools</span>
            {isRunning && <Lock size={10} className="text-amber-600" />}
          </h3>
          <div className="space-y-1.5">
             <ToolButton active={mode === 'ADD'} onClick={() => setMode('ADD')} disabled={isRunning} icon={<Plus size={16}/>} label="Add Node" desc="Place new vertices" />
             <ToolButton active={mode === 'LINK'} onClick={() => setMode('LINK')} disabled={isRunning} icon={<LinkIcon size={16}/>} label="Connect" desc="Create adjacency" />
             <ToolButton active={mode === 'START'} onClick={() => setMode('START')} disabled={isRunning} icon={<Circle size={14}/>} label="Start Node" desc="Discovery root" />
             <ToolButton active={mode === 'DELETE'} onClick={() => setMode('DELETE')} disabled={isRunning} icon={<Trash2 size={16}/>} label="Delete" desc="Remove elements" danger />
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-b border-[#f1f3f5] space-y-2">
            <button 
              onClick={runDFS} 
              disabled={isRunning || nodes.length === 0} 
              className="w-full py-3 bg-[#212529] text-white rounded-xl flex items-center justify-center gap-2 font-bold text-xs shadow-md active:scale-95 transition-transform"
            >
              <Play size={14} fill="white" /> Start DFS Traversal
            </button>
            <div className="flex gap-2">
              <button 
                onClick={() => {setNodes(INITIAL_NODES); setEdges(INITIAL_EDGES); resetAlgoState();}} 
                disabled={isRunning} 
                className="flex-1 py-2 bg-white border border-[#dee2e6] text-[10px] font-black uppercase rounded-xl hover:bg-slate-50 transition-all"
              >
                Reset
              </button>
              <button 
                onClick={() => {setNodes([]); setEdges([]); resetAlgoState();}} 
                disabled={isRunning} 
                className="flex-1 py-2 bg-white border border-[#dee2e6] text-[10px] font-black uppercase rounded-xl hover:bg-slate-50 transition-all"
              >
                Clear
              </button>
            </div>
        </div>

        {/* Status & Stack Results */}
        <div className="flex-1 p-6 space-y-6">
            <div className={`p-4 rounded-xl border-l-4 transition-all ${isRunning ? 'bg-[#212529] text-white shadow-md' : 'bg-[#f8f9faff] border-[#dee2e6]'}`}>
                <p className="text-[9px] font-black uppercase opacity-60 mb-1">Status</p>
                <p className="text-xs font-bold leading-tight h-12 overflow-hidden">{currentStep}</p>
            </div>

            <div className="space-y-3">
              <h4 className="text-[10px] font-black text-[#adb5bd] uppercase tracking-widest flex items-center gap-2">
                <Activity size={12} /> Call Stack
              </h4>
              <div className="flex flex-col-reverse gap-1 min-h-[40px] p-2 bg-[#f8f9faff] rounded-xl border border-[#dee2e6]">
                 {stack.map((id, i) => (
                   <div key={i} className={`px-2 py-1.5 text-white text-[10px] font-bold rounded-lg shadow-sm flex justify-between items-center animate-in slide-in-from-bottom-2 ${i === stack.length - 1 ? 'bg-[#212529]' : 'bg-[#6c757d]'}`}>
                     <span>Node {nodes.find(n => n.id === id)?.label}</span>
                     {i === stack.length - 1 && <span className="text-[7px] bg-white/20 px-1 rounded">TOP</span>}
                   </div>
                 ))}
                 {stack.length === 0 && <span className="text-[9px] text-[#adb5bd] italic p-1">Stack is empty</span>}
              </div>
            </div>

            {traversalOrder.length > 0 && (
              <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
                <h4 className="text-[10px] font-black text-[#212529] uppercase tracking-widest flex items-center gap-2">
                  <ListOrdered size={12} /> Traversal Order
                </h4>
                <div className="flex flex-wrap items-center gap-1 p-2 bg-[#f8f9faff] rounded-xl border border-[#dee2e6]">
                   {traversalOrder.map((label, i) => (
                     <React.Fragment key={i}>
                       <div className="px-2 py-1 bg-[#212529] text-white text-[10px] font-bold rounded-lg shadow-sm">{label}</div>
                       {i < traversalOrder.length - 1 && <ChevronRight size={10} className="text-[#adb5bd]" />}
                     </React.Fragment>
                   ))}
                </div>
              </div>
            )}
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 relative bg-[#f8f9faff] overflow-hidden" onClick={handleCanvasClick}>
        <svg ref={svgRef} className="w-full h-full cursor-crosshair">
          {/* Edges */}
          {edges.map((edge, i) => {
            const u = nodes.find(n => n.id === edge.u); const v = nodes.find(n => n.id === edge.v);
            if (!u || !v) return null;
            return <line key={i} x1={u.x} y1={u.y} x2={v.x} y2={v.y} stroke={COLORS.alabasterGrey} strokeWidth="2" strokeDasharray="4,4" />;
          })}
          {/* Nodes */}
          {nodes.map((node) => {
            const isVisited = visited.has(node.id); 
            const inStack = stack.includes(node.id);
            const isActive = activeNode === node.id; 
            const isStart = startNodeId === node.id;
            const isSelected = linkSource === node.id;
            
            let fill = 'white', stroke = COLORS.alabasterGrey, textColor = COLORS.carbonBlack, scale = '1';
            
            if (isActive) { 
              fill = COLORS.carbonBlack; stroke = COLORS.carbonBlack; textColor = 'white'; scale = '1.3'; 
            } else if (inStack) {
              fill = COLORS.slateGrey; stroke = COLORS.carbonBlack; textColor = 'white'; scale = '1.1';
            } else if (isVisited) { 
              fill = COLORS.paleSlate; stroke = COLORS.slateGrey; textColor = COLORS.ironGrey; 
            }

            if (isStart) stroke = COLORS.carbonBlack; if (isSelected) stroke = COLORS.ironGrey;
            
            return (
              <g key={node.id} onClick={(e) => handleNodeClick(e, node)} className="cursor-pointer transition-all duration-300" style={{ transform: `scale(${scale})`, transformOrigin: `${node.x}px ${node.y}px` }}>
                <circle cx={node.x} cy={node.y} r="22" fill={fill} stroke={stroke} strokeWidth={isStart || isSelected || inStack ? "3" : "2"} className="shadow-md" />
                <text x={node.x} y={node.y} textAnchor="middle" dy=".3em" fontSize="12" fontWeight="900" fill={textColor}>{node.label}</text>
                {isStart && <text x={node.x} y={node.y - 32} textAnchor="middle" fontSize="7" fontWeight="black" fill={COLORS.carbonBlack}>START</text>}
              </g>
            );
          })}
        </svg>

        {/* Legend Overlay */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 px-8 py-4 bg-white/90 backdrop-blur-sm border border-[#dee2e6] rounded-3xl shadow-2xl">
           <div className="flex items-center gap-8">
              <LegendItem color={COLORS.carbonBlack} label="Active Explorer" />
              <LegendItem color={COLORS.slateGrey} label="On Call Stack" />
              <LegendItem color={COLORS.paleSlate} label="Visited" />
              <LegendItem color="white" label="Unvisited" border />
           </div>
           <div className="w-full h-px bg-[#dee2e6] opacity-50"></div>
           <div className="flex items-center gap-2">
             <Info size={14} className="text-[#adb5bd]" />
             <span className="text-[9px] font-black text-[#adb5bd] uppercase tracking-wide">
                Depth-First Search: Explore along each branch as far as possible before backtracking.
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

export default App;