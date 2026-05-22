"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import { Loader2, PieChart as PieIcon, BarChart2, Trash2, ArrowRight, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useExpensesQuery, useClearExpensesMutation } from "@/hooks/useExpenses";

// Color Palette for charts
const COLORS = [
  "oklch(0.627 0.265 303.9)", // Violet
  "oklch(0.609 0.126 221.72)", // Sky/Blue
  "oklch(0.645 0.246 16.43)",  // Rose/Red
  "oklch(0.769 0.188 70.08)",  // Amber/Orange
  "oklch(0.627 0.194 149.58)", // Emerald
  "oklch(0.707 0.165 254.62)", // Indigo
  "oklch(0.609 0 0)",          // Gray
];

export default function DiagramsPage() {
  const currentUser = useAuthStore((state) => state.currentUser);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const { resolvedTheme } = useTheme();
  
  // Recharts needs client-only render to avoid SSR hydration mismatches
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch data
  const { data: expenses = [], isLoading } = useExpensesQuery(!!currentUser);

  // Clear Mutation
  const clearMutation = useClearExpensesMutation();

  if (!isHydrated || !currentUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // 1. Process category data
  const categoryExpenses = expenses.reduce((acc, expense) => {
    const categoryName = expense.category.replace(/[\p{Emoji}\u200d]+/gu, "").trim();
    acc[categoryName] = (acc[categoryName] || 0) + expense.cost;
    return acc;
  }, {} as Record<string, number>);

  const categoryData = Object.keys(categoryExpenses).map((category, index) => ({
    name: category,
    value: categoryExpenses[category],
    color: COLORS[index % COLORS.length],
  }));

  // 2. Process member data
  const memberExpenses = expenses.reduce((acc, expense) => {
    acc[expense.member] = (acc[expense.member] || 0) + expense.cost;
    return acc;
  }, {} as Record<string, number>);

  const memberData = Object.keys(memberExpenses).map((member, index) => ({
    name: member,
    value: memberExpenses[member],
    color: COLORS[(index + 3) % COLORS.length], // Shift color index for variety
  }));

  const totalCost = expenses.reduce((sum, item) => sum + item.cost, 0);

  const handleClear = () => {
    if (confirm("Увага! Всі витрати будуть видалені з бази даних. Продовжити?")) {
      clearMutation.mutate();
    }
  };

  const isDark = resolvedTheme === "dark";
  const tooltipContentStyle = {
    backgroundColor: isDark ? "oklch(0.205 0 0)" : "oklch(1 0 0)",
    border: `1px solid ${isDark ? "oklch(1 0 0 / 10%)" : "oklch(0.922 0 0)"}`,
    borderRadius: "8px",
    color: isDark ? "oklch(0.985 0 0)" : "oklch(0.145 0 0)",
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-linear-to-b from-background to-accent/15 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-8">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">Аналітика Витрат</h1>
              <p className="text-muted-foreground">
                Візуалізація сімейного бюджету родини <span className="font-semibold text-foreground">{currentUser.username}</span>
              </p>
            </div>
            {expenses.length > 0 && (
              <Button
                variant="outline"
                onClick={handleClear}
                disabled={clearMutation.isPending}
                className="border-destructive/20 text-destructive hover:bg-destructive/10 cursor-pointer self-start sm:self-auto"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Очистити витрати
              </Button>
            )}
          </div>

          {isLoading ? (
            <div className="flex h-[400px] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : expenses.length === 0 ? (
            <Card className="border border-border/80 bg-card/60 backdrop-blur-md p-12 text-center shadow-lg">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground mb-4">
                <AlertCircle className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl font-bold">Немає даних для діаграм</CardTitle>
              <CardDescription className="mt-2 max-w-sm mx-auto">
                Будь ласка, додайте витрати на панелі приладів, щоб ми могли побудувати графіки та проаналізувати ваш бюджет.
              </CardDescription>
              <div className="mt-6">
                <Link href="/add-expense">
                  <Button className="flex items-center gap-2 mx-auto cursor-pointer">
                    <span>Додати першу витрату</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Summary Banner */}
              <Card className="border-border/85 bg-card/70 backdrop-blur-md p-6 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                      Загальний баланс витрат
                    </p>
                    <h2 className="text-3xl font-extrabold tracking-tight mt-1">
                      {totalCost.toFixed(2)} ₴
                    </h2>
                  </div>
                  <div className="bg-accent/80 border border-border px-4 py-2.5 rounded-xl text-sm font-semibold">
                    Усього транзакцій: <span className="text-primary font-bold">{expenses.length}</span>
                  </div>
                </div>
              </Card>

              {/* Charts grid */}
              {mounted && (
                <div className="grid gap-6 lg:grid-cols-2">
                  {/* Category Chart */}
                  <Card className="border-border/80 bg-card/60 backdrop-blur-md shadow-xs">
                    <CardHeader className="flex flex-row items-center gap-2.5 pb-2">
                      <BarChart2 className="h-5 w-5 text-indigo-500 stroke-[1.8]" />
                      <div>
                        <CardTitle className="text-lg font-bold">Витрати по категоріях</CardTitle>
                        <CardDescription>Розподіл суми витрат за категоріями</CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="h-[350px] pl-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={categoryData}
                          margin={{ top: 10, right: 20, left: 10, bottom: 20 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#2d2d2d" : "#e5e5e5"} />
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
                            cursor={{ fill: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)" }}
                            formatter={(value: any) => [`${parseFloat(value).toFixed(2)} ₴`, "Сума"]}
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

                  {/* Member Chart */}
                  <Card className="border-border/80 bg-card/60 backdrop-blur-md shadow-xs">
                    <CardHeader className="flex flex-row items-center gap-2.5 pb-2">
                      <PieIcon className="h-5 w-5 text-emerald-500 stroke-[1.8]" />
                      <div>
                        <CardTitle className="text-lg font-bold">Витрати членів сім'ї</CardTitle>
                        <CardDescription>Частка кожного члена сім'ї у загальних витратах</CardDescription>
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
                              formatter={(value: any) => [`${parseFloat(value).toFixed(2)} ₴`, "Витрачено"]}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      {/* Custom Legend */}
                      <div className="flex flex-wrap justify-center gap-4 text-xs font-semibold">
                        {memberData.map((entry, index) => (
                          <div key={entry.name} className="flex items-center gap-1.5">
                            <span
                              className="h-2.5 w-2.5 rounded-full"
                              style={{ backgroundColor: entry.color }}
                            />
                            <span className="text-muted-foreground">{entry.name}:</span>
                            <span className="text-foreground">
                              {((entry.value / totalCost) * 100).toFixed(0)}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
