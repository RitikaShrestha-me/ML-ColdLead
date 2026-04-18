import type { LeadData } from "@/components/LeadForm";

interface PredictionResult {
	prediction: number;
	label: string;
	probability: number;
	error?: string;
}

export async function predictAPI(data: LeadData): Promise<number> {
	const API_URL = window.location.origin;

	const response = await fetch(`${API_URL}/api/predict`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			revenue: data.revenue,
			employees: data.employees || 50,
			sales_agent: data.sales_agent,
			product: data.product,
			sector: data.sector,
			office_location: data.office_location,
			company_age: data.company_age,
			manager: data.manager || "Unknown",
			series: data.series || "Unknown",
			sales_price: 1000,
			regional_office: "Unknown",
			engage_date: data.engage_date,
		}),
	});

	const result: PredictionResult = await response.json();

	if (!response.ok) {
		throw new Error(result.error || "Prediction failed");
	}

	return result.probability;
}
