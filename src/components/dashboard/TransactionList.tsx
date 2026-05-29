"use client";

import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Trash2 } from "lucide-react";
import Link from "next/link";
import { Expense } from "@/lib/api";
import { useTranslations, useLocale } from "next-intl";
import { parseCategory } from "@/lib/constants";

interface TransactionListProps {
  expenses: Expense[];
  filteredExpenses: Expense[];
  isLoading: boolean;
  onDelete: (id: string) => void;
  isDeletePending: boolean;
}



// Single pre-compiled Date Formatters to avoid recreation on every render/item
const dateFormatterUA = new Intl.DateTimeFormat("uk-UA", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const dateFormatterEN = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export default function TransactionList({
  expenses,
  filteredExpenses,
  isLoading,
  onDelete,
  isDeletePending,
}: TransactionListProps) {
  const t = useTranslations();
  const language = useLocale();
  const dateFormatter = language === "uk" ? dateFormatterUA : dateFormatterEN;

  return (
    <Card className="border-border/80 bg-card/60 backdrop-blur-md overflow-hidden shadow-xs">
      <div className="p-6 pb-4 border-b border-border flex justify-between items-center">
        <div>
          <CardTitle className="text-lg font-bold">{t("dashboard.list.title")}</CardTitle>
          <CardDescription>
            {t("dashboard.list.countDesc", {
              shown: filteredExpenses.length,
              total: expenses.length,
            })}
          </CardDescription>
        </div>
      </div>

      {isLoading ? (
        <div className="p-6 space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="flex items-center justify-between animate-pulse">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-muted" />
                <div className="space-y-2">
                  <div className="h-4 w-32 rounded bg-muted" />
                  <div className="h-3 w-20 rounded bg-muted" />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-5 w-16 rounded bg-muted" />
                <div className="h-8 w-8 rounded-full bg-muted" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredExpenses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground mb-4">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold tracking-tight">{t("dashboard.list.emptyTitle")}</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-xs">
            {expenses.length === 0
              ? t("dashboard.list.emptyDescFirst")
              : t("dashboard.list.emptyDescFilter")}
          </p>
          {expenses.length === 0 && (
            <Link href="/add-expense" className="mt-4">
              <Button size="sm">{t("dashboard.list.emptyButton")}</Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="divide-y divide-border">
          {filteredExpenses.map((expense) => {
            // Translate the category before splitting emojis
            const localizedCategory = t(`categoriesMap.${expense.category}`);
            const { emoji: categoryEmoji, text: categoryText } = parseCategory(localizedCategory);

            return (
              <div
                key={expense.id}
                className="flex items-center justify-between p-4 px-6 hover:bg-accent/40 transition-colors duration-150 group"
              >
                {/* Left: Category and Spender Info */}
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-lg shadow-2xs">
                    {categoryEmoji}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{categoryText}</div>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                      <span className="font-medium text-foreground bg-accent px-2 py-0.5 rounded-full">
                        {expense.member}
                      </span>
                      <span>•</span>
                      <span>{dateFormatter.format(new Date(expense.date))}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Cost and Action Button */}
                <div className="flex items-center gap-4">
                  <div className="text-base font-bold text-foreground">
                    {expense.cost.toFixed(2)} ₴
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(expense.id)}
                    disabled={isDeletePending}
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full opacity-80 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
