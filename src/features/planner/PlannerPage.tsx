import { useEffect, useMemo, useState } from "react";
import { CalendarPlus } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { PlanCard } from "../../components/cards/PlanCard";
import { PlanForm } from "../../components/forms/PlanForm";
import { EmptyState } from "../../components/ui/EmptyState";
import { ModalForm } from "../../components/ui/ModalForm";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { useAppStore } from "../../store/useAppStore";
import type { Plan } from "../../types/entities";
import type { PlanFormValues } from "../../lib/validators";

export function PlannerPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [open, setOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("");

  const plans = useAppStore((s) => s.plans);
  const addPlan = useAppStore((s) => s.addPlan);
  const updatePlan = useAppStore((s) => s.updatePlan);
  const deletePlan = useAppStore((s) => s.deletePlan);
  const markPlanDone = useAppStore((s) => s.markPlanDone);
  const sendPlan = useAppStore((s) => s.sendPlan);

  useEffect(() => {
    if (searchParams.get("action") === "add-plan") {
      setOpen(true);
      searchParams.delete("action");
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams]);

  const filteredPlans = useMemo(
    () =>
      plans.filter((plan) => {
        const byStatus = statusFilter === "all" ? true : plan.status === statusFilter;
        const byDate = dateFilter ? plan.date === dateFilter : true;
        return byStatus && byDate;
      }),
    [plans, statusFilter, dateFilter],
  );

  const onSubmit = (values: PlanFormValues) => {
    if (editingPlan) {
      updatePlan(editingPlan.id, values);
      toast.success("План оновлено");
    } else {
      addPlan(values);
      toast.success("План додано");
    }
    setEditingPlan(undefined);
    setOpen(false);
  };

  return (
    <div className="space-y-4">
      <SectionHeader
        title="Планер"
        subtitle="Керуйте задачами та надсилайте в Telegram-канал"
        action={<button onClick={() => setOpen(true)} className="rounded-xl bg-accent px-3 py-2 text-xs font-medium">+ Новий план</button>}
      />

      <div className="grid grid-cols-2 gap-2 rounded-2xl border border-border bg-panel/60 p-3">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-xl border border-border bg-[#090d14] px-3 py-2 text-sm">
          <option value="all">Всі статуси</option>
          <option value="planned">Заплановано</option>
          <option value="done">Виконано</option>
          <option value="cancelled">Скасовано</option>
        </select>
        <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="rounded-xl border border-border bg-[#090d14] px-3 py-2 text-sm" />
      </div>

      {filteredPlans.length === 0 ? (
        <EmptyState title="Плани відсутні" description="Створіть перший запис у планері" icon={<CalendarPlus className="h-5 w-5" />} action={<button onClick={() => setOpen(true)} className="rounded-xl bg-accent px-3 py-2 text-xs">Додати</button>} />
      ) : (
        <div className="space-y-3">
          {filteredPlans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              onEdit={(selected) => {
                setEditingPlan(selected);
                setOpen(true);
              }}
              onDelete={(id) => {
                deletePlan(id);
                toast.success("План видалено");
              }}
              onDone={(id) => {
                markPlanDone(id);
                toast.success("План позначено як виконаний");
              }}
              onSend={async (id) => {
                try {
                  await sendPlan(id);
                  toast.success("План надіслано в канал");
                } catch (error) {
                  toast.error(error instanceof Error ? error.message : "Не вдалося надіслати план у Telegram");
                }
              }}
            />
          ))}
        </div>
      )}

      <ModalForm
        open={open}
        title={editingPlan ? "Редагувати план" : "Новий план"}
        onClose={() => {
          setOpen(false);
          setEditingPlan(undefined);
        }}
      >
        <PlanForm defaultValues={editingPlan} onSubmit={onSubmit} />
      </ModalForm>
    </div>
  );
}
