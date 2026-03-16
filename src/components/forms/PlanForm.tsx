import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { planSchema, type PlanFormValues } from "../../lib/validators";
import type { Plan } from "../../types/entities";

interface PlanFormProps {
  defaultValues?: Plan;
  onSubmit: (values: PlanFormValues) => void;
}

const emptyDefaults: PlanFormValues = {
  title: "",
  description: "",
  date: new Date().toISOString().slice(0, 10),
  time: "09:00",
  status: "planned",
  priority: "medium",
  category: "Особисте",
  notifyToChannel: true,
};

export function PlanForm({ defaultValues, onSubmit }: PlanFormProps) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<PlanFormValues>({
    resolver: zodResolver(planSchema),
    defaultValues: defaultValues || emptyDefaults,
  });

  useEffect(() => {
    reset(defaultValues || emptyDefaults);
  }, [defaultValues, reset]);

  return (
    <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
      <input {...register("title")} placeholder="Назва" className="w-full rounded-xl border border-border bg-[#090d14] px-3 py-2 text-sm" />
      {errors.title && <p className="text-xs text-rose-300">{errors.title.message}</p>}

      <textarea {...register("description")} placeholder="Опис" rows={3} className="w-full rounded-xl border border-border bg-[#090d14] px-3 py-2 text-sm" />
      {errors.description && <p className="text-xs text-rose-300">{errors.description.message}</p>}

      <div className="grid grid-cols-2 gap-2">
        <input type="date" {...register("date")} className="rounded-xl border border-border bg-[#090d14] px-3 py-2 text-sm" />
        <input type="time" {...register("time")} className="rounded-xl border border-border bg-[#090d14] px-3 py-2 text-sm" />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <select {...register("status")} className="rounded-xl border border-border bg-[#090d14] px-3 py-2 text-sm">
          <option value="planned">Заплановано</option>
          <option value="done">Виконано</option>
          <option value="cancelled">Скасовано</option>
        </select>
        <select {...register("priority")} className="rounded-xl border border-border bg-[#090d14] px-3 py-2 text-sm">
          <option value="low">Низький</option>
          <option value="medium">Середній</option>
          <option value="high">Високий</option>
        </select>
      </div>

      <input {...register("category")} placeholder="Категорія" className="w-full rounded-xl border border-border bg-[#090d14] px-3 py-2 text-sm" />
      <label className="flex items-center gap-2 text-sm text-slate-300">
        <input type="checkbox" {...register("notifyToChannel")} />
        Надсилати нагадування в Telegram-канал
      </label>

      <button className="w-full rounded-xl bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-violet-500">Зберегти</button>
    </form>
  );
}

