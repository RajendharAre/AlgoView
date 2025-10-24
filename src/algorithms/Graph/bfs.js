// src/algorithms/Graph/bfs.js
export function* bfs(graph, startId) {
  // graph: { nodes: [{id,label,x,y}], edges: [{from,to}] }
  const nodes = graph.nodes.map(n => ({ ...n }))
  const edges = graph.edges.map(e => ({ ...e }))
  const visited = new Set()
  const q = []
  const done = []

  q.push(startId)
  visited.add(startId)

  let stepIndex = 0

  // initial state
  yield {
    nodes,
    edges,
    current: null,
    visiting: null,
    frontier: [...q],
    doneNodes: [...done],
    description: `Start BFS at ${startId}`,
    stepIndex: stepIndex++,
  }

  while (q.length > 0) {
    const u = q.shift()
    yield {
      nodes,
      edges,
      current: u,
      visiting: u,
      frontier: [...q],
      doneNodes: [...done],
      description: `Visiting ${u}`,
      stepIndex: stepIndex++,
    }

    // neighbors
    for (const e of edges) {
      if (e.from === u) {
        const v = e.to
        if (!visited.has(v)) {
          visited.add(v)
          q.push(v)
          yield {
            nodes,
            edges,
            current: u,
            visiting: v,
            frontier: [...q],
            doneNodes: [...done],
            description: `Discovered ${v} from ${u}`,
            stepIndex: stepIndex++,
          }
        } else {
          // neighbor already seen - optional step
          yield {
            nodes,
            edges,
            current: u,
            visiting: v,
            frontier: [...q],
            doneNodes: [...done],
            description: `${v} already visited`,
            stepIndex: stepIndex++,
          }
        }
      }
    }

    done.push(u)
    yield {
      nodes,
      edges,
      current: null,
      visiting: null,
      frontier: [...q],
      doneNodes: [...done],
      description: `${u} processed`,
      stepIndex: stepIndex++,
    }
  }

  yield {
    nodes,
    edges,
    current: null,
    visiting: null,
    frontier: [],
    doneNodes: [...done],
    description: 'BFS complete',
    stepIndex: stepIndex++,
  }
}
