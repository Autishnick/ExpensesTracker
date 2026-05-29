import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getExpenses, addExpense, deleteExpense, clearExpenses, Expense } from "@/lib/api";
import { toast } from "sonner";

export const expenseKeys = {
  all: ["expenses"] as const,
};

export function useExpensesQuery(enabled: boolean) {
  return useQuery({
    queryKey: expenseKeys.all,
    queryFn: getExpenses,
    enabled,
  });
}

export function useAddExpenseMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expenseKeys.all });
      toast.success("Витрату успішно додано");
    },
    onError: () => {
      toast.error("Помилка при додаванні витрати");
    },
  });
}

export function useDeleteExpenseMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteExpense,
    onMutate: async (expenseId: string) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: expenseKeys.all });

      // Snapshot the previous value
      const previousExpenses = queryClient.getQueryData<Expense[]>(expenseKeys.all);

      // Optimistically update to the new value by filtering out the deleted expense
      if (previousExpenses) {
        queryClient.setQueryData<Expense[]>(
          expenseKeys.all,
          previousExpenses.filter((expense) => expense.id !== expenseId)
        );
      }

      // Return a context object with the snapshotted value
      return { previousExpenses };
    },
    onError: (err, expenseId, context) => {
      // Rollback to the previous snapshot on failure
      if (context?.previousExpenses) {
        queryClient.setQueryData(expenseKeys.all, context.previousExpenses);
      }
      toast.error("Помилка при видаленні витрати");
    },
    onSuccess: () => {
      toast.success("Витрату успішно видалено");
    },
    onSettled: () => {
      // Always refetch or invalidate queries to sync back with storage/server
      queryClient.invalidateQueries({ queryKey: expenseKeys.all });
    },
  });
}

export function useClearExpensesMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clearExpenses,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expenseKeys.all });
      toast.success("Всі витрати успішно очищено");
    },
    onError: () => {
      toast.error("Помилка при очищенні витрат");
    },
  });
}
