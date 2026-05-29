"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  PieChart,
  Pie,
  ResponsiveContainer,
  Cell,
  Tooltip,
} from "recharts";
import { PieChart as PieIcon } from "lucide-react";
import { useTranslations } from "next-intl";

interface MemberDataPoint {
  name: string;
  value: number;
  color: string;
}

interface MemberPieChartProps {
  memberData: MemberDataPoint[];
  totalCost: number;
  tooltipContentStyle: React.CSSProperties;
}

export default function MemberPieChart({
  memberData,
  totalCost,
  tooltipContentStyle,
}: MemberPieChartProps) {
  const t = useTranslations();

  return (
    <Card className="border-border/80 bg-card/60 backdrop-blur-md shadow-xs">
      <CardHeader className="flex flex-row items-center gap-2.5 pb-2">
        <PieIcon className="h-5 w-5 text-emerald-500 stroke-[1.8]" />
        <div>
          <CardTitle className="text-lg font-bold">{t("analytics.memberTitle")}</CardTitle>
          <CardDescription>{t("analytics.memberDesc")}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="h-[350px] flex flex-col justify-center items-center">
        <div className="w-full h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={memberData}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
              >
                {memberData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={tooltipContentStyle}
                itemStyle={{ color: tooltipContentStyle.color }}
                labelStyle={{ color: tooltipContentStyle.color }}
                formatter={(value: any) => [`${parseFloat(value).toFixed(2)} ₴`, t("analytics.chartTooltipSpent")]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        {/* Custom Legend */}
        <div className="flex flex-wrap justify-center gap-4 text-xs font-semibold">
          {memberData.map((entry) => (
            <div key={entry.name} className="flex items-center gap-1.5">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-muted-foreground">{entry.name}:</span>
              <span className="text-foreground">
                {totalCost > 0 ? `${((entry.value / totalCost) * 100).toFixed(0)}%` : "0%"}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
