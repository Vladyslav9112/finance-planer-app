import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, CalendarCheck, Filter, X, Bell } from "lucide-react";
import { usePlanStore, selectFilteredPlans } from "../store/usePlanStore";
import { useAppStore } from "../store/useAppStore";
import { PlanCard } from "../components/plans/PlanCard";
import { PlanForm } from "../components/plans/PlanForm";
import { ModalForm } from "../components/ui/ModalForm";
import { SectionHeader } from "../components/ui/SectionHeader";
import { EmptyState } from "../components/ui/EmptyState";
import { Badge } from "../components/ui/Badge";
import { cn, today } from "../lib/utils";
import {
  sendPlanToChannel,
  sendTodayPlansReminder,
} from "../services/telegramService";
import type { Plan, PlanStatus, PlanPriority } from "../types";
import { PRIORITY_LABELS, STATUS_LABELS } from "../lib/constants";

const PlannerPage: React.FC = () => {
  const {
    plans,
    filters,
    addPlan,
    updatePlan,
    deletePlan,
    markComplete,
    setFilters,
    resetFilters,
  } = usePlanStore();
  const filteredPlans = usePlanStore(selectFilteredPlans);
  const { addToast } = useAppStore();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sendingReminder, setSendingReminder] = useState(false);

  const handleSendTodayReminder = async () => {
    setSendingReminder(true);
    const todayPlans = plans.filter(
      (p) => p.date === today() && p.status === "scheduled",
    );
    const ok = await sendTodayPlansReminder(todayPlans);
    addToast(
      ok
        ? `Нагадування відправлено (${todayPlans.length} планів) ✅`
        : "Помилка відправки в Telegram",
      ok ? "success" : "error",
    );
    setSendingReminder(false);
  };

  const activeFilterCount = [
    filters.status && filters.status !== "all",
    filters.priority && filters.priority !== "all",
    filters.dateFrom,
    filters.dateTo,
  ].filter(Boolean).length;

  const handleAdd = (data: Omit<Plan, "id" | "createdAt" | "updatedAt">) => {
    addPlan(data);
    addToast("План додано", "success");
    setIsAddOpen(false);
  };

  const handleEdit = (data: Partial<Plan>) => {
    if (!editingPlan) return;
    updatePlan(editingPlan.id, data);
    addToast("План оновлено", "success");
    setEditingPlan(null);
  };

  const handleDelete = (id: string) => {
    deletePlan(id);
    addToast("План видалено", "info");
  };

  const handleMarkComplete = (id: string) => {
    markComplete(id);
    addToast("План виконано! ✅", "success");
  };

  const handleSendToChannel = async (plan: Plan) => {
    const ok = await sendPlanToChannel(plan);
    addToast(
      ok ? "Відправлено в канал ✈️" : "Помилка відправки",
      ok ? "success" : "error",
    );
  };

  const completedCount = plans.filter((p) => p.status === "completed").length;
  const scheduledCount = plans.filter((p) => p.status === "scheduled").length;

  return (
    <div className="px-4 pt-6 pb-4 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <h1 className="text-lg font-700 text-white">Планер</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="teal" dot>
              {scheduledCount} активних
            </Badge>
            <Badge variant="lime" dot>
              {completedCount} виконано
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleSendTodayReminder}
            disabled={sendingReminder}
            title="Нагадати сьогоднішні плани в Telegram"
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-white/50 text-sm font-600 hover:bg-accent-violet/15 hover:border-accent-violet/30 hover:text-accent-violet transition-all active:scale-95 disabled:opacity-50"
          >
            <Bell size={15} />
          </button>
          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-accent-teal/15 border border-accent-teal/30 text-accent-teal text-sm font-700 hover:bg-accent-teal/25 transition-all active:scale-95"
          >
            <Plus size={16} />
            Новий план
          </button>
        </div>
      </div>

      {/* Search + filter bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Пошук планів..."
            value={filters.searchText || ""}
            onChange={(e) => setFilters({ searchText: e.target.value })}
            className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-accent-teal/40 transition-colors"
          />
          {filters.searchText && (
            <button
              onClick={() => setFilters({ searchText: "" })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white"
            >
              <X size={13} />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilters((v) => !v)}
          className={cn(
            "relative px-3.5 py-2.5 rounded-xl border text-sm font-600 transition-all",
            showFilters || activeFilterCount > 0
              ? "bg-accent-teal/15 border-accent-teal/35 text-accent-teal"
              : "bg-white/[0.04] border-white/[0.08] text-white/50 hover:text-white/70",
          )}
        >
          <Filter size={15} />
          {activeFilterCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-accent-teal text-white text-[10px] font-800 flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Advanced filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.07] space-y-3">
              <div className="grid grid-cols-2 gap-3">
                {/* Status filter */}
                <div>
                  <label className="text-xs font-600 text-white/40 mb-1.5 block">
                    Статус
                  </label>
                  <select
                    value={filters.status || "all"}
                    onChange={(e) =>
                      setFilters({
                        status: e.target.value as PlanStatus | "all",
                      })
                    }
                    className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="all" className="bg-surface-3">
                      Всі
                    </option>
                    {(
                      ["scheduled", "completed", "cancelled"] as PlanStatus[]
                    ).map((s) => (
                      <option key={s} value={s} className="bg-surface-3">
                        {STATUS_LABELS[s]}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Priority filter */}
                <div>
                  <label className="text-xs font-600 text-white/40 mb-1.5 block">
                    Пріоритет
                  </label>
                  <select
                    value={filters.priority || "all"}
                    onChange={(e) =>
                      setFilters({
                        priority: e.target.value as PlanPriority | "all",
                      })
                    }
                    className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="all" className="bg-surface-3">
                      Всі
                    </option>
                    {(["low", "medium", "high"] as PlanPriority[]).map((p) => (
                      <option key={p} value={p} className="bg-surface-3">
                        {PRIORITY_LABELS[p]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {/* Date range */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-600 text-white/40 mb-1.5 block">
                    Від
                  </label>
                  <input
                    type="date"
                    value={filters.dateFrom || ""}
                    onChange={(e) =>
                      setFilters({ dateFrom: e.target.value || undefined })
                    }
                    className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-600 text-white/40 mb-1.5 block">
                    До
                  </label>
                  <input
                    type="date"
                    value={filters.dateTo || ""}
                    onChange={(e) =>
                      setFilters({ dateTo: e.target.value || undefined })
                    }
                    className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>
              {activeFilterCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="text-xs text-rose-400 font-600 hover:underline flex items-center gap-1"
                >
                  <X size={11} />
                  Скинути фільтри
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Plans list */}
      {filteredPlans.length === 0 ? (
        <EmptyState
          icon={<CalendarCheck size={28} />}
          title={
            activeFilterCount > 0 ? "Нічого не знайдено" : "Планів ще немає"
          }
          description={
            activeFilterCount > 0
              ? "Спробуйте змінити фільтри"
              : "Створіть свій перший план, щоб почати"
          }
          action={
            !activeFilterCount ? (
              <button
                onClick={() => setIsAddOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent-teal/15 border border-accent-teal/30 text-accent-teal text-xs font-700"
              >
                <Plus size={13} />
                Додати план
              </button>
            ) : undefined
          }
        />
      ) : (
        <AnimatePresence mode="popLayout">
          <div className="space-y-3">
            {filteredPlans.map((plan, i) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                index={i}
                onEdit={setEditingPlan}
                onDelete={handleDelete}
                onMarkComplete={handleMarkComplete}
                onSendToChannel={handleSendToChannel}
              />
            ))}
          </div>
        </AnimatePresence>
      )}

      {/* Add modal */}
      <ModalForm
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Новий план"
      >
        <PlanForm
          onSubmit={(data) =>
            handleAdd({
              ...data,
              description: data.description ?? "",
              category: data.category ?? "",
              time: data.time ?? "",
            })
          }
          onCancel={() => setIsAddOpen(false)}
        />
      </ModalForm>

      {/* Edit modal */}
      <ModalForm
        isOpen={!!editingPlan}
        onClose={() => setEditingPlan(null)}
        title="Редагувати план"
      >
        <PlanForm
          initial={editingPlan ?? undefined}
          onSubmit={(data) => handleEdit(data)}
          onCancel={() => setEditingPlan(null)}
        />
      </ModalForm>
    </div>
  );
};

export default PlannerPage;
