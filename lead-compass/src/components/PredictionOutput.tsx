import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle2,
  XCircle,
  TrendingUp,
  TrendingDown,
  Lightbulb,
  Brain,
  BarChart3,
} from "lucide-react";

interface PredictionOutputProps {
  probability: number;
  visible: boolean;
}

const rfFeatures = [
  { name: "Agent Win Rate", importance: 0.148 },
  { name: "Revenue per Employee", importance: 0.077 },
  { name: "Total Revenue (Log)", importance: 0.07 },
  { name: "Employee Count (Log)", importance: 0.066 },
];

function getRecommendations(probability: number) {
  // Logic updated to match the 46.1% critical threshold
  if (probability >= 60) {
    return [
      "Immediate Sales Outreach: Assign top-tier closer",
      "High-value target based on agent performance history",
      "Generate custom contract based on sector standards",
    ];
  } else if (probability >= 46.1) {
    return [
      "Qualified Lead: Trigger nurture email sequence",
      "Schedule discovery call within 48 hours",
      "Focus on ROI metrics related to their sector",
    ];
  }
  return [
    "Lower priority: Monitor for behavioral shifts",
    "Keep in monthly newsletter rotation",
    "Potential mismatch in revenue/employee efficiency",
  ];
}

export default function PredictionOutput({
  probability,
  visible,
  data,
}: {
  probability: number;
  visible: boolean;
  data: any; // Pass the form data here to access engage_date
}) {
  if (!visible) return null;

  // 1. Calculate the days since engagement
  const daysSinceEngagement = Math.floor(
    (new Date().getTime() - new Date(data.engage_date).getTime()) /
      (1000 * 3600 * 24),
  );

  // 2. Helper for the visual badge/text
  const getDurationInsight = (days: number) => {
    if (days > 60)
      return {
        text: "Aging Lead",
        color: "text-destructive",
        tip: "Immediate action required.",
      };
    if (days < 7)
      return {
        text: "New Lead",
        color: "text-info",
        tip: "Focus on discovery.",
      };
    return {
      text: "Active Lead",
      color: "text-success",
      tip: "Maintain momentum.",
    };
  };

  const insight = getDurationInsight(daysSinceEngagement);
  const isHigh = probability >= 46.1;
  const recommendations = getRecommendations(probability);

  return (
    <div className="space-y-5">
      {/* Main Result Card */}
      <Card className="...">
        <CardContent className="pt-6">
          {/* ... existing probability display ... */}

          {/* 3. NEW: Display the Duration Insight under the probability */}
          <div className="mt-4 py-2 border-t border-border/40">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
              Timeline Status
            </p>
            <p className={`text-sm font-bold ${insight.color}`}>
              {insight.text} ({daysSinceEngagement} days)
            </p>
            <p className="text-[11px] text-muted-foreground">{insight.tip}</p>
          </div>
        </CardContent>
      </Card>

      {/* Suggested Actions Card */}
      <Card>
        <CardHeader>
          <CardTitle>Suggested Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {/* 4. Inject a dynamic duration-based recommendation */}
            <li className="flex items-start gap-2 text-sm">
              <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5" />
              <strong>Timeline Note:</strong>{" "}
              {daysSinceEngagement > 30
                ? "Review engagement history for potential bottlenecks."
                : "Continue with standard onboarding sequence."}
            </li>
            {getRecommendations(probability).map((rec, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm">
                <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5" />
                {rec}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
