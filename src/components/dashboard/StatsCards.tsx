"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, User as UserIcon, Tag } from "lucide-react";
import { Expense } from "@/lib/api";
import { useTranslations } from "next-intl";

interface StatsCardsProps {
  expenses: Expense[];
  isLoading: boolean;
}

export default function StatsCards({ expenses, isLoading }: StatsCardsProps) {
  const t = useTranslations();

  // Memoized stats calculation
  const stats = useMemo(() => {
    const totalCost = expenses.reduce((sum, item) => sum + item.cost, 0);

    // Group by category
    const categoryTotals = expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.cost;
      return acc;
    }, {} as Record<string, number>);

    let topCategory = "";
    let maxCategoryCost = 0;
    Object.entries(categoryTotals).forEach(([cat, cost]) => {
      if (cost > maxCategoryCost) {
        maxCategoryCost = cost;
        topCategory = cat;
      }
    });

    // Group by member
    const memberTotals = expenses.reduce((acc, exp) => {
      acc[exp.member] = (acc[exp.member] || 0) + exp.cost;
      return acc;
    }, {} as Record<string, number>);

    let topSpender = "";
    let maxSpenderCost = 0;
    Object.entries(memberTotals).forEach(([member, cost]) => {
      if (cost > maxSpenderCost) {
        maxSpenderCost = cost;
        topSpender = member;
      }
    });

    return {
      totalCost,
      topCategory: topCategory || t("dashboard.stats.never"),
      maxCategoryCost,
      topSpender: topSpender || t("dashboard.stats.nobody"),
      maxSpenderCost,
    };
  }, [expenses, t]);

  // Translate category name if it exists
  const displayCategory = useMemo(() => {
    if (stats.topCategory && stats.topCategory !== t("dashboard.stats.never")) {
      return t(`categoriesMap.${stats.topCategory}`);
    }
    return stats.topCategory;
  }, [stats.topCategory, t]);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {/* Total Budget Card */}
      <Card className="border-border/80 bg-card/60 backdrop-blur-md shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {t("dashboard.stats.total")}
          </CardTitle>
          <TrendingUp className="h-5 w-5 text-primary stroke-[1.8]" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold tracking-tight">
            {isLoading ? (
              <div className="h-9 w-28 animate-pulse rounded-md bg-muted" />
            ) : (
              `${stats.totalCost.toFixed(2)} ₴`
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {t("dashboard.stats.totalDesc")}
          </p>
        </CardContent>
      </Card>

      {/* Top Category Card */}
      <Card className="border-border/80 bg-card/60 backdrop-blur-md shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {t("dashboard.stats.topCategory")}
          </CardTitle>
          <Tag className="h-5 w-5 text-indigo-500 stroke-[1.8]" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold tracking-tight truncate">
            {isLoading ? (
              <div className="h-8 w-36 animate-pulse rounded-md bg-muted" />
            ) : (
              displayCategory
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {stats.maxCategoryCost > 0
              ? t("dashboard.stats.topCategoryDesc", { cost: stats.maxCategoryCost.toFixed(2) })
              : t("dashboard.stats.topCategoryEmpty")}
          </p>
        </CardContent>
      </Card>

      {/* Top Spender Card */}
      <Card className="border-border/80 bg-card/60 backdrop-blur-md shadow-xs sm:col-span-2 lg:col-span-1">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {t("dashboard.stats.topSpender")}
          </CardTitle>
          <UserIcon className="h-5 w-5 text-emerald-500 stroke-[1.8]" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold tracking-tight truncate">
            {isLoading ? (
              <div className="h-8 w-32 animate-pulse rounded-md bg-muted" />
            ) : (
              stats.topSpender
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {stats.maxSpenderCost > 0
              ? t("dashboard.stats.topSpenderDesc", { cost: stats.maxSpenderCost.toFixed(2) })
              : t("dashboard.stats.topSpenderEmpty")}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
