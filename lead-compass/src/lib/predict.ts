import type { LeadData } from "@/components/LeadForm";

export async function predictAPI(data: LeadData): Promise<number> {
  try {
    const response = await fetch("/api/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        revenue: data.revenue, // map correctly
        employees: data.employees || 50, // fallback if not present
        sales_agent: data.sales_agent,
        product: data.product,
        sector: data.sector,
        office_location: data.office_location,
        company_age: data.company_age,
        manager: data.manager,
        series: data.series,
        sales_price: 1000,
        regional_office: "Unknown",
        engage_date: data.engage_date, // IMPORTANT
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Prediction failed");
    }

    return result.probability; // backend returns %
  } catch (error) {
    console.error("API Error:", error);
    return 0;
  }
}
