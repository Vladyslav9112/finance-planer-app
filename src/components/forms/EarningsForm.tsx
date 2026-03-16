import { useState } from "react";
import { TaraCalculator, toTaraEntries } from "../cards/TaraCalculator";

interface EarningsFormProps {
  onSubmit: (payload: { date: string; comment?: string; entries: ReturnType<typeof toTaraEntries> }) => void;
}

export function EarningsForm({ onSubmit }: EarningsFormProps) {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [comment, setComment] = useState("");
  const [quantities, setQuantities] = useState<Record<number, number>>({ 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0 });

  return (
    <form
      className="space-y-3"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit({ date, comment, entries: toTaraEntries(quantities) });
      }}
    >
      <input type="date" value={date} onChange={(event) => setDate(event.target.value)} className="w-full rounded-xl border border-border bg-[#090d14] px-3 py-2 text-sm" />
      <TaraCalculator
        quantities={quantities}
        onChange={(rate, quantity) => setQuantities((prev) => ({ ...prev, [rate]: quantity }))}
      />
      <textarea value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Коментар" rows={2} className="w-full rounded-xl border border-border bg-[#090d14] px-3 py-2 text-sm" />
      <button className="w-full rounded-xl bg-accentAlt/25 px-4 py-2 text-sm font-medium text-accentAlt hover:bg-accentAlt/35">Зберегти заробіток</button>
    </form>
  );
}

