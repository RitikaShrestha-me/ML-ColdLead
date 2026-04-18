import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BarChart3, Briefcase, Globe, DollarSign } from "lucide-react";

export interface LeadData {
  revenue: number;
  employees: number;
  sales_agent: string;
  product: string;
  sector: string;
  office_location: string;
  company_age: number;
  engage_date: string;
  manager: string;
  series: string;
}

interface LeadFormProps {
  data: LeadData;
  onChange: (data: LeadData) => void;
}

export default function LeadForm({ data, onChange }: LeadFormProps) {
  const update = (key: keyof LeadData, value: string | number) => {
    onChange({ ...data, [key]: value });
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-5">
      {/* Company Financials */}
      <Card className="shadow-card border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg gradient-hero text-white">
              <DollarSign className="h-3.5 w-3.5" />
            </div>
            Company Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-sm">Annual Revenue ($)</Label>
              <Input
                type="number"
                value={data.revenue || ""}
                onChange={(e) => update("revenue", Number(e.target.value))}
                placeholder="55000"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Number of Employees</Label>
              <Input
                type="number"
                value={data.employees || ""}
                onChange={(e) => update("employees", Number(e.target.value))}
                placeholder="50"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-sm">Company Age (years)</Label>
              <Input
                type="number"
                value={data.company_age || ""}
                onChange={(e) => update("company_age", Number(e.target.value))}
                placeholder="10"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Initial Engagement Date</Label>
              <Input
                type="date"
                value={data.engage_date || today}
                onChange={(e) => update("engage_date", e.target.value)}
                className="bg-background cursor-pointer"
                max={today}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deal Details */}
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
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-sm">Supervising Manager *</Label>
              <Select
                value={data.manager || ""}
                onValueChange={(v) => update("manager", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Manager" />
                </SelectTrigger>
                <SelectContent>
                  {["Celia Rouche", "Dustin Brinkmann", "Melvin Marxen", "Rocco Neubert", "Summer Sewald"].map((m) => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Product Series *</Label>
              <Select
                value={data.series || ""}
                onValueChange={(v) => update("series", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Series" />
                </SelectTrigger>
                <SelectContent>
                  {["GTX", "MG", "Unknown"].map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-sm">Sales Agent *</Label>
            <Select value={data.sales_agent || ""} onValueChange={(v) => update("sales_agent", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Agent" />
              </SelectTrigger>
              <SelectContent>
                {["Boris Faz", "Cassey Cress", "Daniell Hammack", "Vicki Laflamme", "Moses Frase", "Maureen Marcano", "James Ascencio"].map((agent) => (
                  <SelectItem key={agent} value={agent}>{agent}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-sm">Product *</Label>
            <Select value={data.product || ""} onValueChange={(v) => update("product", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Product" />
              </SelectTrigger>
              <SelectContent>
                {["GTX Basic", "GTX Plus Pro", "GTXPro", "MG Advanced", "MG Special"].map((p) => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Market Context */}
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
            <Label className="text-sm">Sector *</Label>
            <Select value={data.sector || ""} onValueChange={(v) => update("sector", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Sector" />
              </SelectTrigger>
              <SelectContent>
                {["software", "technology", "finance", "medical", "retail", "services", "marketing"].map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-sm">Office Location *</Label>
            <Select value={data.office_location || ""} onValueChange={(v) => update("office_location", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Location" />
              </SelectTrigger>
              <SelectContent>
                {["United States", "Germany", "Brazil", "Japan", "United Kingdom", "China", "France"].map((l) => (
                  <SelectItem key={l} value={l}>{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}