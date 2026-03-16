import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { incomeSchema, type IncomeFormValues } from "../../lib/validators";

interface IncomeFormProps {
  onSubmit: (values: IncomeFormValues) => void;
}

export function IncomeForm({ onSubmit }: IncomeFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<IncomeFormValues>({
    resolver: zodResolver(incomeSchema),
    defaultValues: {
      amount: 0,
      source: "",
      comment: "",
      date: new Date().toISOString().slice(0, 10),
      incomeType: "other",
      status: "received",
    },
  });

  return (
    <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
      <input type="number" step="1" {...register("amount")} placeholder="Сума" className="w-full rounded-xl border border-border bg-[#090d14] px-3 py-2 text-sm" />
      {errors.amount && <p className="text-xs text-rose-300">{errors.amount.message}</p>}
      <input {...register("source")} placeholder="Джерело" className="w-full rounded-xl border border-border bg-[#090d14] px-3 py-2 text-sm" />
      <textarea {...register("comment")} placeholder="Коментар" rows={2} className="w-full rounded-xl border border-border bg-[#090d14] px-3 py-2 text-sm" />
      <div className="grid grid-cols-2 gap-2">
        <input type="date" {...register("date")} className="rounded-xl border border-border bg-[#090d14] px-3 py-2 text-sm" />
        <select {...register("incomeType")} className="rounded-xl border border-border bg-[#090d14] px-3 py-2 text-sm">
          <option value="salary">Зарплата</option>
          <option value="freelance">Фріланс</option>
          <option value="gift">Подарунок</option>
          <option value="other">Інше</option>
        </select>
      </div>
      <button className="w-full rounded-xl bg-accentAlt/25 px-4 py-2 text-sm font-medium text-accentAlt hover:bg-accentAlt/35">Додати дохід</button>
    </form>
  );
}

