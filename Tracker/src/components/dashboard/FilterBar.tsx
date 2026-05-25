"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, SlidersHorizontal } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface FilterBarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
  selectedMember: string;
  setSelectedMember: (val: string) => void;
  sortBy: string;
  setSortBy: (val: string) => void;
  categories: string[];
  uniqueMembers: string[];
}

export default function FilterBar({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedMember,
  setSelectedMember,
  sortBy,
  setSortBy,
  categories,
  uniqueMembers,
}: FilterBarProps) {
  const { t } = useTranslation();

  return (
    <Card className="border-border/80 bg-card/40 backdrop-blur-md p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4.5 w-4.5 text-muted-foreground" />
          <Input
            placeholder={t("dashboard.filters.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center sm:gap-4">
          {/* Category Filter */}
          <div className="min-w-[140px] flex-1">
            <Select
              value={selectedCategory}
              onValueChange={(val) => setSelectedCategory(val || "all")}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("dashboard.filters.categoryAll")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("dashboard.filters.categoryAll")}</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {t(`categoriesMap.${cat}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Member Filter */}
          <div className="min-w-[140px] flex-1">
            <Select
              value={selectedMember}
              onValueChange={(val) => setSelectedMember(val || "all")}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("dashboard.filters.memberAll")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("dashboard.filters.memberAll")}</SelectItem>
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
            <Select
              value={sortBy}
              onValueChange={(val) => setSortBy(val || "date-desc")}
            >
              <SelectTrigger className="w-full">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
                  <SelectValue placeholder={t("dashboard.filters.sortPlaceholder")} />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-desc">{t("dashboard.filters.sortNewest")}</SelectItem>
                <SelectItem value="date-asc">{t("dashboard.filters.sortOldest")}</SelectItem>
                <SelectItem value="cost-desc">{t("dashboard.filters.sortExpensive")}</SelectItem>
                <SelectItem value="cost-asc">{t("dashboard.filters.sortCheapest")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </Card>
  );
}
