import { useEffect, useState } from "react";
import { leadScoringAPI, type LeadScoringResult, type ScoredAccount } from "@/lib/predict";
import { toast } from "sonner";
import { Trophy, TrendingUp, Users, Building2, DollarSign, Target } from "lucide-react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function LeadScoringTable() {
	const [scoringData, setScoringData] = useState<LeadScoringResult | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchScoring = async () => {
			try {
				const data = await leadScoringAPI();
				setScoringData(data);
			} catch (error) {
				toast.error("Failed to load lead scoring data");
			} finally {
				setIsLoading(false);
			}
		};
		fetchScoring();
	}, []);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center p-8">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
			</div>
		);
	}

	if (!scoringData || scoringData.accounts.length === 0) {
		return (
			<Card className="p-6">
				<p className="text-muted-foreground text-center">No accounts in Prospecting stage</p>
			</Card>
		);
	}

	const highPotential = scoringData.accounts.filter((a) => a.conversion_potential === "High");
	const avgProbability = scoringData.accounts.reduce((sum, a) => sum + a.probability, 0) / scoringData.accounts.length;

	const getProbabilityColor = (prob: number) => {
		if (prob >= 60) return "bg-green-500";
		if (prob >= 45) return "bg-yellow-500";
		return "bg-red-500";
	};

	const getBadgeVariant = (potential: string) => {
		if (potential === "High") return "default";
		return "secondary";
	};

	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Prospects</CardTitle>
						<Users className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{scoringData.total_prospecting}</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">High Potential</CardTitle>
						<Trophy className="h-4 w-4 text-green-500" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{highPotential.length}</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Avg Score</CardTitle>
						<Target className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{avgProbability.toFixed(1)}%</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Est. Pipeline Value</CardTitle>
						<DollarSign className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							${scoringData.accounts.reduce((sum, a) => sum + a.revenue, 0).toLocaleString()}M
						</div>
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<TrendingUp className="h-5 w-5" />
						Intelligent Lead Scoring - Prospecting Accounts
					</CardTitle>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Rank</TableHead>
								<TableHead>Account</TableHead>
								<TableHead>Sector</TableHead>
								<TableHead>Sales Agent</TableHead>
								<TableHead>Revenue</TableHead>
								<TableHead>Score</TableHead>
								<TableHead>Potential</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{scoringData.accounts.map((account) => (
								<TableRow key={account.opportunity_id}>
									<TableCell className="font-medium">
										<Badge variant="outline">#{account.rank}</Badge>
									</TableCell>
									<TableCell className="font-medium">{account.account}</TableCell>
									<TableCell>{account.sector}</TableCell>
									<TableCell>{account.sales_agent}</TableCell>
									<TableCell>${account.revenue.toLocaleString()}M</TableCell>
									<TableCell>
										<div className="flex items-center gap-2">
											<Progress
												value={account.probability}
												className="h-2 w-16"
												indicatorClassName={getProbabilityColor(account.probability)}
											/>
											<span className="text-sm font-medium">{account.probability}%</span>
										</div>
									</TableCell>
									<TableCell>
										<Badge variant={getBadgeVariant(account.conversion_potential)}>
											{account.conversion_potential}
										</Badge>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	);
}
