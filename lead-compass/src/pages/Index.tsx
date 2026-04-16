import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Target } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import LeadForm, { type LeadData } from "@/components/LeadForm";
import PredictionOutput from "@/components/PredictionOutput";
import WelcomeScreen from "@/components/WelcomeScreen";
import { predictAPI } from "@/lib/predict";

const defaultLead: LeadData = {
  revenue: 55000,
  employees: 50,
  sales_agent: "",
  product: "",
  sector: "",
  office_location: "",
  company_age: 0,
  manager: "",
  series: "",
  engage_date: "",
};

export default function Index() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [lead, setLead] = useState<LeadData>(defaultLead);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handlePredict = () => {
    predictAPI(lead).then((result) => {
      setPrediction(result);
      setDialogOpen(true);
    });
  };

  if (showWelcome) {
    return <WelcomeScreen onEnter={() => setShowWelcome(false)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="gradient-hero text-primary-foreground">
        <div className="container max-w-3xl mx-auto px-4 py-12 md:py-16">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/20 backdrop-blur-sm">
              <Target className="h-5 w-5 text-accent" />
            </div>
            <span className="text-sm font-medium text-accent tracking-wide uppercase">
              Everest Team · AI-Powered
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
            Lead Conversion Predictor
          </h1>
          <p className="text-lg text-primary-foreground/70 max-w-xl">
            Turn your leads into insights. Score prospects, understand key
            drivers, and get actionable recommendations.
          </p>
        </div>
      </header>

      {/* Main Content - Single Column Sequential */}
      <main className="container max-w-3xl mx-auto px-4 -mt-6 pb-16">
        <div className="space-y-5">
          <LeadForm data={lead} onChange={(d) => setLead(d)} />

          {/* Predict Button */}
          <Button
            onClick={handlePredict}
            size="lg"
            className="w-full text-base font-bold h-13 gradient-accent text-accent-foreground hover:opacity-90 transition-opacity shadow-elevated"
          >
            <Sparkles className="h-5 w-5 mr-2" />
            Predict Conversion
          </Button>
        </div>
      </main>

      {/* Prediction Result Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto p-0 gap-0">
          <DialogTitle className="sr-only">Prediction Result</DialogTitle>
          <div className="p-6">
            <PredictionOutput
              probability={prediction ?? 0}
              data={lead}
              visible={true}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
