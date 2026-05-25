"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useAuthStore } from "@/store/useAuthStore";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  PlusCircle,
  PieChart,
  Sun,
  Moon,
  LogOut,
  User as UserIcon,
  Wallet,
  Menu,
  X,
} from "lucide-react";
import { toast } from "sonner";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { t, language, setLanguage } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const currentUser = useAuthStore((state) => state.currentUser);
  const logout = useAuthStore((state) => state.logout);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
    toast.info(language === "ua" ? "Ви вийшли з профілю" : "Logged out successfully");
    router.push("/login");
  };

  const navLinks = [
    { href: "/", label: t("navbar.dashboard"), icon: LayoutDashboard },
    { href: "/add-expense", label: t("navbar.addExpense"), icon: PlusCircle },
    { href: "/diagrams", label: t("navbar.analytics"), icon: PieChart },
  ];

  const activeClass = (href: string) => {
    const isActive = pathname === href;
    return isActive
      ? "bg-primary text-primary-foreground shadow-sm"
      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-xl tracking-tight text-primary transition-transform hover:scale-102"
        >
          <Wallet className="h-6 w-6 stroke-[2.5]" />
          <span>FamilyCash</span>
        </Link>

        {/* Desktop Navigation */}
        {isHydrated && currentUser && (
          <nav className="hidden md:flex md:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${activeClass(
                    link.href
                  )}`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        )}

        {/* Actions */}
        <div className="hidden md:flex md:items-center md:gap-4">
          {/* Language Switcher */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLanguage(language === "ua" ? "en" : "ua")}
            className="font-bold text-xs uppercase px-2.5 py-1.5 h-8 rounded-lg hover:bg-accent hover:text-accent-foreground cursor-pointer"
            aria-label="Switch language"
          >
            {language === "ua" ? "EN" : "UA"}
          </Button>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="rounded-full transition-transform active:scale-95 cursor-pointer"
            aria-label="Toggle theme"
          >
            {mounted && resolvedTheme === "dark" ? (
              <Sun className="h-5 w-5 text-yellow-500" />
            ) : (
              <Moon className="h-5 w-5 text-slate-700 dark:text-slate-300" />
            )}
          </Button>

          {/* User Section */}
          {isHydrated && currentUser ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 rounded-full bg-accent/60 pl-3 pr-4 py-1.5 border border-border">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <UserIcon className="h-3.5 w-3.5" />
                </div>
                <span className="text-sm font-medium max-w-[120px] truncate">
                  {currentUser.username}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2 border-destructive/20 hover:bg-destructive/10 hover:text-destructive text-muted-foreground cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                <span>{t("navbar.logout")}</span>
              </Button>
            </div>
          ) : (
            pathname !== "/login" && (
              <Link href="/login">
                <Button size="sm" className="cursor-pointer">
                  {language === "ua" ? "Увійти" : "Login"}
                </Button>
              </Link>
            )
          )}
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-2 md:hidden">
          {/* Language Switcher */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLanguage(language === "ua" ? "en" : "ua")}
            className="font-bold text-xs uppercase px-2 h-9 rounded-lg hover:bg-accent hover:text-accent-foreground cursor-pointer"
            aria-label="Switch language"
          >
            {language === "ua" ? "EN" : "UA"}
          </Button>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="rounded-full cursor-pointer"
            aria-label="Toggle theme"
          >
            {mounted && resolvedTheme === "dark" ? (
              <Sun className="h-5 w-5 text-yellow-500" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          {isHydrated && currentUser && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="cursor-pointer"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Mobile menu panel */}
      {mobileMenuOpen && isHydrated && currentUser && (
        <div className="md:hidden border-t border-border bg-background px-4 py-4 space-y-3 transition-all duration-300">
          <div className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium transition-colors ${activeClass(
                    link.href
                  )}`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-4 border-t border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                <UserIcon className="h-4 w-4" />
              </div>
              <span className="text-sm font-semibold truncate max-w-[150px]">
                {currentUser.username}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              className="flex items-center gap-2 border-destructive/20 text-destructive hover:bg-destructive/10 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>{t("navbar.logout")}</span>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
