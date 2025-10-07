
import { useState } from "react";

export interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  icon?: string;
  validation?: () => boolean;
  optional?: boolean;
}

export function useWorkflowGuide(steps: WorkflowStep[]) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [isGuideActive, setIsGuideActive] = useState(false);

  const startGuide = () => {
    setCurrentStep(0);
    setCompletedSteps([]);
    setIsGuideActive(true);
  };

  const nextStep = () => {
    const current = steps[currentStep];
    if (current && (!current.validation || current.validation())) {
      setCompletedSteps(prev => [...prev, current.id]);
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        setIsGuideActive(false);
      }
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipStep = () => {
    const current = steps[currentStep];
    if (current && current.optional) {
      nextStep();
    }
  };

  const endGuide = () => {
    setIsGuideActive(false);
    setCurrentStep(0);
    setCompletedSteps([]);
  };

  return {
    currentStep,
    completedSteps,
    isGuideActive,
    currentStepData: steps[currentStep],
    progress: ((currentStep + 1) / steps.length) * 100,
    startGuide,
    nextStep,
    previousStep,
    skipStep,
    endGuide,
    isLastStep: currentStep === steps.length - 1,
    isFirstStep: currentStep === 0
  };
}
