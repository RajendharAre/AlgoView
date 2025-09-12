// src/algorithms/Graph/dijkstra.js
export function* dijkstra(graph, startId) {
  // graph: { nodes, edges: {from,to,weight} }
  const nodes = graph.nodes.map(n => ({ ...n }));
  const edges = graph.edges.map(e => ({ ...e }));
  const dist = {};
  const prev = {};
  const pq = []; // simple array-based priority queue (for clarity)
  const done = [];
  let stepIndex = 0;

  for (const n of nodes) {
    dist[n.id] = Infinity;
    prev[n.id] = null;
  }
  dist[startId] = 0;
  pq.push({ id: startId, dist: 0 });

  yield {
    nodes, edges, current: null, visiting: null, pq: [...pq], distances: { ...dist }, doneNodes: [...done],
    description: `Start Dijkstra from ${startId}`, stepIndex: stepIndex++
  };

  while (pq.length > 0) {
    // pop smallest
    pq.sort((a,b)=>a.dist-b.dist);
    const top = pq.shift();
    const u = top.id;
    if (done.includes(u)) continue;

    yield {
      nodes, edges, current: u, visiting: u, pq: [...pq], distances: { ...dist }, doneNodes: [...done],
      description: `Processing node ${u} (dist ${dist[u]})`, stepIndex: stepIndex++
    };

    // neighbors
    for (const e of edges.filter(e => e.from === u)) {
      const v = e.to;
      const alt = dist[u] + (e.weight ?? 1);
      yield {
        nodes, edges, current: u, visiting: v, edge: e, pq: [...pq], distances: { ...dist }, doneNodes: [...done],
        description: `Check ${u} -> ${v} (w=${e.weight ?? 1})`, stepIndex: stepIndex++
      };
      if (alt < dist[v]) {
        dist[v] = alt;
        prev[v] = u;
        pq.push({ id: v, dist: alt });
        yield {
          nodes, edges, current: u, visiting: v, pq: [...pq], distances: { ...dist }, doneNodes: [...done],
          description: `Update dist[${v}] = ${alt}`, stepIndex: stepIndex++
        };
      } else {
        yield {
          nodes, edges, current: u, visiting: v, pq: [...pq], distances: { ...dist }, doneNodes: [...done],
          description: `No update for ${v}`, stepIndex: stepIndex++
        };
      }
    }

    done.push(u);
    yield {
      nodes, edges, current: null, visiting: null, pq: [...pq], distances: { ...dist }, doneNodes: [...done],
      description: `Node ${u} settled`, stepIndex: stepIndex++
    };
  }

  yield { nodes, edges, current: null, visiting: null, pq: [], distances: { ...dist }, doneNodes: [...done], description: 'Dijkstra complete', stepIndex: stepIndex++ };
}
