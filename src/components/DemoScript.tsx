import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const demoSteps = [
  {
    title: "Welcome to AssetFlow",
    content: "AssetFlow is an intelligent equipment monitoring system that helps you manage and track your assets efficiently.",
    route: "/dashboard"
  },
  {
    title: "Asset Management",
    content: "View and manage all your equipment in one place. Add new assets, update their status, and track their location.",
    route: "/assets"
  },
  {
    title: "Asset Categories",
    content: "Assets are organized by categories like Heavy Equipment, Office Equipment, IT Equipment, and Vehicles for easy management.",
    route: "/assets"
  },
  {
    title: "Location Tracking",
    content: "Keep track of where your assets are located across different facilities and locations.",
    route: "/assets"
  },
  {
    title: "Maintenance Records",
    content: "View and manage maintenance history for each asset. Schedule upcoming maintenance and track costs.",
    route: "/inspections"
  },
  {
    title: "Reports",
    content: "Generate reports to analyze asset utilization, maintenance costs, and track warranty information.",
    route: "/reports"
  }
];

export function DemoScript() {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Navigate to the current step's route
    navigate(demoSteps[currentStep].route);
  }, [currentStep, navigate]);

  const handleNext = () => {
    if (currentStep < demoSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      toast({
        title: demoSteps[currentStep + 1].title,
        description: "Moving to next feature...",
      });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    toast({
      title: "Demo Complete",
      description: "Thank you for exploring AssetFlow!",
    });
    navigate("/dashboard");
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <Card className="w-[400px] bg-white/95 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg">
            {demoSteps[currentStep].title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            {demoSteps[currentStep].content}
          </p>
          <div className="mt-2 text-sm text-gray-400">
            Step {currentStep + 1} of {demoSteps.length}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            Previous
          </Button>
          {currentStep === demoSteps.length - 1 ? (
            <Button onClick={handleFinish}>Finish</Button>
          ) : (
            <Button onClick={handleNext}>Next</Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}