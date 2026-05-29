"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { BarChart2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface CategoryDataPoint {
  name: string;
  value: number;
  color: string;
}

interface CategoryBarChartProps {
  categoryData: CategoryDataPoint[];
  isDark: boolean;
  tooltipContentStyle: React.CSSProperties;
}

export default function CategoryBarChart({
  categoryData,
  isDark,
  tooltipContentStyle,
}: CategoryBarChartProps) {
  const t = useTranslations();

  return (
    <Card className="border-border/80 bg-card/60 backdrop-blur-md shadow-xs">
      <CardHeader className="flex flex-row items-center gap-2.5 pb-2">
        <BarChart2 className="h-5 w-5 text-indigo-500 stroke-[1.8]" />
        <div>
          <CardTitle className="text-lg font-bold">{t("analytics.categoryTitle")}</CardTitle>
          <CardDescription>{t("analytics.categoryDesc")}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="h-[350px] pl-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={categoryData}
            margin={{ top: 10, right: 20, left: 10, bottom: 20 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke={isDark ? "#2d2d2d" : "#e5e5e5"}
            />
            <XAxis
              dataKey="name"
              tick={{ fill: "currentColor", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "currentColor", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `${value} ₴`}
            />
            <Tooltip
              contentStyle={tooltipContentStyle}
              itemStyle={{ color: tooltipContentStyle.color }}
              labelStyle={{ color: tooltipContentStyle.color }}
              cursor={{ fill: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.03)" }}
              formatter={(value: any) => [`${parseFloat(value).toFixed(2)} ₴`, t("analytics.chartTooltipSum")]}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
