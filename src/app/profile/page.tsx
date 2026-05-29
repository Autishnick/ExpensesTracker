"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useTranslations } from "next-intl";
import { useExpensesQuery } from "@/hooks/useExpenses";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

// Refactored modular subcomponents
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileStats from "@/components/profile/ProfileStats";
import ProfileEditForm from "@/components/profile/ProfileEditForm";
import MembersContribution from "@/components/profile/MembersContribution";

export default function ProfilePage() {
  const router = useRouter();
  const currentUser = useAuthStore((state) => state.currentUser);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const t = useTranslations("profile");
  const tGlobal = useTranslations();

  // Local state for profile form
  const [newName, setNewName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("🏠");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Set initial form values when current user hydrates
  useEffect(() => {
    if (currentUser) {
      setNewName(currentUser.username);
      setSelectedAvatar(currentUser.avatar || "🏠");
    }
  }, [currentUser]);

  // Fetch expenses for calculation
  const { data: expenses = [], isLoading } = useExpensesQuery(!!currentUser);

  // Calculate statistics
  const stats = useMemo(() => {
    if (!expenses.length) {
      return {
        total: 0,
        count: 0,
        average: 0,
        max: 0,
      };
    }
    const total = expenses.reduce((sum, e) => sum + e.cost, 0);
    const count = expenses.length;
    const average = total / count;
    const max = Math.max(...expenses.map((e) => e.cost));

    return {
      total,
      count,
      average,
      max,
    };
  }, [expenses]);

  // Aggregate stats per family member (extracted from expenses)
  const membersData = useMemo(() => {
    if (!expenses.length) return [];

    const grouping: Record<string, { name: string; total: number; count: number }> = {};
    expenses.forEach((e) => {
      const name = e.member.trim() || "Unknown";
      if (!grouping[name]) {
        grouping[name] = { name, total: 0, count: 0 };
      }
      grouping[name].total += e.cost;
      grouping[name].count += 1;
    });

    const totalCost = stats.total;

    return Object.values(grouping)
      .map((m) => ({
        ...m,
        share: totalCost > 0 ? (m.total / totalCost) * 100 : 0,
      }))
      .sort((a, b) => b.total - a.total);
  }, [expenses, stats.total]);

  // Form submission handler
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    setError(null);
    setIsSaving(true);

    try {
      const res = await updateProfile(newName, selectedAvatar);
      if (res.success) {
        toast.success(t("successMessage"));
      } else {
        setError(res.error || "Помилка при оновленні профілю");
        toast.error(res.error || "Помилка при оновленні профілю");
      }
    } catch (err) {
      setError("Щось пішло не так");
      toast.error("Щось пішло не так");
    } finally {
      setIsSaving(false);
    }
  };

  // Redirect to login if user not found (safe useEffect side-effect redirect)
  useEffect(() => {
    if (isHydrated && !currentUser) {
      router.push("/login");
    }
  }, [isHydrated, currentUser, router]);

  // Loader / Redirect state
  if (!isHydrated || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm font-medium text-muted-foreground animate-pulse">
            {tGlobal("login.pleaseWait")}
          </p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  return (
    <main className="flex-1 bg-gradient-to-b from-background to-accent/15 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-8">
        
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>{t("backToDashboard")}</span>
        </Link>

        {/* Profile Card Header Component */}
        <ProfileHeader currentUser={currentUser} subtitle={t("subtitle")} />

        {/* Overview Stats Cards Component */}
        <ProfileStats stats={stats} />

        {/* Two-Column Form & Members Section */}
        <div className="grid gap-6 md:grid-cols-5">
          
          {/* Profile Edit Card Component (takes 2 cols) */}
          <ProfileEditForm
            newName={newName}
            setNewName={setNewName}
            selectedAvatar={selectedAvatar}
            setSelectedAvatar={setSelectedAvatar}
            onSubmit={handleSave}
            isSaving={isSaving}
            error={error}
            defaultPlaceholder={currentUser.username}
          />

          {/* Family Members Breakdown section Component (takes 3 cols) */}
          <MembersContribution membersData={membersData} />

        </div>

      </div>
    </main>
  );
}