import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { salaryPayoutSchema, type SalaryPayoutFormValues } from "../../lib/validators";

interface SalaryPayoutFormProps {
  salaryRecordId: string;
  onSubmit: (values: SalaryPayoutFormValues) => void;
}

export function SalaryPayoutForm({ salaryRecordId, onSubmit }: SalaryPayoutFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<SalaryPayoutFormValues>({
    resolver: zodResolver(salaryPayoutSchema),
    defaultValues: {
      salaryRecordId,
      amount: 0,
      payoutDate: new Date().toISOString().slice(0, 10),
      comment: "",
    },
  });

  return (
    <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
      <input type="hidden" {...register("salaryRecordId")} value={salaryRecordId} />
      <input type="hidden" {...register("payoutDate")} value={new Date().toISOString().slice(0, 10)} />
      <input type="hidden" {...register("comment")} value="" />
      <input type="number" {...register("amount")} placeholder="Сума виплати" className="w-full rounded-xl border border-border bg-[#090d14] px-3 py-2 text-sm" />
      {errors.amount && <p className="text-xs text-rose-300">{errors.amount.message}</p>}
      <button className="w-full rounded-xl bg-lime/20 px-4 py-2 text-sm font-medium text-lime hover:bg-lime/30">Підтвердити виплату</button>
    </form>
  );
}
