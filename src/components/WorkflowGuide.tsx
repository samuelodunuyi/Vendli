
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CheckCircle, Circle, ArrowRight, ArrowLeft, X, HelpCircle } from "lucide-react";
import { useWorkflowGuide, WorkflowStep } from "@/hooks/useWorkflowGuide";

interface WorkflowGuideProps {
  title: string;
  description: string;
  steps: WorkflowStep[];
  isVisible: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

export function WorkflowGuide({
  title,
  description,
  steps,
  isVisible,
  onClose,
  children
}: WorkflowGuideProps) {
  const {
    currentStep,
    completedSteps,
    isGuideActive,
    currentStepData,
    progress,
    startGuide,
    nextStep,
    previousStep,
    skipStep,
    endGuide,
    isLastStep,
    isFirstStep
  } = useWorkflowGuide(steps);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {title}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Follow these steps to complete the task safely and accurately</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {!isGuideActive ? (
            <div className="space-y-4">
              <div className="grid gap-3">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <Circle className="h-5 w-5 text-gray-400" />
                    <div className="flex-1">
                      <div className="font-medium">{step.title}</div>
                      <div className="text-sm text-gray-600">{step.description}</div>
                    </div>
                    {step.optional && (
                      <Badge variant="secondary" className="text-xs">Optional</Badge>
                    )}
                  </div>
                ))}
              </div>
              <Button onClick={startGuide} className="w-full">
                Start Guided Process
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Step {currentStep + 1} of {steps.length}</span>
                  <span>{Math.round(progress)}% Complete</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {currentStep + 1}
                  </div>
                  <h3 className="font-semibold text-blue-900">{currentStepData?.title}</h3>
                  {currentStepData?.optional && (
                    <Badge variant="outline" className="text-xs">Optional</Badge>
                  )}
                </div>
                <p className="text-blue-800">{currentStepData?.description}</p>
              </div>

              {children && (
                <div className="border rounded-lg p-4">
                  {children}
                </div>
              )}

              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={previousStep}
                  disabled={isFirstStep}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </Button>

                <div className="flex items-center gap-2">
                  {currentStepData?.optional && (
                    <Button variant="ghost" onClick={skipStep}>
                      Skip
                    </Button>
                  )}
                  <Button onClick={nextStep} className="flex items-center gap-2">
                    {isLastStep ? "Complete" : "Next"}
                    {!isLastStep && <ArrowRight className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 pt-4 border-t">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center gap-1">
                    {completedSteps.includes(step.id) ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : index === currentStep ? (
                      <Circle className="h-4 w-4 text-blue-600 fill-blue-600" />
                    ) : (
                      <Circle className="h-4 w-4 text-gray-300" />
                    )}
                    <span className="text-xs truncate">{step.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
