// src/lib/cytoscape-config.js
// Configuration for Cytoscape.js graph visualization

/**
 * Default Cytoscape configuration
 */
export const cytoscapeConfig = {
  minZoom: 0.1,
  maxZoom: 3,
  zoomingEnabled: true,
  userZoomingEnabled: true,
  panningEnabled: true,
  userPanningEnabled: true,
  boxSelectionEnabled: false,
  selectionType: 'single',
  touchTapThreshold: 8,
  desktopTapThreshold: 4,
}

/**
 * Custom node styles
 */
export const nodeStyles = [
  {
    selector: 'node',
    style: {
      'width': 40,
      'height': 40,
      'background-color': '#3b82f6', // blue-500
      'label': 'data(id)',
      'color': '#ffffff',
      'text-valign': 'center',
      'text-halign': 'center',
      'font-weight': 'bold',
      'border-width': 2,
      'border-color': '#1d4ed8', // blue-700
      'text-outline-width': 2,
      'text-outline-color': '#3b82f6',
    }
  },
  {
    selector: 'node.current',
    style: {
      'background-color': '#f59e0b', // amber-500
      'border-color': '#b45309', // amber-700
    }
  },
  {
    selector: 'node.visiting',
    style: {
      'background-color': '#8b5cf6', // violet-500
      'border-color': '#6d28d9', // violet-700
    }
  },
  {
    selector: 'node.frontier',
    style: {
      'background-color': '#fbbf24', // amber-400
      'border-color': '#f59e0b', // amber-500
    }
  },
  {
    selector: 'node.done',
    style: {
      'background-color': '#10b981', // emerald-500
      'border-color': '#047857', // emerald-700
    }
  },
  {
    selector: 'node.shortest-path',
    style: {
      'background-color': '#10b981', // emerald-500
      'border-color': '#047857', // emerald-700
    }
  }
]

/**
 * Custom edge styles
 */
export const edgeStyles = [
  {
    selector: 'edge',
    style: {
      'width': 3,
      'line-color': '#9ca3af', // gray-400
      'target-arrow-color': '#9ca3af',
      'target-arrow-shape': 'triangle',
      'curve-style': 'bezier',
      'label': 'data(weight)',
      'color': '#4b5563', // gray-600
      'font-size': 12,
      'text-background-color': '#ffffff',
      'text-background-opacity': 1,
      'text-background-padding': 2,
    }
  },
  {
    selector: 'edge.visited',
    style: {
      'line-color': '#3b82f6', // blue-500
      'target-arrow-color': '#3b82f6',
      'width': 4,
    }
  },
  {
    selector: 'edge.examined',
    style: {
      'line-color': '#f59e0b', // amber-500
      'target-arrow-color': '#f59e0b',
      'width': 4,
    }
  },
  {
    selector: 'edge.shortest-path',
    style: {
      'line-color': '#10b981', // emerald-500
      'target-arrow-color': '#10b981',
      'width': 5,
    }
  }
]

/**
 * Layout configurations
 */
export const layouts = {
  breadthfirst: {
    name: 'breadthfirst',
    directed: true,
    padding: 10,
    spacingFactor: 1.2,
    avoidOverlap: true,
    nodeDimensionsIncludeLabels: true,
    ready: function() {}, // Add ready callback
    stop: function() {}   // Add stop callback
  },
  cose: {
    name: 'cose',
    animate: true,
    animationDuration: 1000,
    animationEasing: 'ease-out',
    padding: 10,
    nodeDimensionsIncludeLabels: true,
    ready: function() {}, // Add ready callback
    stop: function() {}   // Add stop callback
  },
  circle: {
    name: 'circle',
    padding: 10,
    spacingFactor: 1.2,
    nodeDimensionsIncludeLabels: true,
    ready: function() {}, // Add ready callback
    stop: function() {}   // Add stop callback
  },
  grid: {
    name: 'grid',
    padding: 10,
    nodeDimensionsIncludeLabels: true,
    ready: function() {}, // Add ready callback
    stop: function() {}   // Add stop callback
  },
  dagre: {
    name: 'dagre',
    padding: 10,
    nodeDimensionsIncludeLabels: true,
    ready: function() {}, // Add ready callback
    stop: function() {}   // Add stop callback
  },
  cola: {
    name: 'cola',
    animate: true,
    padding: 10,
    nodeDimensionsIncludeLabels: true,
    ready: function() {}, // Add ready callback
    stop: function() {}   // Add stop callback
  }
}

/**
 * Animation settings
 */
export const animationSettings = {
  duration: 500,
  easing: 'ease-in-out',
}

/**
 * Helper function to convert adjacency list to Cytoscape elements
 * @param {Object} adjacencyList - Adjacency list representation of graph
 * @returns {Array} - Cytoscape elements array
 */
