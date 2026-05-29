"use client";

import { useEffect, useState, useMemo } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, ArrowRight, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useExpensesQuery, useClearExpensesMutation } from "@/hooks/useExpenses";
import { useTranslations } from "next-intl";
import CategoryBarChart from "@/components/analytics/CategoryBarChart";
import MemberPieChart from "@/components/analytics/MemberPieChart";
import { CHART_COLORS, parseCategory } from "@/lib/constants";
import { toast } from "sonner";

export default function DiagramsPage() {
  const currentUser = useAuthStore((state) => state.currentUser);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const { resolvedTheme } = useTheme();
  const t = useTranslations();

  // Recharts needs client-only render to avoid SSR hydration mismatches
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch data
  const { data: expenses = [], isLoading } = useExpensesQuery(!!currentUser);

  // Clear Mutation
  const clearMutation = useClearExpensesMutation();

  // 1. Process category data (Memoized & Localized)
  const categoryData = useMemo(() => {
    const categoryExpenses = expenses.reduce((acc, expense) => {
      // Look up translation dictionary to translate category name before plotting
      const localizedCategory = t(`categoriesMap.${expense.category}`);
      const categoryName = parseCategory(localizedCategory).text;
      acc[categoryName] = (acc[categoryName] || 0) + expense.cost;
      return acc;
    }, {} as Record<string, number>);

    return Object.keys(categoryExpenses).map((category, index) => ({
      name: category,
      value: categoryExpenses[category],
      color: CHART_COLORS[index % CHART_COLORS.length],
    }));
  }, [expenses, t]);

  // 2. Process member data (Memoized)
  const memberData = useMemo(() => {
    const memberExpenses = expenses.reduce((acc, expense) => {
      acc[expense.member] = (acc[expense.member] || 0) + expense.cost;
      return acc;
    }, {} as Record<string, number>);

    return Object.keys(memberExpenses).map((member, index) => ({
      name: member,
      value: memberExpenses[member],
      color: CHART_COLORS[(index + 3) % CHART_COLORS.length],
    }));
  }, [expenses]);

  // 3. Process total cost (Memoized)
  const totalCost = useMemo(() => {
    return expenses.reduce((sum, item) => sum + item.cost, 0);
  }, [expenses]);

  const isDark = resolvedTheme === "dark";

  // Memoized tooltip styling for performance
  const tooltipContentStyle = useMemo(() => {
    return {
      backgroundColor: isDark ? "oklch(0.205 0 0)" : "oklch(1 0 0)",
      border: `1px solid ${isDark ? "oklch(1 0 0 / 10%)" : "oklch(0.922 0 0)"}`,
      borderRadius: "8px",
      color: isDark ? "oklch(0.985 0 0)" : "oklch(0.145 0 0)",
    };
  }, [isDark]);

  // Hydration protection
  if (!isHydrated || !currentUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleClear = () => {
    toast.warning(t("dashboard.list.confirmClear"), {
      action: {
        label: t("dashboard.list.confirmClearAction"),
        onClick: () => clearMutation.mutate(),
      },
      duration: 5000,
    });
  };

  return (
    <main className="flex-1 bg-linear-to-b from-background to-accent/15 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">{t("analytics.title")}</h1>
              <p className="text-muted-foreground">
                {t("analytics.subtitle", { username: currentUser.username })}
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
                {t("analytics.clearButton")}
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
              <CardTitle className="text-xl font-bold">{t("analytics.noDataTitle")}</CardTitle>
              <CardDescription className="mt-2 max-w-sm mx-auto">
                {t("analytics.noDataDesc")}
              </CardDescription>
              <div className="mt-6">
                <Link href="/add-expense">
                  <Button className="flex items-center gap-2 mx-auto cursor-pointer">
                    <span>{t("analytics.noDataButton")}</span>
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
                      {t("analytics.balanceTitle")}
                    </p>
                    <h2 className="text-3xl font-extrabold tracking-tight mt-1">
                      {totalCost.toFixed(2)} ₴
                    </h2>
                  </div>
                  <div className="bg-accent/80 border border-border px-4 py-2.5 rounded-xl text-sm font-semibold">
                    {t("analytics.totalTransactions", { count: expenses.length })}
                  </div>
                </div>
              </Card>

              {/* Charts grid */}
              {mounted && (
                <div className="grid gap-6 lg:grid-cols-2">
                  {/* Category Chart */}
                  <CategoryBarChart
                    categoryData={categoryData}
                    isDark={isDark}
                    tooltipContentStyle={tooltipContentStyle}
                  />

                  {/* Member Chart */}
                  <MemberPieChart
                    memberData={memberData}
                    totalCost={totalCost}
                    tooltipContentStyle={tooltipContentStyle}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </main>
  );
}
