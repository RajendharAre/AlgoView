import { useState, useEffect, useRef } from 'react';
import { SPEEDS } from '../../../../../constants/visualizationConstants';

/**
 * Reusable hook for graph algorithm visualization management
 * Handles common graph operations, state management, and UI interactions
 */
export const useGraphManagement = (initialNodes, initialEdges, onResetAlgorithmState) => {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [mode, setMode] = useState('ADD');
  const [isRunning, setIsRunning] = useState(false);
  const [speedIndex, setSpeedIndex] = useState(1);
  const [linkSource, setLinkSource] = useState(null);
  
  const speedRef = useRef(SPEEDS[1].value);
  const isRunningRef = useRef(false);
  const svgRef = useRef(null);
  const resetCallbackRef = useRef(onResetAlgorithmState);

  // Speed management
  useEffect(() => {
    speedRef.current = SPEEDS[speedIndex].value;
  }, [speedIndex]);

  // Update reset callback ref when it changes
  useEffect(() => {
    resetCallbackRef.current = onResetAlgorithmState;
  }, [onResetAlgorithmState]);

  // Reset algorithm state when graph changes
  useEffect(() => {
    if (nodes.length > 0 && resetCallbackRef.current) {
      resetCallbackRef.current();
    }
  }, [nodes.length, edges.length]);

  // Graph Management Functions
  const handleCanvasClick = (e) => {
    if (isRunning || mode !== 'ADD') return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newNode = { 
      id: nodes.length, 
      x, 
      y, 
      label: nodes.length.toString() 
    };
    
    setNodes([...nodes, newNode]);
  };

  const handleNodeClick = (e, node) => {
    e.stopPropagation();
    if (isRunning) return;

    if (mode === 'DELETE') {
      const newNodes = nodes.filter(n => n.id !== node.id).map((n, i) => ({ ...n, id: i, label: i.toString() }));
      setNodes(newNodes);
      setEdges(edges.filter(edge => edge.u !== node.id && edge.v !== node.id).map(edge => {
        const newU = edge.u > node.id ? edge.u - 1 : edge.u;
        const newV = edge.v > node.id ? edge.v - 1 : edge.v;
        return { ...edge, u: newU, v: newV };
      }));
    } else if (mode === 'LINK') {
      if (!linkSource) {
        setLinkSource(node.id);
      } else if (linkSource !== node.id) {
        const exists = edges.some(edge => (edge.u === linkSource && edge.v === node.id) || (edge.u === node.id && edge.v === linkSource));
        if (!exists) {
          const weight = Math.floor(Math.random() * 10) + 1;
          setEdges([...edges, { u: linkSource, v: node.id, weight }]);
        }
        setLinkSource(null);
      }
    }
  };

  const resetGraph = (newNodes = initialNodes, newEdges = initialEdges) => {
    setNodes(newNodes);
    setEdges(newEdges);
    if (resetCallbackRef.current) {
      resetCallbackRef.current();
    }
  };

  const clearGraph = () => {
    setNodes([]);
    setEdges([]);
    if (resetCallbackRef.current) {
      resetCallbackRef.current();
    }
  };

  const sleep = () => new Promise(r => setTimeout(r, speedRef.current));

  return {
    // State
    nodes,
    edges,
    mode,
    isRunning,
    speedIndex,
    linkSource,
    svgRef,
    isRunningRef,
    
    // Setters
    setNodes,
    setEdges,
    setMode,
    setIsRunning,
    setSpeedIndex,
    setLinkSource,
    
    // Functions
    handleCanvasClick,
    handleNodeClick,
    resetGraph,
    clearGraph,
    sleep
  };
};