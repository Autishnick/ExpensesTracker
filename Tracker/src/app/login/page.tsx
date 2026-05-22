"use client";

import { useState } from "react";
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
import Navbar from "@/components/Navbar";

// Validation Schemas
const loginSchema = z.object({
  username: z.string().min(3, "Ім'я сім'ї має бути не менше 3 символів"),
  password: z.string().min(6, "Пароль має бути не менше 6 символів"),
});

const registerSchema = loginSchema.extend({
  confirmPassword: z.string().min(6, "Підтвердження паролю обов'язкове"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Паролі не співпадають",
  path: ["confirmPassword"],
});

type LoginFields = z.infer<typeof loginSchema>;
type RegisterFields = z.infer<typeof registerSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const currentUser = useAuthStore((state) => state.currentUser);
  const login = useAuthStore((state) => state.login);
  const register = useAuthStore((state) => state.register);
  const isHydrated = useAuthStore((state) => state.isHydrated);

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
    <>
      <Navbar />
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-12 bg-linear-to-b from-background to-accent/20">
        <div className="mx-auto w-full max-w-md">
          {/* Logo Heading */}
          <div className="flex flex-col items-center gap-2 mb-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md shadow-primary/20">
              <Wallet className="h-6 w-6 stroke-[2.2]" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">FamilyCash</h1>
            <p className="text-sm text-muted-foreground">
              {isLoginMode
                ? "Увійдіть у кабінет вашої сім'ї"
                : "Зареєструйте новий сімейний бюджет"}
            </p>
          </div>

          <Card className="border border-border/80 bg-card/60 backdrop-blur-md shadow-xl transition-all duration-300">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold tracking-tight text-center">
                {isLoginMode ? "Вхід" : "Реєстрація"}
              </CardTitle>
              <CardDescription className="text-center">
                {isLoginMode
                  ? "Введіть назву родини та пароль для доступу"
                  : "Створіть унікальне ім'я сім'ї та пароль"}
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                {/* Username */}
                <div className="space-y-2">
                  <Label htmlFor="username">Назва сім'ї (Логін)</Label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-3 h-4.5 w-4.5 text-muted-foreground" />
                    <Input
                      id="username"
                      type="text"
                      placeholder="напр. Іванови"
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
                  <Label htmlFor="password">Пароль</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4.5 w-4.5 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
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
                    <Label htmlFor="confirmPassword">Підтвердіть пароль</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4.5 w-4.5 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        className={`pl-10 ${
                          errors.confirmPassword ? "border-destructive focus-visible:ring-destructive" : ""
                        }`}
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
                      <span>Будь ласка, зачекайте...</span>
                    </>
                  ) : (
                    <>
                      <span>{isLoginMode ? "Увійти" : "Зареєструватися"}</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>

                <p className="text-sm text-center text-muted-foreground">
                  {isLoginMode ? "Ще немає облікового запису? " : "Вже зареєстровані? "}
                  <button
                    type="button"
                    onClick={toggleMode}
                    className="font-medium text-primary hover:underline hover:text-primary/95 transition-colors cursor-pointer"
                  >
                    {isLoginMode ? "Створити зараз" : "Увійти у профіль"}
                  </button>
                </p>
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>
    </>
  );
}
