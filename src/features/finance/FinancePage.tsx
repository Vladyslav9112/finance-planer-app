import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { SummaryCard } from "../../components/ui/SummaryCard";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { FinanceCard } from "../../components/cards/FinanceCard";
import { ModalForm } from "../../components/ui/ModalForm";
import { IncomeForm } from "../../components/forms/IncomeForm";
import { ExpenseForm } from "../../components/forms/ExpenseForm";
import { EmptyState } from "../../components/ui/EmptyState";
import { formatMoney, today } from "../../lib/utils";
import { useAppStore } from "../../store/useAppStore";

export function FinancePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [openIncome, setOpenIncome] = useState(false);
  const [openExpense, setOpenExpense] = useState(false);
  const [query, setQuery] = useState("");

  const incomes = useAppStore((s) => s.incomes);
  const expenses = useAppStore((s) => s.expenses);
  const addIncome = useAppStore((s) => s.addIncome);
  const addExpense = useAppStore((s) => s.addExpense);
  const deleteIncome = useAppStore((s) => s.deleteIncome);
  const deleteExpense = useAppStore((s) => s.deleteExpense);
  const getStatsSummary = useAppStore((s) => s.getStatsSummary);
  const stats = getStatsSummary();

  useEffect(() => {
    const action = searchParams.get("action");
    if (action === "add-income") setOpenIncome(true);
    if (action === "add-expense") setOpenExpense(true);
    if (action) {
      searchParams.delete("action");
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams]);

  const filteredIncomes = useMemo(
    () => incomes.filter((income) => income.source.toLowerCase().includes(query.toLowerCase())),
    [incomes, query],
  );

  const filteredExpenses = useMemo(
    () => expenses.filter((expense) => expense.category.toLowerCase().includes(query.toLowerCase())),
    [expenses, query],
  );

  const handleDeleteIncome = async (id: string) => {
    try {
      await deleteIncome(id);
      toast.success("Дохід видалено");
    } catch {
      toast.error("Не вдалося видалити дохід з бази");
    }
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      await deleteExpense(id);
      toast.success("Витрату видалено");
    } catch {
      toast.error("Не вдалося видалити витрату з бази");
    }
  };

  return (
    <div className="space-y-4">
      <SectionHeader
        title="Фінанси"
        subtitle="Доходи, витрати та підсумок"
        action={
          <div className="flex gap-2">
            <button onClick={() => setOpenIncome(true)} className="rounded-xl bg-emerald-500/25 px-3 py-2 text-xs text-emerald-200">+ Дохід</button>
            <button onClick={() => setOpenExpense(true)} className="rounded-xl bg-rose-500/25 px-3 py-2 text-xs text-rose-200">+ Витрата</button>
          </div>
        }
      />

      <section className="grid grid-cols-2 gap-3">
        <SummaryCard title="Баланс" value={formatMoney(stats.balance)} accent="teal" />
        <SummaryCard title="Доходи" value={formatMoney(stats.totalIncome)} accent="lime" />
        <SummaryCard title="Витрати" value={formatMoney(stats.totalExpenses)} accent="violet" />
        <SummaryCard title="Різниця" value={formatMoney(stats.totalIncome - stats.totalExpenses)} accent="teal" />
      </section>

      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Пошук по категорії / джерелу" className="w-full rounded-xl border border-border bg-panel/60 px-3 py-2 text-sm" />

      <section className="space-y-2">
        <h3 className="text-sm font-medium text-slate-300">Доходи</h3>
        {filteredIncomes.length === 0 ? (
          <EmptyState title="Доходи відсутні" description="Додайте перший дохід" />
        ) : (
          filteredIncomes.map((income) => <FinanceCard key={income.id} entry={income} type="income" onDelete={handleDeleteIncome} />)
        )}
      </section>

      <section className="space-y-2">
        <h3 className="text-sm font-medium text-slate-300">Витрати</h3>
        {filteredExpenses.length === 0 ? (
          <EmptyState title="Витрати відсутні" description="Зафіксуйте першу витрату" />
        ) : (
          filteredExpenses.map((expense) => <FinanceCard key={expense.id} entry={expense} type="expense" onDelete={handleDeleteExpense} />)
        )}
      </section>

      <ModalForm open={openIncome} onClose={() => setOpenIncome(false)} title="Новий дохід">
        <IncomeForm
          onSubmit={(values) => {
            addIncome(values);
            toast.success("Дохід додано");
            setOpenIncome(false);
          }}
        />
      </ModalForm>

      <ModalForm open={openExpense} onClose={() => setOpenExpense(false)} title="Нова витрата">
        <ExpenseForm
          onSubmit={(values) => {
            addExpense({ ...values, date: values.date || today() });
            toast.success("Витрату додано");
            setOpenExpense(false);
          }}
        />
      </ModalForm>
    </div>
  );
}
