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
      source: "Зарплата",
      totalAmount: 0,
      alreadyPaid: 0,
      expectedToReceive: undefined,
      comment: "",
      date: new Date().toISOString().slice(0, 10),
    },
  });

  return (
    <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
      <input type="hidden" {...register("source")} value="Зарплата" />
      <input type="hidden" {...register("alreadyPaid", { valueAsNumber: true })} value={0} />
      <input type="hidden" {...register("date")} value={new Date().toISOString().slice(0, 10)} />
      <input type="number" {...register("totalAmount")} placeholder="Сума зарплати" className="w-full rounded-xl border border-border bg-[#090d14] px-3 py-2 text-sm" />
      {errors.totalAmount && <p className="text-xs text-rose-300">{errors.totalAmount.message}</p>}
      <button className="w-full rounded-xl bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-violet-500">Зберегти зарплату</button>
    </form>
  );
}
