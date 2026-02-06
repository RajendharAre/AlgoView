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
  ChevronRight, 
  ListOrdered,
  Navigation
} from 'lucide-react';
import CommonSidebar from '../../../../components/Visualisation/CommonSidebar';
import { dijkstra, dijkstraInfo } from '../../../../algorithms/Graph/dijkstra';
import { COLORS } from '../../../../constants/visualizationConstants';
import ToolButton from './components/ToolButton';
import LegendItem from './components/LegendItem';
import DistanceTable from './components/DistanceTable';
import GraphCanvas from './components/GraphCanvas';
import { useGraphManagement } from './hooks/useGraphManagement';

// Helper function to convert sequential number to alphabetic label
const getAlphabeticLabel = (nodeCount) => {
  if (nodeCount < 26) {
    return String.fromCharCode(65 + nodeCount); // 0→A, 1→B, ..., 25→Z
  }
  // For more than 26 nodes: A1, A2, ..., B1, B2, etc.
  const letterIndex = Math.floor(nodeCount / 26);
  const charIndex = nodeCount % 26;
  return String.fromCharCode(64 + letterIndex) + String.fromCharCode(65 + charIndex);
};

const DijkstraVisualization = () => {
  // Initial graph data
  const INITIAL_NODES = [
    { id: 1, x: 250, y: 150, label: 'A' },
    { id: 2, x: 450, y: 150, label: 'B' },
    { id: 3, x: 250, y: 350, label: 'C' },
    { id: 4, x: 450, y: 350, label: 'D' },
  ];
  
  const INITIAL_EDGES = [
    { u: 1, v: 2, weight: 4 }, 
    { u: 1, v: 3, weight: 2 }, 
    { u: 2, v: 4, weight: 3 },
    { u: 3, v: 4, weight: 1 }
  ];

  // Algorithm state
  const [startNodeId, setStartNodeId] = useState(null);
  const [distances, setDistances] = useState({});
  const [visited, setVisited] = useState(new Set());
  const [previous, setPrevious] = useState({});
  const [activeNode, setActiveNode] = useState(null);
  const [frontier, setFrontier] = useState([]);
  const [finalPath, setFinalPath] = useState([]);
  const [currentStep, setCurrentStep] = useState("Dijkstra finds the cheapest path using edge weights.");

  // Algorithm state reset function
  const resetAlgoState = () => {
    // Initialize distances to infinity for all nodes, except start node which is 0
    const initialDistances = {};
    nodes.forEach(node => {
      const effectiveStartNodeId = startNodeId || (nodes.length > 0 ? nodes[0].id : null);
      initialDistances[node.id] = node.id === effectiveStartNodeId ? 0 : Infinity;
    });
    
    setDistances(initialDistances);
    setVisited(new Set());
    setPrevious({});
    setActiveNode(null);
    setFrontier([]);
    setFinalPath([]);
    setCurrentStep("Ready to run Dijkstra's algorithm.");
  };

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
    setNodes,
    setEdges,
    handleCanvasClick: hookHandleCanvasClick,
    handleNodeClick: baseHandleNodeClick,
    resetGraph,
    clearGraph,
    sleep
  } = useGraphManagement(INITIAL_NODES, INITIAL_EDGES, resetAlgoState);

  // Override handleCanvasClick to use alphabetic labels for Dijkstra
  const handleCanvasClick = (e) => {
    if (isRunning || mode !== 'ADD') return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Generate new node ID and alphabetic label
    const newNodeId = Math.max(...nodes.map(n => n.id), 0) + 1;
    const newLabel = getAlphabeticLabel(nodes.length); // nodes.length gives us the next sequential index
    
    const newNode = { 
      id: newNodeId, 
      x, 
      y, 
      label: newLabel 
    };
    
    setNodes([...nodes, newNode]);
  };

  // Enhanced node click handler for Dijkstra specific modes
  const handleNodeClick = (e, node) => {
    e.stopPropagation();
    if (isRunning) return;

    if (mode === 'START') {
      setStartNodeId(node.id);
    } else if (mode === 'DELETE') {
      // Delete the node and its edges
      const newNodes = nodes.filter(n => n.id !== node.id);
      
      // Renumber all remaining nodes' labels to keep them sequential (A, B, C, D, etc.)
      const relabeledNodes = newNodes.map((n, index) => ({
        ...n,
        label: getAlphabeticLabel(index)
      }));
      
      setNodes(relabeledNodes);
      setEdges(edges.filter(edge => edge.u !== node.id && edge.v !== node.id));
      
      // Update start node if deleted
      if (startNodeId === node.id) {
        setStartNodeId(relabeledNodes.length > 0 ? relabeledNodes[0].id : null);
      }
    } else if (mode === 'LINK') {
      // Handle LINK mode through base handler
      baseHandleNodeClick(e, node);
    }
  };

  // Initialize with default start node
  useEffect(() => {
    if (nodes.length > 0 && !startNodeId) {
      setStartNodeId(nodes[0].id);
    }
  }, [nodes.length, startNodeId]);

  // --- Dijkstra Traversal ---
  const runAlgorithm = async () => {
    if (isRunning || !startNodeId || nodes.length === 0) return;
    
    setIsRunning(true);
    isRunningRef.current = true;
    resetAlgoState();

    // Use current state of nodes and edges to ensure latest graph is used
    const currentGraph = { 
      nodes: [...nodes], 
      edges: edges.map(edge => ({
        from: edge.u,
        to: edge.v,
        weight: edge.weight
      }))
    };

    const gen = dijkstra(currentGraph, startNodeId);

    for (const state of gen) {
      if (!isRunningRef.current) return;

      setDistances({ ...state.distances });
      setVisited(new Set(state.doneNodes || []));
      setPrevious({ ...state.prev });
      setActiveNode(state.current);
      setFrontier([...(state.pq || []).map(item => item.id)]);
      setCurrentStep(state.description);

      await sleep();
    }

    setIsRunning(false);
    isRunningRef.current = false;
  };

  const showPathTo = (targetId) => {
    if (isRunning || !distances[targetId] || distances[targetId] === Infinity) return;
    const path = [];
    let curr = targetId;
    const prev = { ...previous }; // Use current previous state
    while (curr) {
      path.push(curr);
      curr = prev[curr];
      if (curr && path.includes(curr)) break; // Prevent infinite loop
    }
    setFinalPath(path.reverse());
    const label = nodes.find(n => n.id === targetId)?.label;
    setCurrentStep(`Shortest path to Node ${label} highlighted. Total Weight: ${distances[targetId]}`);
  };

  const resetAll = () => {
    // Reset to initial nodes with proper labels
    const initialNodesWithLabels = INITIAL_NODES.map((node, index) => ({
      ...node,
      label: getAlphabeticLabel(index)
    }));
    resetGraph(initialNodesWithLabels, INITIAL_EDGES);
    setStartNodeId(initialNodesWithLabels[0].id);
  };

  const clearAll = clearGraph;

  const stats = { 
    visitedNodes: visited.size,
    totalNodes: nodes.length,
    currentStep: currentStep
  };



  // === Compute highlight objects for rendering ===
  const highlightNodes = {};
  
  // Build adjacency list to find reachable nodes
  const buildReachableNodes = () => {
    const reachable = new Set();
    const queue = [startNodeId];
    reachable.add(startNodeId);
    
    while (queue.length > 0) {
      const currentId = queue.shift();
      // Find all neighbors (both outgoing and incoming edges for undirected interpretation)
      const neighbors = new Set();
      edges.forEach(edge => {
        if (edge.u === currentId) neighbors.add(edge.v);
        if (edge.v === currentId) neighbors.add(edge.u);
      });
      
      neighbors.forEach(neighborId => {
        if (!reachable.has(neighborId)) {
          reachable.add(neighborId);
          queue.push(neighborId);
        }
      });
    }
    
    return reachable;
  };
  
  const reachableNodes = startNodeId ? buildReachableNodes() : new Set();
  const unreachableNodes = nodes.filter(n => !reachableNodes.has(n.id));
  
  // Show warning if there are unreachable nodes
  useEffect(() => {
    if (unreachableNodes.length > 0 && !isRunning) {
      const unreachableLabels = unreachableNodes.map(n => n.label).join(', ');
      setCurrentStep(`⚠️ Unreachable nodes: ${unreachableLabels}. Connect them to the main graph to include in traversal.`);
    }
  }, [unreachableNodes, isRunning]);
  
  // Highlight start node
  if (startNodeId) {
    highlightNodes[startNodeId] = {
      fill: COLORS.ironGrey,
      stroke: COLORS.ironGrey,
      textColor: 'white',
      scale: '1.1',
      showLabel: true
    };
  }

  // Highlight active node (currently processing)
  if (activeNode) {
    highlightNodes[activeNode] = {
      fill: COLORS.carbonBlack,
      stroke: COLORS.carbonBlack,
      textColor: 'white',
      scale: '1.2',
      showLabel: true
    };
  }

  // Highlight visited nodes
  visited.forEach(nodeId => {
    if (!highlightNodes[nodeId]) {
      highlightNodes[nodeId] = {
        fill: COLORS.slateGrey,
        stroke: COLORS.slateGrey,
        textColor: 'white',
        scale: '1',
        showLabel: true
      };
    }
  });

  // Highlight frontier nodes (in priority queue)
  frontier.forEach(nodeId => {
    if (!highlightNodes[nodeId]) {
      highlightNodes[nodeId] = {
        fill: COLORS.platinum,
        stroke: COLORS.gunmetal,
        textColor: COLORS.gunmetal,
        scale: '1',
        showLabel: true
      };
    }
  });

  // Highlight final path nodes
  finalPath.forEach(nodeId => {
    if (highlightNodes[nodeId]) {
      highlightNodes[nodeId] = {
        ...highlightNodes[nodeId],
        fill: COLORS.carbonBlack,
        stroke: COLORS.carbonBlack,
        scale: '1.15',
        textColor: 'white'
      };
    }
  });
  
  // Highlight unreachable nodes in light grey (if not running)
  if (!isRunning && unreachableNodes.length > 0) {
    unreachableNodes.forEach(node => {
      if (!highlightNodes[node.id]) {
        highlightNodes[node.id] = {
          fill: COLORS.alabasterGrey,
          stroke: COLORS.paleSlate2,
          textColor: COLORS.paleSlate2,
          scale: '0.9',
          showLabel: true
        };
      }
    });
  }

  // Compute highlight edges for final path
  const highlightEdges = [];
  if (finalPath.length > 1) {
    for (let i = 0; i < finalPath.length - 1; i++) {
      const fromId = finalPath[i];
      const toId = finalPath[i + 1];
      const edgeIdx = edges.findIndex(e => (e.u === fromId && e.v === toId) || (e.u === toId && e.v === fromId));
      if (edgeIdx !== -1) {
        highlightEdges.push(edgeIdx);
      }
    }
  }

  return (
    <div className="flex h-screen bg-[#f8f9faff] text-[#212529] font-sans overflow-hidden">
      <CommonSidebar
        algorithmTitle="Dijkstra's Algorithm"
        algorithmSubtitle="Shortest Path Finder"
        isRunning={isRunning}
        onRunAlgorithm={runAlgorithm}
        onGenerateRandom={resetAll}
        onReset={clearAll}
        speedIndex={speedIndex}
        onSpeedChange={setSpeedIndex}
        currentStep={currentStep}
        stats={stats}
        complexityInfo={dijkstraInfo.complexity}
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
             <ToolButton active={mode === 'ADD'} onClick={() => setMode('ADD')} disabled={isRunning} icon={<Plus size={16}/>} label="Add Node" desc="Place new vertices" />
             <ToolButton active={mode === 'LINK'} onClick={() => setMode('LINK')} disabled={isRunning} icon={<LinkIcon size={16}/>} label="Connect" desc="Create weighted edges" />
             <ToolButton active={mode === 'START'} onClick={() => setMode('START')} disabled={isRunning} icon={<Circle size={14}/>} label="Start Node" desc="Source for calculation" />
             <ToolButton active={mode === 'DELETE'} onClick={() => setMode('DELETE')} disabled={isRunning} icon={<Trash2 size={16}/>} label="Delete" desc="Remove elements" danger />
          </div>
        </div>

        <DistanceTable
          nodes={nodes}
          distances={distances}
          previous={previous}
          activeNode={activeNode}
          showPathTo={showPathTo}
        />
      </CommonSidebar>

      {/* Main Workspace */}
      <main className="flex-1 relative bg-[#f8f9faff] overflow-hidden" onClick={handleCanvasClick}>
        <GraphCanvas
          nodes={nodes}
          edges={edges}
          highlightNodes={highlightNodes}
          highlightEdges={highlightEdges}
          handleCanvasClick={handleCanvasClick}
          handleNodeClick={handleNodeClick}
          svgRef={svgRef}
          showArrows={true}
        />

        {/* Legend Overlay */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 px-8 py-4 bg-white/90 backdrop-blur-sm border border-[#dee2e6] rounded-3xl shadow-2xl">
           <div className="flex items-center gap-8">
              <LegendItem color={COLORS.carbonBlack} label="Active / Final Path" />
              <LegendItem color={COLORS.slateGrey} label="Settled (Visited)" />
              <LegendItem color={COLORS.platinum} label="Frontier (In PQ)" />
              <LegendItem color={COLORS.alabasterGrey} label="Unreachable" />
              <LegendItem color="white" label="Unvisited" border />
           </div>
           <div className="w-full h-px bg-[#dee2e6] opacity-50"></div>
           <div className="flex items-center gap-2">
             <Info size={14} className="text-[#adb5bd]" />
             <span className="text-[9px] font-black text-[#adb5bd] uppercase tracking-wide">
                Dijkstra's Algorithm: Arrows show edge direction. Connect isolated nodes to include in traversal.
             </span>
           </div>
        </div>
      </main>
    </div>
  );
};



export default DijkstraVisualization;