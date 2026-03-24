import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Save } from "lucide-react";
import { cn, today } from "../../lib/utils";
import {
  PLAN_CATEGORIES,
  PRIORITY_LABELS,
  STATUS_LABELS,
} from "../../lib/constants";
import type { Plan, PlanStatus, PlanPriority } from "../../types";

const schema = z.object({
  title: z.string().min(1, "Назва обов'язкова").max(100, "Надто довга назва"),
  description: z.string().max(500).optional(),
  date: z.string().min(1, "Дата обов'язкова"),
  time: z.string().optional(),
  status: z.enum(["scheduled", "completed", "cancelled"] as const),
  priority: z.enum(["low", "medium", "high"] as const),
  category: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface PlanFormProps {
  initial?: Plan;
  onSubmit: (data: FormValues) => void;
  onCancel: () => void;
}

const inputClass =
  "w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-accent-teal/50 transition-colors";
const labelClass = "block text-xs font-600 text-white/45 mb-1.5";
const errorClass = "text-xs text-rose-400 mt-1";

export const PlanForm: React.FC<PlanFormProps> = ({
  initial,
  onSubmit,
  onCancel,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: initial
      ? {
          title: initial.title,
          description: initial.description,
          date: initial.date,
          time: initial.time,
          status: initial.status,
          priority: initial.priority,
          category: initial.category,
        }
      : {
          date: today(),
          status: "scheduled",
          priority: "medium",
        },
  });

  useEffect(() => {
    if (initial) {
      reset({
        title: initial.title,
        description: initial.description,
        date: initial.date,
        time: initial.time,
        status: initial.status,
        priority: initial.priority,
        category: initial.category,
      });
    }
  }, [initial, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pb-2">
      {/* Title */}
      <div>
        <label className={labelClass}>Назва *</label>
        <input
          {...register("title")}
          placeholder="Введіть назву плану..."
          className={cn(inputClass, errors.title && "border-rose-500/50")}
        />
        {errors.title && <p className={errorClass}>{errors.title.message}</p>}
      </div>

      {/* Description */}
      <div>
        <label className={labelClass}>Опис</label>
        <textarea
          {...register("description")}
          placeholder="Деталі або нотатки..."
          rows={3}
          className={cn(inputClass, "resize-none")}
        />
      </div>

      {/* Date & Time */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Дата *</label>
          <input
            type="date"
            {...register("date")}
            className={cn(inputClass, errors.date && "border-rose-500/50")}
          />
          {errors.date && <p className={errorClass}>{errors.date.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Час</label>
          <input type="time" {...register("time")} className={inputClass} />
        </div>
      </div>

      {/* Priority & Status */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Пріоритет</label>
          <select {...register("priority")} className={inputClass}>
            {(["low", "medium", "high"] as PlanPriority[]).map((v) => (
              <option key={v} value={v} className="bg-surface-3">
                {PRIORITY_LABELS[v]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Статус</label>
          <select {...register("status")} className={inputClass}>
            {(["scheduled", "completed", "cancelled"] as PlanStatus[]).map(
              (v) => (
                <option key={v} value={v} className="bg-surface-3">
                  {STATUS_LABELS[v]}
                </option>
              ),
            )}
          </select>
        </div>
      </div>

      {/* Category */}
      <div>
        <label className={labelClass}>Категорія</label>
        <select {...register("category")} className={inputClass}>
          <option value="" className="bg-surface-3">
            Без категорії
          </option>
          {PLAN_CATEGORIES.map((c) => (
            <option key={c} value={c} className="bg-surface-3">
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 rounded-xl border border-white/[0.08] text-white/50 text-sm font-600 hover:border-white/15 hover:text-white/70 transition-colors"
        >
          Скасувати
        </button>
        <button
          type="submit"
          className="flex-1 py-3 rounded-xl bg-accent-teal/20 border border-accent-teal/40 text-accent-teal text-sm font-700 hover:bg-accent-teal/30 transition-all flex items-center justify-center gap-2"
        >
          <Save size={15} />
          {initial ? "Зберегти" : "Додати план"}
        </button>
      </div>
    </form>
  );
};
