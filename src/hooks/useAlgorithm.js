/* eslint-disable react-hooks/exhaustive-deps */
// src/hooks/useAlgorithm.js
import { useState, useCallback, useRef, useEffect } from 'react'

export const useAlgorithm = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [steps, setSteps] = useState([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(500)
  const animationRef = useRef(null)

  // Clear animation on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current)
      }
    }
  }, [])

  const executeAlgorithm = useCallback(async algorithmGenerator => {
    console.log('Executing algorithm')
    console.log('Algorithm generator:', algorithmGenerator)
    reset()

    try {
      const newSteps = []
      let result = algorithmGenerator.next()
      console.log('First result:', result)

      while (!result.done) {
        newSteps.push({
          ...result.value,
          stepIndex: newSteps.length,
        })
        result = algorithmGenerator.next()
      }

      setSteps(newSteps)
      console.log('Generated', newSteps.length, 'steps')
      console.log('Steps:', newSteps)
      return newSteps
    } catch (error) {
      console.error('Algorithm execution error:', error)
      return []
    }
  }, [])

  const play = useCallback(() => {
    console.log('Play called - current:', currentStepIndex, 'total:', steps.length)

    if (currentStepIndex >= steps.length - 1) {
      console.log('Resetting to start because we reached the end')
      setCurrentStepIndex(0)
    }

    setIsPlaying(true)
  }, [currentStepIndex, steps.length])

  // This useEffect handles the actual animation when isPlaying changes
  useEffect(() => {
    if (isPlaying && steps.length > 0) {
      console.log('Starting animation with speed:', speed)

      const playNextStep = () => {
        if (currentStepIndex < steps.length - 1 && isPlaying) {
          setCurrentStepIndex(prev => {
            const nextStep = prev + 1
            console.log('Animating to step:', nextStep)
            return nextStep
          })
        } else {
          console.log('Animation completed or paused')
          setIsPlaying(false)
        }
      }

      // Clear any existing timeout
      if (animationRef.current) {
        clearTimeout(animationRef.current)
      }

      // Start the animation loop
      animationRef.current = setTimeout(playNextStep, speed)
    } else {
      // Clear timeout when not playing
      if (animationRef.current) {
        clearTimeout(animationRef.current)
        animationRef.current = null
      }
    }

    // Cleanup on unmount or when dependencies change
    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current)
      }
    }
  }, [isPlaying, currentStepIndex, steps.length, speed])

  const pause = useCallback(() => {
    console.log('Pause called')
    setIsPlaying(false)
  }, [])

  const reset = useCallback(() => {
    console.log('Reset called')
    setIsPlaying(false)
    setCurrentStepIndex(0)
    setSteps([])
  }, [])

  const goToStep = useCallback(stepIndex => {
    console.log('Going to step:', stepIndex)
    setCurrentStepIndex(stepIndex)
  }, [])

  return {
    currentStep: steps[currentStepIndex],
    currentStepIndex,
    totalSteps: steps.length,
    isPlaying,
    speed,
    setSpeed,
    executeAlgorithm,
    play,
    pause,
    reset,
    goToStep,
    hasSteps: steps.length > 0,
  }
}
