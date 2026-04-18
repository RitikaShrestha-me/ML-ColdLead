import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LeadData } from "@/components/LeadForm";

interface PredictionOutputProps {
  probability: number;
  visible: boolean;
  data: LeadData;
}

export default function PredictionOutput({
  probability,
  visible,
  data,
}: PredictionOutputProps) {
  if (!visible) return null;

  const daysSinceEngagement = data?.engage_date
    ? Math.floor(
        (new Date().getTime() - new Date(data.engage_date).getTime()) /
          (1000 * 3600 * 24)
      )
    : 0;

  const isHigh = probability >= 45;

  const getDurationInsight = (days: number) => {
    if (days > 60) return { text: "Aging Lead", color: "text-red-500", tip: "Immediate action required." };
    if (days < 7) return { text: "New Lead", color: "text-blue-500", tip: "Focus on discovery." };
    return { text: "Active Lead", color: "text-green-500", tip: "Maintain momentum." };
  };

  const insight = getDurationInsight(daysSinceEngagement);

  const getRecommendations = (prob: number) => {
    if (prob >= 60) {
      return [
        "Immediate Sales Outreach: Assign top-tier closer",
        "High-value target based on agent performance history",
        "Generate custom contract based on sector standards",
      ];
    } else if (prob >= 45) {
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
  };

  const recommendations = getRecommendations(probability);

  // Calculate rotation for gauge (0% = -90deg, 100% = 90deg)
  const rotation = (probability / 100) * 180 - 90;

  return (
    <div className="space-y-5">
      {/* Gauge Card */}
      <Card className={isHigh ? "border-green-500 bg-green-50" : "border-yellow-500 bg-yellow-50"}>
        <CardContent className="pt-6">
          {/* Gauge Visualization */}
          <div className="relative w-full h-40 mb-4">
            {/* Gauge Background Arc */}
            <svg viewBox="0 0 200 120" className="w-full h-full">
              {/* Background arc */}
              <path
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="12"
                strokeLinecap="round"
              />
              {/* Gradient arc */}
              <defs>
                <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="45%" stopColor="#eab308" />
                  <stop offset="100%" stopColor="#22c55e" />
                </linearGradient>
              </defs>
              <path
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                stroke="url(#gaugeGradient)"
                strokeWidth="12"
                strokeLinecap="round"
              />
              {/* Needle */}
              <line
                x1="100"
                y1="100"
                x2="100"
                y2="35"
                stroke="#374151"
                strokeWidth="3"
                strokeLinecap="round"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transformOrigin: "100px 100px",
                  transition: "transform 0.5s ease-out",
                }}
              />
              {/* Center circle */}
              <circle cx="100" cy="100" r="8" fill="#374151" />
              {/* Labels */}
              <text x="20" y="118" fontSize="10" fill="#6b7280">0%</text>
              <text x="90" y="25" fontSize="10" fill="#6b7280" textAnchor="middle">50%</text>
              <text x="170" y="118" fontSize="10" fill="#6b7280" textAnchor="end">100%</text>
            </svg>
          </div>

          {/* Probability Display */}
          <div className="text-center">
            <p className="text-5xl font-bold text-gray-800">
              {probability.toFixed(1)}
              <span className="text-2xl">%</span>
            </p>
            <p className={`mt-2 font-bold text-lg ${isHigh ? "text-green-600" : "text-yellow-600"}`}>
              {isHigh ? "High Conversion Potential" : "Low Conversion Potential"}
            </p>
          </div>

          {/* Timeline Status */}
          {data?.engage_date && (
            <div className="mt-4 pt-4 border-t border-gray/20">
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                Timeline Status
              </p>
              <p className={`text-sm font-bold ${insight.color}`}>
                {insight.text} ({daysSinceEngagement} days)
              </p>
              <p className="text-[11px] text-gray-400">{insight.tip}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Suggested Actions Card */}
      <Card>
        <CardHeader>
          <CardTitle>Suggested Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {daysSinceEngagement > 30 && (
              <li className="flex items-start gap-2 text-sm">
                <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5" />
                <span><strong>Timeline:</strong> Review engagement history for potential bottlenecks.</span>
              </li>
            )}
            {recommendations.map((rec, idx) => (
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