import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Save } from "lucide-react";
import { cn, today } from "../../lib/utils";
import { INCOME_TYPES } from "../../lib/constants";
import type { Income, IncomeType } from "../../types";

const schema = z.object({
  amount: z.coerce.number().positive("Сума має бути більше 0"),
  source: z.string().min(1, "Джерело обов'язкове"),
  comment: z.string().optional(),
  date: z.string().min(1, "Дата обов'язкова"),
  type: z.enum([
    "salary_payout",
    "freelance",
    "business",
    "investment",
    "bonus",
    "other",
  ] as const),
});

type FormValues = z.infer<typeof schema>;

interface IncomeFormProps {
  initial?: Income;
  onSubmit: (data: FormValues) => void;
  onCancel: () => void;
}

const inputClass =
  "w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-accent-lime/50 transition-colors";
const labelClass = "block text-xs font-600 text-white/45 mb-1.5";
const errorClass = "text-xs text-rose-400 mt-1";

export const IncomeForm: React.FC<IncomeFormProps> = ({
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
          amount: initial.amount,
          source: initial.source,
          comment: initial.comment,
          date: initial.date,
          type: initial.type,
        }
      : { date: today(), type: "other" },
  });

  useEffect(() => {
    if (initial) {
      reset({
        amount: initial.amount,
        source: initial.source,
        comment: initial.comment,
        date: initial.date,
        type: initial.type,
      });
    }
  }, [initial, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pb-2">
      {/* Amount */}
      <div>
        <label className={labelClass}>Сума (₴) *</label>
        <input
          type="number"
          step="0.01"
          min="0"
          {...register("amount")}
          placeholder="0.00"
          className={cn(inputClass, errors.amount && "border-rose-500/50")}
        />
        {errors.amount && <p className={errorClass}>{errors.amount.message}</p>}
      </div>

      {/* Source */}
      <div>
        <label className={labelClass}>Джерело *</label>
        <input
          {...register("source")}
          placeholder="Назва джерела доходу..."
          className={cn(inputClass, errors.source && "border-rose-500/50")}
        />
        {errors.source && <p className={errorClass}>{errors.source.message}</p>}
      </div>

      {/* Type */}
      <div>
        <label className={labelClass}>Тип доходу</label>
        <select {...register("type")} className={inputClass}>
          {INCOME_TYPES.map(({ value, label }) => (
            <option key={value} value={value} className="bg-surface-3">
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Date */}
      <div>
        <label className={labelClass}>Дата *</label>
        <input
          type="date"
          {...register("date")}
          className={cn(inputClass, errors.date && "border-rose-500/50")}
        />
        {errors.date && <p className={errorClass}>{errors.date.message}</p>}
      </div>

      {/* Comment */}
      <div>
        <label className={labelClass}>Коментар</label>
        <textarea
          {...register("comment")}
          placeholder="Необов'язкова нотатка..."
          rows={2}
          className={cn(inputClass, "resize-none")}
        />
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
          className="flex-1 py-3 rounded-xl bg-accent-lime/20 border border-accent-lime/40 text-accent-lime text-sm font-700 hover:bg-accent-lime/30 transition-all flex items-center justify-center gap-2"
        >
          <Save size={15} />
          {initial ? "Зберегти" : "Додати дохід"}
        </button>
      </div>
    </form>
  );
};
