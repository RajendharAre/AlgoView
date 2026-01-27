import React from 'react';
import { Activity } from 'lucide-react';

const DistanceTable = ({ nodes, distances, previous, activeNode, showPathTo }) => {
  return (
    <div className="p-6 border-b border-[#f1f3f5] space-y-3">
      <h4 className="text-[10px] font-black text-[#adb5bd] uppercase tracking-widest flex items-center gap-2">
        <Activity size={12} /> Distance Map
      </h4>
      <div className="bg-white border border-[#dee2e6] rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-[10px]">
          <thead className="bg-[#f8f9faff] border-b border-[#dee2e6]">
            <tr>
              <th className="px-3 py-2 font-black">Node</th>
              <th className="px-3 py-2 font-black">Distance</th>
              <th className="px-3 py-2 font-black">Parent</th>
            </tr>
          </thead>
          <tbody>
            {nodes.map(n => (
              <tr 
                key={n.id} 
                onClick={() => showPathTo(n.id)} 
                className={`border-b border-[#f1f3f5] cursor-pointer hover:bg-slate-50 ${activeNode === n.id ? 'bg-slate-100 font-bold' : ''}`}
              >
                <td className="px-3 py-2">{n.label}</td>
                <td className="px-3 py-2 font-mono">
                  {distances[n.id] === Infinity ? '∞' : distances[n.id] ?? '-'}
                </td>
                <td className="px-3 py-2">
                  {previous[n.id] ? nodes.find(prev => prev.id === previous[n.id])?.label : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[8px] text-[#adb5bd] italic">* Click a row after traversal to highlight shortest path.</p>
    </div>
  );
};

export default DistanceTable;