"use client";

import { useState, useMemo } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";
import Link from "next/link";
import {
  useExpensesQuery,
  useDeleteExpenseMutation,
  useClearExpensesMutation,
} from "@/hooks/useExpenses";
import StatsCards from "@/components/dashboard/StatsCards";
import FilterBar from "@/components/dashboard/FilterBar";
import TransactionList from "@/components/dashboard/TransactionList";
import { CATEGORIES } from "@/lib/constants";
import { toast } from "sonner";

export default function Dashboard() {
  const currentUser = useAuthStore((state) => state.currentUser);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const t = useTranslations();

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedMember, setSelectedMember] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");

  // Fetch Expenses with React Query custom hook
  const {
    data: expenses = [],
    isLoading,
    isFetching,
    refetch,
  } = useExpensesQuery(!!currentUser);

  // Delete Mutation custom hook
  const deleteMutation = useDeleteExpenseMutation();

  // Clear All Mutation custom hook
  const clearMutation = useClearExpensesMutation();

  // Hydration state check
  // Memoized unique members list for filters
  const uniqueMembers = useMemo(() => {
    return Array.from(new Set(expenses.map((e) => e.member))).filter(Boolean);
  }, [expenses]);

  // Memoized filtered & sorted expenses list
  const filteredExpenses = useMemo(() => {
    return expenses
      .filter((expense) => {
        const matchesSearch =
          expense.member.toLowerCase().includes(searchQuery.toLowerCase()) ||
          expense.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory =
          selectedCategory === "all" || expense.category === selectedCategory;
        const matchesMember =
          selectedMember === "all" || expense.member === selectedMember;

        return matchesSearch && matchesCategory && matchesMember;
      })
      .sort((a, b) => {
        if (sortBy === "date-desc") return new Date(b.date).getTime() - new Date(a.date).getTime();
        if (sortBy === "date-asc") return new Date(a.date).getTime() - new Date(b.date).getTime();
        if (sortBy === "cost-desc") return b.cost - a.cost;
        if (sortBy === "cost-asc") return a.cost - b.cost;
        return 0;
      });
  }, [expenses, searchQuery, selectedCategory, selectedMember, sortBy]);

  // Hydration state check
  if (!isHydrated || !currentUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleDelete = (id: string) => {
    toast.warning(t("dashboard.list.confirmDelete"), {
      action: {
        label: t("dashboard.list.confirmDeleteAction"),
        onClick: () => deleteMutation.mutate(id),
      },
      duration: 5000,
    });
  };

  const handleClearAll = () => {
    toast.warning(t("dashboard.list.confirmClear"), {
      action: {
        label: t("dashboard.list.confirmClearAction"),
        onClick: () => clearMutation.mutate(),
      },
      duration: 5000,
    });
  };

  return (
    <main className="flex-1 bg-linear-to-b from-background to-accent/10 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
          {/* Header Section */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">{t("dashboard.title")}</h1>
              <p className="text-muted-foreground">
                {t("dashboard.subtitle", { username: currentUser.username })}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => refetch()}
                disabled={isLoading || isFetching}
                title={t("dashboard.refreshTooltip")}
                className="cursor-pointer"
              >
                <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
              </Button>
              {expenses.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearAll}
                  disabled={clearMutation.isPending}
                  className="border-destructive/20 text-destructive hover:bg-destructive/10 cursor-pointer"
                >
                  {t("dashboard.clearExpenses")}
                </Button>
              )}
              <Link href="/add-expense">
                <Button className="flex items-center gap-2 cursor-pointer">
                  <Plus className="h-4 w-4" />
                  <span>{t("dashboard.addExpenseButton")}</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Section */}
          <StatsCards expenses={expenses} isLoading={isLoading} />

          {/* Filtering and Transactions Table */}
          <div className="space-y-4">
            {/* Filters Bar */}
            <FilterBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedMember={selectedMember}
              setSelectedMember={setSelectedMember}
              sortBy={sortBy}
              setSortBy={setSortBy}
              categories={CATEGORIES}
              uniqueMembers={uniqueMembers}
            />

            {/* Expenses List */}
            <TransactionList
              expenses={expenses}
              filteredExpenses={filteredExpenses}
              isLoading={isLoading}
              onDelete={handleDelete}
              isDeletePending={deleteMutation.isPending}
            />
          </div>
        </div>
      </main>
  );
}
