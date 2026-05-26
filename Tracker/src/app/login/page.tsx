"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wallet, User as UserIcon, Lock, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export default function LoginPage() {
  const router = useRouter();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations();

  const currentUser = useAuthStore((state) => state.currentUser);
  const login = useAuthStore((state) => state.login);
  const register = useAuthStore((state) => state.register);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  // Dynamic Zod Validation Schemas
  const loginSchema = useMemo(() => {
    return z.object({
      username: z.string().min(3, t("login.validation.usernameMin")),
      password: z.string().min(6, t("login.validation.passwordMin")),
    });
  }, [t]);

  const registerSchema = useMemo(() => {
    return loginSchema.extend({
      confirmPassword: z.string().min(6, t("login.validation.passwordMin")),
    }).refine((data) => data.password === data.confirmPassword, {
      message: t("addExpense.validation.costLimit"),
      path: ["confirmPassword"],
    });
  }, [loginSchema, t]);

  type RegisterFields = z.infer<typeof loginSchema> & {
    confirmPassword?: string;
  };

  // Form Setup
  const {
    register: registerField,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterFields>({
    resolver: zodResolver(isLoginMode ? loginSchema : registerSchema) as any,
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    reset();
  };

  const onSubmit = async (data: RegisterFields) => {
    setIsLoading(true);
    try {
      if (isLoginMode) {
        const result = await login(data.username, data.password);
        if (result.success) {
          toast.success(`Вітаємо у системі, родина ${data.username}!`);
          router.push("/");
        } else {
          toast.error(result.error || "Помилка входу");
        }
      } else {
        const result = await register(data.username, data.password);
        if (result.success) {
          toast.success(`Профіль родини ${data.username} успішно створено!`);
          router.push("/");
        } else {
          toast.error(result.error || "Помилка реєстрації");
        }
      }
    } catch (err) {
      toast.error("Щось пішло не так. Спробуйте ще раз.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-12 bg-linear-to-b from-background to-accent/20">
      <div className="mx-auto w-full max-w-md">
        {/* Logo Heading */}
        <div className="flex flex-col items-center gap-2 mb-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md shadow-primary/20">
            <Wallet className="h-6 w-6 stroke-[2.2]" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">FamilyCash</h1>
          <p className="text-sm text-muted-foreground">
            {isLoginMode ? t("login.subtitle") : t("login.subtitleRegister")}
          </p>
        </div>

        <Card className="border border-border/80 bg-card/60 backdrop-blur-md shadow-xl transition-all duration-300">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight text-center">
              {isLoginMode ? t("login.buttonLogin") : t("login.buttonRegister")}
            </CardTitle>
            <CardDescription className="text-center">
              {isLoginMode ? t("login.cardDescriptionLogin") : t("login.cardDescriptionRegister")}
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username">{t("login.labelUsername")}</Label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-3 h-4.5 w-4.5 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    placeholder={t("login.placeholderUsername")}
                    className={`pl-10 ${errors.username ? "border-destructive focus-visible:ring-destructive" : ""}`}
                    {...registerField("username")}
                  />
                </div>
                {errors.username && (
                  <p className="text-xs font-medium text-destructive">{errors.username.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">{t("login.labelPassword")}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4.5 w-4.5 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder={t("login.placeholderPassword")}
                    className={`pl-10 ${errors.password ? "border-destructive focus-visible:ring-destructive" : ""}`}
                    {...registerField("password")}
                  />
                </div>
                {errors.password && (
                  <p className="text-xs font-medium text-destructive">{errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password (only in Register Mode) */}
              {!isLoginMode && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">{t("login.confirmPassword")}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4.5 w-4.5 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      className={`pl-10 ${errors.confirmPassword ? "border-destructive focus-visible:ring-destructive" : ""}`}
                      {...registerField("confirmPassword")}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs font-medium text-destructive">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              )}
            </CardContent>

            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full flex gap-2 font-medium" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>{t("login.pleaseWait")}</span>
                  </>
                ) : (
                  <>
                    <span>{isLoginMode ? t("login.buttonLogin") : t("login.buttonRegister")}</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>

              <p className="text-sm text-center text-muted-foreground">
                {isLoginMode ? t("login.noAccount") : t("login.hasAccount")}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="font-medium text-primary hover:underline hover:text-primary/95 transition-colors cursor-pointer ml-1"
                >
                  {isLoginMode ? t("login.createAccount") : t("login.loginAccount")}
                </button>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </main>
  );
}
