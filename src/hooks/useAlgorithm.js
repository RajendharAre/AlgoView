// src/hooks/useAlgorithm.js
import { useState, useCallback, useRef } from 'react';

export const useAlgorithm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);
  const animationRef = useRef(null);

  const executeAlgorithm = useCallback(async (algorithmFn, inputData) => {
    // Reset state
    setCurrentStep(0);
    setIsPlaying(false);
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }

    // Generate steps
    const generator = algorithmFn([...inputData]);
    const newSteps = [];
    
    let result = generator.next();
    while (!result.done) {
      newSteps.push(result.value);
      result = generator.next();
    }
    
    setSteps(newSteps);
    return newSteps;
  }, []);

  const play = useCallback(() => {
    if (currentStep >= steps.length - 1) return;
    
    setIsPlaying(true);
    const playNextStep = () => {
      if (currentStep < steps.length - 1 && isPlaying) {
        setCurrentStep(prev => prev + 1);
        animationRef.current = setTimeout(playNextStep, speed);
      } else {
        setIsPlaying(false);
      }
    };
    
    playNextStep();
  }, [currentStep, steps.length, isPlaying, speed]);

  const pause = useCallback(() => {
    setIsPlaying(false);
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
  }, []);

  const reset = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep(0);
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
  }, []);

  const goToStep = useCallback((stepIndex) => {
    setCurrentStep(stepIndex);
  }, []);

  return {
    currentStep: steps[currentStep],
    totalSteps: steps.length,
    isPlaying,
    speed,
    setSpeed,
    executeAlgorithm,
    play,
    pause,
    reset,
    goToStep,
    hasSteps: steps.length > 0
  };
};