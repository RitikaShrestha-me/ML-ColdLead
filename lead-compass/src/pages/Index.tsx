import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Target, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import LeadForm, { type LeadData } from "@/components/LeadForm";
import PredictionOutput from "@/components/PredictionOutput";
import WelcomeScreen from "@/components/WelcomeScreen";
import { predictAPI } from "@/lib/predict";
import { toast } from "sonner";

const defaultLead: LeadData = {
	revenue: 55000,
	employees: 50,
	sales_agent: "",
	product: "",
	sector: "",
	office_location: "",
	company_age: 10,
	manager: "",
	series: "",
	engage_date: new Date().toISOString().split('T')[0],
};

export default function Index() {
	const [showWelcome, setShowWelcome] = useState(true);
	const [lead, setLead] = useState<LeadData>(defaultLead);
	const [prediction, setPrediction] = useState<number | null>(null);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const handlePredict = async () => {
		// Validate required fields
		if (!lead.sales_agent || !lead.product || !lead.sector || !lead.office_location || !lead.manager || !lead.series) {
			toast.error("Please fill in all required fields");
			return;
		}

		setIsLoading(true);
		try {
			const result = await predictAPI(lead);
			setPrediction(result);
			setDialogOpen(true);
		} catch (error) {
			toast.error("Failed to get prediction. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	if (showWelcome) {
		return <WelcomeScreen onEnter={() => setShowWelcome(false)} />;
	}

	return (
		<div className="min-h-screen bg-background">
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

			<main className="container max-w-3xl mx-auto px-4 -mt-6 pb-16">
				<div className="space-y-5">
					<LeadForm data={lead} onChange={(d) => setLead(d)} />

					<Button
						onClick={handlePredict}
						size="lg"
						className="w-full text-base font-bold h-13 gradient-accent text-accent-foreground hover:opacity-90 transition-opacity shadow-elevated"
						disabled={isLoading}
					>
						{isLoading ? (
							<span className="flex items-center gap-2">
								<span className="animate-spin">⏳</span> Processing...
							</span>
						) : (
							<>
								<Sparkles className="h-5 w-5 mr-2" />
								Predict Conversion
							</>
						)}
					</Button>
				</div>
			</main>

			<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto p-0 gap-0">
					<DialogTitle className="sr-only">Prediction Result</DialogTitle>
					<div className="p-6">
						{prediction !== null && (
							<PredictionOutput
								probability={prediction}
								data={lead}
								visible={true}
							/>
						)}
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}