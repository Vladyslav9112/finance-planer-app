import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { salarySchema, type SalaryFormValues } from "../../lib/validators";

interface SalaryFormProps {
  onSubmit: (values: SalaryFormValues) => void;
}

export function SalaryForm({ onSubmit }: SalaryFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<SalaryFormValues>({
    resolver: zodResolver(salarySchema),
    defaultValues: {
      source: "",
      totalAmount: 0,
      alreadyPaid: 0,
      expectedToReceive: Number.NaN,
      comment: "",
      date: new Date().toISOString().slice(0, 10),
    },
  });

  return (
    <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
      <input {...register("source")} placeholder="Назва / джерело" className="w-full rounded-xl border border-border bg-[#090d14] px-3 py-2 text-sm" />
      <div className="grid grid-cols-2 gap-2">
        <input type="number" {...register("totalAmount")} placeholder="Загальна сума" className="rounded-xl border border-border bg-[#090d14] px-3 py-2 text-sm" />
        <input type="number" {...register("alreadyPaid")} placeholder="Вже виплачено" className="rounded-xl border border-border bg-[#090d14] px-3 py-2 text-sm" />
      </div>
      <input type="number" {...register("expectedToReceive")} placeholder="Скільки ще повинні видати (ручне, опціонально)" className="w-full rounded-xl border border-border bg-[#090d14] px-3 py-2 text-sm" />
      <textarea {...register("comment")} placeholder="Коментар" rows={2} className="w-full rounded-xl border border-border bg-[#090d14] px-3 py-2 text-sm" />
      <input type="date" {...register("date")} className="w-full rounded-xl border border-border bg-[#090d14] px-3 py-2 text-sm" />
      {(errors.source || errors.totalAmount) && <p className="text-xs text-rose-300">Перевірте обов'язкові поля</p>}
      <button className="w-full rounded-xl bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-violet-500">Зберегти запис ЗП</button>
    </form>
  );
}

