import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { expenseSchema, type ExpenseFormValues } from "../../lib/validators";

interface ExpenseFormProps {
  onSubmit: (values: ExpenseFormValues) => void;
}

export function ExpenseForm({ onSubmit }: ExpenseFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      amount: 0,
      category: "",
      comment: "",
      date: new Date().toISOString().slice(0, 10),
    },
  });

  return (
    <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
      <input type="number" step="1" {...register("amount")} placeholder="Сума" className="w-full rounded-xl border border-border bg-[#090d14] px-3 py-2 text-sm" />
      {errors.amount && <p className="text-xs text-rose-300">{errors.amount.message}</p>}
      <input {...register("category")} placeholder="Категорія" className="w-full rounded-xl border border-border bg-[#090d14] px-3 py-2 text-sm" />
      <textarea {...register("comment")} placeholder="Коментар" rows={2} className="w-full rounded-xl border border-border bg-[#090d14] px-3 py-2 text-sm" />
      <input type="date" {...register("date")} className="w-full rounded-xl border border-border bg-[#090d14] px-3 py-2 text-sm" />
      <button className="w-full rounded-xl bg-rose-500/30 px-4 py-2 text-sm font-medium text-rose-200 hover:bg-rose-500/40">Додати витрату</button>
    </form>
  );
}

