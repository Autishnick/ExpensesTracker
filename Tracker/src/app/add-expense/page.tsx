"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuthStore } from "@/store/useAuthStore";
import { useTranslation } from "@/hooks/useTranslation";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, ArrowLeft, PlusCircle, CreditCard, User, Tag } from "lucide-react";
import Link from "next/link";
import { useAddExpenseMutation } from "@/hooks/useExpenses";

const categories = [
  "🛒Products",
  "🚌Transport",
  "⚽Entertainment",
  "👗Clothing and shoes",
  "🏥Medicine",
  "📰Utilities and Internet",
  "📨Other",
];

export default function AddExpensePage() {
  const router = useRouter();
  const currentUser = useAuthStore((state) => state.currentUser);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const { t } = useTranslation();

  // Dynamic Zod Validation Schema inside the component to react to language changes
  const expenseSchema = useMemo(() => {
    return z.object({
      member: z
        .string()
        .min(2, t("addExpense.validation.memberMin"))
        .max(30, t("addExpense.validation.memberMax")),
      category: z.string().min(1, t("addExpense.validation.categoryRequired")),
      cost: z
        .number({ message: t("addExpense.validation.costRequired") })
        .refine((val) => !isNaN(val), t("addExpense.validation.costNumber"))
        .refine((val) => val > 0, t("addExpense.validation.costPositive"))
        .refine((val) => val <= 1000000, t("addExpense.validation.costLimit")),
    });
  }, [t]);

  type ExpenseFields = z.infer<typeof expenseSchema>;

  // Form Setup
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ExpenseFields>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      member: "",
      category: "",
      cost: undefined as any,
    },
  });

  // React Query Mutation Hook
  const addMutation = useAddExpenseMutation();

  const onSubmit = (data: ExpenseFields) => {
    addMutation.mutate(data, {
      onSuccess: () => {
        reset();
        router.push("/");
      },
    });
  };

  if (!isHydrated || !currentUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-linear-to-b from-background to-accent/15 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-lg space-y-6">
          {/* Back button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>{t("addExpense.backButton")}</span>
          </Link>

          <Card className="border border-border/80 bg-card/60 backdrop-blur-md shadow-xl transition-all duration-300">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold tracking-tight text-center">
                {t("addExpense.title")}
              </CardTitle>
              <CardDescription className="text-center">
                {t("addExpense.subtitle")}
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit(onSubmit)}>
              <CardContent className="space-y-5">
                {/* Family Member */}
                <div className="space-y-2">
                  <Label htmlFor="member" className="flex items-center gap-1.5 font-medium">
                    <User className="h-4 w-4 text-muted-foreground" />
                    {t("addExpense.labelMember")}
                  </Label>
                  <Input
                    id="member"
                    type="text"
                    placeholder={t("addExpense.placeholderMember")}
                    className={`${errors.member ? "border-destructive focus-visible:ring-destructive" : ""}`}
                    {...register("member")}
                  />
                  {errors.member && (
                    <p className="text-xs font-medium text-destructive">{errors.member.message}</p>
                  )}
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="category" className="flex items-center gap-1.5 font-medium">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    {t("addExpense.labelCategory")}
                  </Label>
                  <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger
                          className={`w-full ${
                            errors.category ? "border-destructive focus-visible:ring-destructive" : ""
                          }`}
                        >
                          <SelectValue placeholder={t("addExpense.placeholderCategory")} />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {t(`categoriesMap.${cat}`)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.category && (
                    <p className="text-xs font-medium text-destructive">{errors.category.message}</p>
                  )}
                </div>

                {/* Cost */}
                <div className="space-y-2">
                  <Label htmlFor="cost" className="flex items-center gap-1.5 font-medium">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    {t("addExpense.labelCost")}
                  </Label>
                  <div className="relative">
                    <Input
                      id="cost"
                      type="number"
                      step="0.01"
                      placeholder={t("addExpense.placeholderCost")}
                      className={`${errors.cost ? "border-destructive focus-visible:ring-destructive" : ""}`}
                      {...register("cost", { valueAsNumber: true })}
                    />
                  </div>
                  {errors.cost && (
                    <p className="text-xs font-medium text-destructive">{errors.cost.message}</p>
                  )}
                </div>
              </CardContent>

              <CardFooter className="flex flex-col gap-4">
                <Button
                  type="submit"
                  disabled={addMutation.isPending}
                  className="w-full flex items-center justify-center gap-2 cursor-pointer"
                >
                  {addMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>{t("addExpense.submittingButton")}</span>
                    </>
                  ) : (
                    <>
                      <PlusCircle className="h-4.5 w-4.5" />
                      <span>{t("addExpense.submitButton")}</span>
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>
    </>
  );
}
