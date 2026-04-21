import type { LeadData } from "@/components/LeadForm";

interface PredictionResult {
	prediction: number;
	label: string;
	probability: number;
	error?: string;
}

export interface ScoredAccount {
	opportunity_id: string;
	account: string;
	sector: string;
	sales_agent: string;
	product: string;
	revenue: number;
	employees: number;
	company_age: number;
	engage_date: string;
	probability: number;
	conversion_potential: "High" | "Low";
	rank: number;
}

export interface LeadScoringResult {
	accounts: ScoredAccount[];
	total_prospecting: number;
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

export async function leadScoringAPI(): Promise<LeadScoringResult> {
	const API_URL = window.location.origin;

	const response = await fetch(`${API_URL}/api/prospecting-accounts`);

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.error || "Failed to fetch prospecting data");
	}

	const data = await response.json();

	const accounts: ScoredAccount[] = data.accounts.map(
		(acc: Record<string, unknown>, index: number) => ({
			opportunity_id: acc.opportunity_id as string,
			account: (acc.account as string) || "Unknown",
			sector: (acc.sector as string) || "Unknown",
			sales_agent: acc.sales_agent as string || "Unknown",
			product: acc.product as string || "Unknown",
			revenue: (acc.revenue as number) || 0,
			employees: (acc.employees as number) || 50,
			company_age: acc.year_established
				? new Date().getFullYear() - (acc.year_established as number)
				: 10,
			engage_date: acc.engage_date as string || "",
			probability: (acc.probability as number) || 50,
			conversion_potential:
				(acc.probability as number) >= 45
					? ("High" as const)
					: ("Low" as const),
			rank: index + 1,
		})
	);

	accounts.sort((a, b) => b.probability - a.probability);
	accounts.forEach((acc, idx) => (acc.rank = idx + 1));

	return {
		accounts,
		total_prospecting: data.total_prospecting,
	};
}
