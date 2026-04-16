import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HelpCircle, User, Phone, BarChart3 } from "lucide-react";
import { Building2, Globe, Briefcase, DollarSign } from "lucide-react";

export interface LeadData {
  revenue: number;
  employees: number;
  sales_agent: string;
  product: string;
  sector: string;
  office_location: string;
  company_age: number;
  engage_date: string; // "YYYY-MM-DD"
  manager: string;
  series: string;
}

interface LeadFormProps {
  data: LeadData;
  onChange: (data: LeadData) => void;
}

export default function LeadForm({ data, onChange }: LeadFormProps) {
  // Inside your main App or Form container
  const [options, setOptions] = useState({
    sales_agents: [],
    products: [],
    sectors: [],
    office_locations: [],
    managers: [],
    series: [],
  });

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const API_URL = window.location.origin;

        const response = await fetch(`${API_URL}/api/meta`);
        const data = await response.json();
        setOptions(data);
      } catch (err) {
        console.error("Failed to load metadata", err);
      }
    };
    fetchMeta();
  }, []);

  const update = (key: keyof LeadData, value: string | number) =>
    onChange({ ...data, [key]: value });

  return (
    <div className="space-y-5">
      {/* Company Financials */}
      <Card className="shadow-card border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg gradient-hero text-white">
              <BarChart3 className="h-3.5 w-3.5" />
            </div>
            Project Context
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Date Picker for Engagement Date */}
          <div className="space-y-2">
            <Label className="text-sm">Initial Engagement Date</Label>
            <Input
              type="date"
              value={data.engage_date}
              onChange={(e) => update("engage_date", e.target.value)}
              className="bg-background cursor-pointer"
            />
            <p className="text-[10px] text-muted-foreground italic">
              *System will calculate deal duration relative to today.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Manager Selection */}
            <div className="space-y-2">
              <Label className="text-sm">Supervising Manager</Label>
              <Select
                value={data.manager}
                onValueChange={(v) => update("manager", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Manager" />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "Celia Rouche",
                    "Dustin Brinkmann",
                    "Melvin Marxen",
                    "Rocco Neubert",
                    "Summer Sewald",
                  ].map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Series Selection */}
            <div className="space-y-2">
              <Label className="text-sm">Product Series</Label>
              <Select
                value={data.series}
                onValueChange={(v) => update("series", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Series" />
                </SelectTrigger>
                <SelectContent>
                  {["GTX", "MG", "Unknown"].map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assignment & Product */}
      <Card className="shadow-card border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg gradient-accent text-white">
              <Briefcase className="h-3.5 w-3.5" />
            </div>
            Deal Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm">Assigned Sales Agent</Label>
            <Select
              value={data.sales_agent}
              onValueChange={(v) => update("sales_agent", v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {/* These match your Python SALES_AGENTS list */}
                {[
                  "Boris Faz",
                  "Cassey Cress",
                  "Daniell Hammack",
                  "Vicki Laflamme",
                ].map((agent) => (
                  <SelectItem key={agent} value={agent}>
                    {agent}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-sm">Product Interest</Label>
            <Select
              value={data.product}
              onValueChange={(v) => update("product", v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["GTX Basic", "GTX Plus Pro", "MG Advanced", "MG Special"].map(
                  (p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Market Information */}
      <Card className="shadow-card border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500 text-white">
              <Globe className="h-3.5 w-3.5" />
            </div>
            Market Context
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label className="text-sm">Sector</Label>
            <Select
              value={data.sector}
              onValueChange={(v) => update("sector", v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["software", "technolgy", "finance", "medical", "retail"].map(
                  (s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-sm">Office Location</Label>
            <Select
              value={data.office_location}
              onValueChange={(v) => update("office_location", v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[
                  "United States",
                  "Germany",
                  "Brazil",
                  "Japan",
                  "United Kingdom",
                ].map((l) => (
                  <SelectItem key={l} value={l}>
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
