// src/algorithms/Graph/dfs.js
export function* dfs(graph, startId) {
  const nodes = graph.nodes.map(n => ({ ...n }))
  const edges = graph.edges.map(e => ({ ...e }))
  const visited = new Set()
  const stack = [startId]
  const done = []
  let stepIndex = 0

  yield {
    nodes,
    edges,
    current: null,
    visiting: null,
    stack: [...stack],
    doneNodes: [...done],
    description: `Start DFS at ${startId}`,
    stepIndex: stepIndex++,
  }

  while (stack.length > 0) {
    const u = stack.pop()

    if (!visited.has(u)) {
      visited.add(u)
      yield {
        nodes,
        edges,
        current: u,
        visiting: u,
        stack: [...stack],
        doneNodes: [...done],
        description: `Visiting ${u}`,
        stepIndex: stepIndex++,
      }

      // push neighbors (to simulate recursion order, push reverse)
      const neighbors = edges.filter(e => e.from === u).map(e => e.to)
      for (let i = neighbors.length - 1; i >= 0; i--) {
        const v = neighbors[i]
        if (!visited.has(v)) {
          stack.push(v)
          yield {
            nodes,
            edges,
            current: u,
            visiting: v,
            stack: [...stack],
            doneNodes: [...done],
            description: `Pushed ${v} to stack`,
            stepIndex: stepIndex++,
          }
        } else {
          yield {
            nodes,
            edges,
            current: u,
            visiting: v,
            stack: [...stack],
            doneNodes: [...done],
            description: `${v} already visited`,
            stepIndex: stepIndex++,
          }
        }
      }

      done.push(u)
      yield {
        nodes,
        edges,
        current: null,
        visiting: null,
        stack: [...stack],
        doneNodes: [...done],
        description: `${u} finished`,
        stepIndex: stepIndex++,
      }
    }
  }

  yield {
    nodes,
    edges,
    current: null,
    visiting: null,
    stack: [],
    doneNodes: [...done],
    description: 'DFS complete',
    stepIndex: stepIndex++,
  }
}
