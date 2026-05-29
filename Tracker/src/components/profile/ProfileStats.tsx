import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Receipt, Calculator } from "lucide-react";
import { useTranslations } from "next-intl";

interface ProfileStatsProps {
  stats: {
    total: number;
    count: number;
    average: number;
  };
}

export default function ProfileStats({ stats }: ProfileStatsProps) {
  const t = useTranslations("profile");
  const tGlobal = useTranslations();

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      
      <Card className="border-border/80 bg-card/60 backdrop-blur-md shadow-sm transition-all duration-300 hover:shadow-md hover:translate-y-[-2px]">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {t("totalSpent")}
          </CardTitle>
          <TrendingUp className="h-4.5 w-4.5 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold tracking-tight text-foreground">
            {stats.total.toFixed(2)} ₴
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {tGlobal("dashboard.stats.totalDesc")}
          </p>
        </CardContent>
      </Card>

      <Card className="border-border/80 bg-card/60 backdrop-blur-md shadow-sm transition-all duration-300 hover:shadow-md hover:translate-y-[-2px]">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {t("transactions")}
          </CardTitle>
          <Receipt className="h-4.5 w-4.5 text-indigo-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold tracking-tight text-foreground">
            {stats.count}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {tGlobal("analytics.totalTransactions", { count: stats.count })}
          </p>
        </CardContent>
      </Card>

      <Card className="border-border/80 bg-card/60 backdrop-blur-md shadow-sm transition-all duration-300 hover:shadow-md hover:translate-y-[-2px]">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {t("avgTransaction")}
          </CardTitle>
          <Calculator className="h-4.5 w-4.5 text-emerald-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold tracking-tight text-foreground">
            {stats.average.toFixed(2)} ₴
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {tGlobal("addExpense.labelCost")} / {t("transactionsHeader").toLowerCase()}
          </p>
        </CardContent>
      </Card>

    </div>
  );
}
