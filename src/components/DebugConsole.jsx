// src/components/DebugConsole.jsx
import { useAlgorithm } from '../hooks/useAlgorithm';

const DebugConsole = () => {
  const { currentStepIndex, totalSteps, isPlaying, hasSteps } = useAlgorithm();
  
  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white p-3 rounded-lg text-xs">
      <div>Current Step: {currentStepIndex}</div>
      <div>Total Steps: {totalSteps}</div>
      <div>Is Playing: {isPlaying ? 'Yes' : 'No'}</div>
      <div>Has Steps: {hasSteps ? 'Yes' : 'No'}</div>
      <div>Algorithm Ready: {hasSteps ? '✅' : '❌'}</div>
    </div>
  );
};

export default DebugConsole;