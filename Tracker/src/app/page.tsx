"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TrendingUp,
  User as UserIcon,
  Tag,
  Search,
  Trash2,
  AlertCircle,
  Plus,
  RefreshCw,
  SlidersHorizontal,
} from "lucide-react";
import Link from "next/link";
import {
  useExpensesQuery,
  useDeleteExpenseMutation,
  useClearExpensesMutation,
} from "@/hooks/useExpenses";

const categories = [
  "🛒Products",
  "🚌Transport",
  "⚽Entertainment",
  "👗Clothing and shoes",
  "🏥Medicine",
  "📰Utilities and Internet",
  "📨Other",
];

export default function Dashboard() {
  const currentUser = useAuthStore((state) => state.currentUser);
  const isHydrated = useAuthStore((state) => state.isHydrated);

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

  if (!isHydrated || !currentUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Get unique members for filters
  const uniqueMembers = Array.from(new Set(expenses.map((e) => e.member))).filter(Boolean);

  // Filtered & Sorted expenses
  const filteredExpenses = expenses
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

  // Stats Calculations
  const totalCost = expenses.reduce((sum, item) => sum + item.cost, 0);

  // Group by category to find top category
  const categoryTotals = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.cost;
    return acc;
  }, {} as Record<string, number>);

  let topCategory = "Ніколи";
  let maxCategoryCost = 0;
  Object.entries(categoryTotals).forEach(([cat, cost]) => {
    if (cost > maxCategoryCost) {
      maxCategoryCost = cost;
      topCategory = cat;
    }
  });

  // Group by member to find top spender
  const memberTotals = expenses.reduce((acc, exp) => {
    acc[exp.member] = (acc[exp.member] || 0) + exp.cost;
    return acc;
  }, {} as Record<string, number>);

  let topSpender = "Ніхто";
  let maxSpenderCost = 0;
  Object.entries(memberTotals).forEach(([member, cost]) => {
    if (cost > maxSpenderCost) {
      maxSpenderCost = cost;
      topSpender = member;
    }
  });

  const handleDelete = (id: string) => {
    if (confirm("Ви впевнені, що хочете видалити цю витрату?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleClearAll = () => {
    if (confirm("Увага! Всі витрати будуть безповоротно видалені. Продовжити?")) {
      clearMutation.mutate();
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-linear-to-b from-background to-accent/10 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-8">
          {/* Header Section */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">Панель Витрат</h1>
              <p className="text-muted-foreground">
                Сімейний бюджет родини <span className="font-semibold text-foreground">{currentUser.username}</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => refetch()}
                disabled={isLoading || isFetching}
                title="Оновити дані"
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
                  Очистити витрати
                </Button>
              )}
              <Link href="/add-expense">
                <Button className="flex items-center gap-2 cursor-pointer">
                  <Plus className="h-4 w-4" />
                  <span>Додати витрату</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Total Budget Card */}
            <Card className="border-border/80 bg-card/60 backdrop-blur-md shadow-xs">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Загальні Витрати
                </CardTitle>
                <TrendingUp className="h-5 w-5 text-primary stroke-[1.8]" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold tracking-tight">
                  {isLoading ? (
                    <div className="h-9 w-28 animate-pulse rounded-md bg-muted" />
                  ) : (
                    `${totalCost.toFixed(2)} ₴`
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Сума витрат усіх членів родини
                </p>
              </CardContent>
            </Card>

            {/* Top Category Card */}
            <Card className="border-border/80 bg-card/60 backdrop-blur-md shadow-xs">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Найбільша Категорія
                </CardTitle>
                <Tag className="h-5 w-5 text-indigo-500 stroke-[1.8]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold tracking-tight truncate">
                  {isLoading ? (
                    <div className="h-8 w-36 animate-pulse rounded-md bg-muted" />
                  ) : (
                    topCategory
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {maxCategoryCost > 0 ? `Витрачено: ${maxCategoryCost.toFixed(2)} ₴` : "Немає записів"}
                </p>
              </CardContent>
            </Card>

            {/* Top Spender Card */}
            <Card className="border-border/80 bg-card/60 backdrop-blur-md shadow-xs sm:col-span-2 lg:col-span-1">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Головний Витратник
                </CardTitle>
                <UserIcon className="h-5 w-5 text-emerald-500 stroke-[1.8]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold tracking-tight truncate">
                  {isLoading ? (
                    <div className="h-8 w-32 animate-pulse rounded-md bg-muted" />
                  ) : (
                    topSpender
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {maxSpenderCost > 0 ? `Всього витратив: ${maxSpenderCost.toFixed(2)} ₴` : "Немає записів"}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Filtering and Transactions Table */}
          <div className="space-y-4">
            {/* Filters Bar */}
            <Card className="border-border/80 bg-card/40 backdrop-blur-md p-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4.5 w-4.5 text-muted-foreground" />
                  <Input
                    placeholder="Пошук за членом родини чи категорією..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Filter Controls */}
                <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center sm:gap-4">
                  {/* Category Filter */}
                  <div className="min-w-[140px] flex-1">
                    <Select value={selectedCategory} onValueChange={(val) => setSelectedCategory(val || "all")}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Категорія" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Усі категорії</SelectItem>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Member Filter */}
                  <div className="min-w-[140px] flex-1">
                    <Select value={selectedMember} onValueChange={(val) => setSelectedMember(val || "all")}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Член родини" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Усі члени</SelectItem>
                        {uniqueMembers.map((member) => (
                          <SelectItem key={member} value={member}>
                            {member}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Sort Filter */}
                  <div className="min-w-[140px] flex-1 col-span-2 sm:col-span-1">
                    <Select value={sortBy} onValueChange={(val) => setSortBy(val || "date-desc")}>
                      <SelectTrigger className="w-full">
                        <div className="flex items-center gap-2">
                          <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
                          <SelectValue placeholder="Сортування" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="date-desc">Спочатку нові</SelectItem>
                        <SelectItem value="date-asc">Спочатку старі</SelectItem>
                        <SelectItem value="cost-desc">Найдорожчі</SelectItem>
                        <SelectItem value="cost-asc">Найдешевші</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </Card>

            {/* Expenses List */}
            <Card className="border-border/80 bg-card/60 backdrop-blur-md overflow-hidden shadow-xs">
              <div className="p-6 pb-4 border-b border-border flex justify-between items-center">
                <div>
                  <CardTitle className="text-lg font-bold">Список транзакцій</CardTitle>
                  <CardDescription>
                    Показано {filteredExpenses.length} записів з {expenses.length}
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
                  <h3 className="text-lg font-semibold tracking-tight">Жодних витрат не знайдено</h3>
                  <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                    {expenses.length === 0
                      ? "Додайте свою першу витрату за сімейним бюджетом, щоб розпочати трекінг."
                      : "Спробуйте змінити фільтри пошуку."}
                  </p>
                  {expenses.length === 0 && (
                    <Link href="/add-expense" className="mt-4">
                      <Button size="sm">Додати першу витрату</Button>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {filteredExpenses.map((expense) => (
                    <div
                      key={expense.id}
                      className="flex items-center justify-between p-4 px-6 hover:bg-accent/40 transition-colors duration-150 group"
                    >
                      {/* Left: Category and Spender Info */}
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-lg shadow-2xs">
                          {/* Get first emoji from category if exists, or show fallback logo */}
                          {expense.category.match(/[\p{Emoji}\u200d]+/gu)?.[0] || "💰"}
                        </div>
                        <div>
                          <div className="font-semibold text-sm">
                            {/* Remove emojis for text display */}
                            {expense.category.replace(/[\p{Emoji}\u200d]+/gu, "").trim()}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                            <span className="font-medium text-foreground bg-accent px-2 py-0.5 rounded-full">
                              {expense.member}
                            </span>
                            <span>•</span>
                            <span>
                              {new Date(expense.date).toLocaleDateString("uk-UA", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })}
                            </span>
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
                          onClick={() => handleDelete(expense.id)}
                          disabled={deleteMutation.isPending}
                          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full opacity-80 group-hover:opacity-100 transition-opacity cursor-pointer"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}
