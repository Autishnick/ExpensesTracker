"use client";

import { useEffect, useState, ComponentType } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useAuthStore } from "@/store/useAuthStore";
import { useTranslations, useLocale } from "next-intl";
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

interface NavLinkProps {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  activeClass: (href: string) => string;
  onClick?: () => void;
  className?: string;
  iconClassName?: string;
}

function NavLink({
  href,
  label,
  icon: Icon,
  activeClass,
  onClick,
  className = "",
  iconClassName = "h-4 w-4",
}: NavLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center rounded-lg transition-colors ${activeClass(href)} ${className}`}
    >
      <Icon className={iconClassName} />
      <span>{label}</span>
    </Link>
  );
}

interface LanguageSwitcherProps {
  language: string;
  className?: string;
}

function LanguageSwitcher({ language, className = "" }: LanguageSwitcherProps) {
  const toggleLanguage = () => {
    const nextLocale = language === "uk" ? "en" : "uk";
    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000`;
    window.location.reload();
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className={`font-bold text-xs uppercase rounded-lg hover:bg-accent hover:text-accent-foreground cursor-pointer ${className}`}
      aria-label="Switch language"
    >
      {language === "uk" ? "EN" : "UA"}
    </Button>
  );
}

interface ThemeToggleProps {
  mounted: boolean;
  resolvedTheme: string | undefined;
  setTheme: (theme: string) => void;
  className?: string;
}

function ThemeToggle({ mounted, resolvedTheme, setTheme, className = "" }: ThemeToggleProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className={`rounded-full cursor-pointer ${className}`}
      aria-label="Toggle theme"
    >
      {mounted && resolvedTheme === "dark" ? (
        <Sun className="h-5 w-5 text-yellow-500" />
      ) : (
        <Moon className="h-5 w-5 text-slate-700 dark:text-slate-300" />
      )}
    </Button>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const t = useTranslations();
  const language = useLocale();
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
    toast.info(language === "uk" ? "Ви вийшли з профілю" : "Logged out successfully");
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
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                label={link.label}
                icon={link.icon}
                activeClass={activeClass}
                className="gap-2 px-4 py-2 text-sm font-medium"
              />
            ))}
          </nav>
        )}

        {/* Actions */}
        <div className="hidden md:flex md:items-center md:gap-4">
          {/* Language Switcher */}
          <LanguageSwitcher
            language={language}
            className="px-2.5 py-1.5 h-8"
          />

          {/* Theme Toggle */}
          <ThemeToggle
            mounted={mounted}
            resolvedTheme={resolvedTheme}
            setTheme={setTheme}
            className="transition-transform active:scale-95"
          />

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
                  {language === "uk" ? "Увійти" : "Login"}
                </Button>
              </Link>
            )
          )}
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-2 md:hidden">
          {/* Language Switcher */}
          <LanguageSwitcher
            language={language}
            className="px-2 h-9"
          />

          {/* Theme Toggle */}
          <ThemeToggle
            mounted={mounted}
            resolvedTheme={resolvedTheme}
            setTheme={setTheme}
          />

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
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                label={link.label}
                icon={link.icon}
                activeClass={activeClass}
                onClick={() => setMobileMenuOpen(false)}
                className="gap-3 px-4 py-3 text-base font-medium"
                iconClassName="h-5 w-5"
              />
            ))}
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