export const convertAdjacencyListToCytoscape = (adjacencyList) => {
  // Guard clause for empty input
  if (!adjacencyList || typeof adjacencyList !== 'object') {
    return []
  }
  
  const elements = []
  const addedNodes = new Set()
  
  // Add nodes
  Object.keys(adjacencyList).forEach(nodeId => {
    if (!addedNodes.has(nodeId)) {
      elements.push({
        data: { id: nodeId, label: nodeId },
        group: 'nodes'
      })
      addedNodes.add(nodeId)
    }
    
    // Add neighbors as nodes and edges
    if (Array.isArray(adjacencyList[nodeId])) {
      adjacencyList[nodeId].forEach(neighbor => {
        const neighborId = typeof neighbor === 'object' ? neighbor.id : neighbor
        if (!addedNodes.has(neighborId)) {
          elements.push({
            data: { id: neighborId, label: neighborId },
            group: 'nodes'
          })
          addedNodes.add(neighborId)
        }
        
        // Add edge (avoid duplicates for undirected graphs)
        const edgeId = `${nodeId}-${neighborId}`
        const reverseEdgeId = `${neighborId}-${nodeId}`
        if (!elements.some(el => el.data.id === edgeId || el.data.id === reverseEdgeId)) {
          elements.push({
            data: { 
              id: edgeId, 
              source: nodeId, 
              target: neighborId,
              weight: typeof neighbor === 'object' ? neighbor.weight || 1 : 1
            },
            group: 'edges'
          })
        }
      })
    }
  })
  
  return elements
}

/**
 * Helper function to convert Cytoscape elements to adjacency list
 * @param {Array} cytoscapeElements - Cytoscape elements array
 * @returns {Object} - Adjacency list representation
 */
export const convertCytoscapeToAdjacencyList = (cytoscapeElements) => {
  // Guard clause for empty input
  if (!Array.isArray(cytoscapeElements)) {
    return {}
  }
  
  const adjacencyList = {}
  
  // Initialize nodes
  cytoscapeElements
    .filter(element => element.group === 'nodes')
    .forEach(node => {
      adjacencyList[node.data.id] = []
    })
  
  // Add edges
  cytoscapeElements
    .filter(element => element.group === 'edges')
    .forEach(edge => {
      const source = edge.data.source
      const target = edge.data.target
      
      if (!adjacencyList[source]) adjacencyList[source] = []
      if (!adjacencyList[target]) adjacencyList[target] = []
      
      adjacencyList[source].push({
        id: target,
        weight: edge.data.weight || 1
      })
    })
  
  return adjacencyList
}

/**
 * Helper function to create sample graphs
 * @returns {Object} - Sample graphs collection
 */
export const createSampleGraphs = () => {
  return {
    tree: {
      name: 'Binary Tree',
      elements: [
        { data: { id: 'A', label: 'A' }, group: 'nodes' },
        { data: { id: 'B', label: 'B' }, group: 'nodes' },
        { data: { id: 'C', label: 'C' }, group: 'nodes' },
        { data: { id: 'D', label: 'D' }, group: 'nodes' },
        { data: { id: 'E', label: 'E' }, group: 'nodes' },
        { data: { id: 'F', label: 'F' }, group: 'nodes' },
        { data: { id: 'G', label: 'G' }, group: 'nodes' },
        { data: { id: 'A-B', source: 'A', target: 'B' }, group: 'edges' },
        { data: { id: 'A-C', source: 'A', target: 'C' }, group: 'edges' },
        { data: { id: 'B-D', source: 'B', target: 'D' }, group: 'edges' },
        { data: { id: 'B-E', source: 'B', target: 'E' }, group: 'edges' },
        { data: { id: 'C-F', source: 'C', target: 'F' }, group: 'edges' },
        { data: { id: 'C-G', source: 'C', target: 'G' }, group: 'edges' },
      ]
    },
    complete: {
      name: 'Complete Graph',
      elements: [
        { data: { id: '1', label: '1' }, group: 'nodes' },
        { data: { id: '2', label: '2' }, group: 'nodes' },
        { data: { id: '3', label: '3' }, group: 'nodes' },
        { data: { id: '4', label: '4' }, group: 'nodes' },
        { data: { id: '1-2', source: '1', target: '2' }, group: 'edges' },
        { data: { id: '1-3', source: '1', target: '3' }, group: 'edges' },
        { data: { id: '1-4', source: '1', target: '4' }, group: 'edges' },
        { data: { id: '2-3', source: '2', target: '3' }, group: 'edges' },
        { data: { id: '2-4', source: '2', target: '4' }, group: 'edges' },
        { data: { id: '3-4', source: '3', target: '4' }, group: 'edges' },
      ]
    },
    cycle: {
      name: 'Cycle Graph',
      elements: [
        { data: { id: 'A', label: 'A' }, group: 'nodes' },
        { data: { id: 'B', label: 'B' }, group: 'nodes' },
        { data: { id: 'C', label: 'C' }, group: 'nodes' },
        { data: { id: 'D', label: 'D' }, group: 'nodes' },
        { data: { id: 'A-B', source: 'A', target: 'B' }, group: 'edges' },
        { data: { id: 'B-C', source: 'B', target: 'C' }, group: 'edges' },
        { data: { id: 'C-D', source: 'C', target: 'D' }, group: 'edges' },
        { data: { id: 'D-A', source: 'D', target: 'A' }, group: 'edges' },
      ]
    }
  }
}

export default {
  cytoscapeConfig,
  nodeStyles,
  edgeStyles,
  layouts,
  animationSettings,
  convertAdjacencyListToCytoscape,
  convertCytoscapeToAdjacencyList,
  createSampleGraphs
}