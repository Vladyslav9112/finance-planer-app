import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { SummaryCard } from "../../components/ui/SummaryCard";
import { SalaryCard } from "../../components/cards/SalaryCard";
import { EarningsCard } from "../../components/cards/EarningsCard";
import { ModalForm } from "../../components/ui/ModalForm";
import { SalaryForm } from "../../components/forms/SalaryForm";
import { SalaryPayoutForm } from "../../components/forms/SalaryPayoutForm";
import { EarningsForm } from "../../components/forms/EarningsForm";
import { EmptyState } from "../../components/ui/EmptyState";
import { formatMoney } from "../../lib/utils";
import { useAppStore } from "../../store/useAppStore";
import type { SalaryRecord } from "../../types/entities";

const computeOwed = (record: SalaryRecord) => {
  const auto = Math.max(record.totalAmount - record.alreadyPaid, 0);
  if (typeof record.expectedToReceive === "number") return Math.max(record.expectedToReceive, 0);
  return auto;
};

export function SalaryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [openSalary, setOpenSalary] = useState(false);
  const [openEarnings, setOpenEarnings] = useState(false);
  const [payoutFor, setPayoutFor] = useState<string | null>(null);

  const salaryRecords = useAppStore((s) => s.salaryRecords);
  const earningsRecords = useAppStore((s) => s.earningsRecords);
  const addSalaryRecord = useAppStore((s) => s.addSalaryRecord);
  const addSalaryPayout = useAppStore((s) => s.addSalaryPayout);
  const addEarningsRecord = useAppStore((s) => s.addEarningsRecord);

  useEffect(() => {
    if (searchParams.get("action") === "payout") {
      const first = salaryRecords[0]?.id;
      if (first) setPayoutFor(first);
      searchParams.delete("action");
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams, salaryRecords]);

  const salarySummary = useMemo(() => {
    const total = salaryRecords.reduce((acc, item) => acc + item.totalAmount, 0);
    const paid = salaryRecords.reduce((acc, item) => acc + item.alreadyPaid, 0);
    const owed = salaryRecords.reduce((acc, item) => acc + computeOwed(item), 0);
    return { total, paid, owed };
  }, [salaryRecords]);

  return (
    <div className="space-y-4">
      <SectionHeader
        title="Склад / Зарплата"
        subtitle="ЗП + заробіток тари"
        action={
          <div className="flex gap-2">
            <button onClick={() => setOpenSalary(true)} className="rounded-xl bg-accent/25 px-3 py-2 text-xs text-violet-200">+ Зарплата</button>
            <button onClick={() => setOpenEarnings(true)} className="rounded-xl bg-accentAlt/25 px-3 py-2 text-xs text-accentAlt">+ Заробіток</button>
          </div>
        }
      />

      <section className="grid grid-cols-3 gap-2">
        <SummaryCard title="ЗП всього" value={formatMoney(salarySummary.total)} accent="violet" />
        <SummaryCard title="Вже отримано" value={formatMoney(salarySummary.paid)} accent="teal" />
        <SummaryCard title="Ще повинні" value={formatMoney(salarySummary.owed)} accent="lime" />
      </section>

      <section className="space-y-2">
        <h3 className="text-sm font-medium text-slate-300">1) Зарплата</h3>
        {salaryRecords.length === 0 ? (
          <EmptyState title="Записи ЗП відсутні" description="Додайте перший запис" />
        ) : (
          salaryRecords.map((record) => (
            <SalaryCard key={record.id} record={record} owed={computeOwed(record)} onPayout={setPayoutFor} />
          ))
        )}
      </section>

      <section className="space-y-2">
        <h3 className="text-sm font-medium text-slate-300">2) Заробіток / Тара</h3>
        {earningsRecords.length === 0 ? (
          <EmptyState title="Заробіток відсутній" description="Заповніть тари і збережіть" />
        ) : (
          earningsRecords.map((record) => <EarningsCard key={record.id} record={record} />)
        )}
      </section>

      <ModalForm open={openSalary} onClose={() => setOpenSalary(false)} title="Новий запис зарплати">
        <SalaryForm
          onSubmit={(values) => {
            addSalaryRecord({
              source: values.source,
              totalAmount: values.totalAmount,
              alreadyPaid: values.alreadyPaid,
              expectedToReceive: Number.isFinite(values.expectedToReceive) ? values.expectedToReceive : null,
              comment: values.comment,
              date: values.date,
            });
            toast.success("Запис зарплати додано");
            setOpenSalary(false);
          }}
        />
      </ModalForm>

      <ModalForm open={!!payoutFor} onClose={() => setPayoutFor(null)} title="Видати зарплату">
        {payoutFor ? (
          <SalaryPayoutForm
            salaryRecordId={payoutFor}
            onSubmit={(values) => {
              try {
                addSalaryPayout(values);
                toast.success("Виплату проведено. Дохід додано автоматично");
                setPayoutFor(null);
              } catch {
                toast.error("Не вдалося провести виплату");
              }
            }}
          />
        ) : null}
      </ModalForm>

      <ModalForm open={openEarnings} onClose={() => setOpenEarnings(false)} title="Зберегти заробіток / тару">
        <EarningsForm
          onSubmit={(payload) => {
            addEarningsRecord(payload);
            toast.success("Заробіток збережено");
            setOpenEarnings(false);
          }}
        />
      </ModalForm>
    </div>
  );
}

