import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Package,
  Banknote,
  Clock,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { useWarehouseStore } from "../store/useWarehouseStore";
import { useAppStore } from "../store/useAppStore";
import { SummaryCard } from "../components/ui/SummaryCard";
import { SectionHeader } from "../components/ui/SectionHeader";
import { EmptyState } from "../components/ui/EmptyState";
import { ModalForm } from "../components/ui/ModalForm";
import { GlassCard } from "../components/ui/GlassCard";
import { TaraCalculator } from "../components/warehouse/TaraCalculator";
import { EarningsCard } from "../components/warehouse/EarningsCard";
import { SalaryCard } from "../components/warehouse/SalaryCard";
import { SalaryPayoutForm } from "../components/warehouse/SalaryPayoutForm";
import { cn, formatCurrency } from "../lib/utils";
import { warehouseService } from "../services/warehouseService";
import type { EarningsRecord, SalaryPayout, TaraEntry } from "../types";

type ActiveTab = "tara" | "owed" | "salary";

const WarehousePage: React.FC = () => {
  const {
    earningsRecords,
    salaryPayouts,
    totalEarningsFromTara,
    totalPaidOut,
    totalAmountOwedToMe,
    deleteEarningsRecord,
    deleteSalaryPayout,
  } = useWarehouseStore();
  const { addToast } = useAppStore();

  const [activeTab, setActiveTab] = useState<ActiveTab>("tara");
  const [isTaraModalOpen, setTaraModalOpen] = useState(false);
  const [isSalaryModalOpen, setSalaryModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<EarningsRecord | null>(
    null,
  );
  const [editingPayout, setEditingPayout] = useState<SalaryPayout | null>(null);

  const tabs = [
    { key: "tara" as const, label: "По тарі", Icon: Package },
    { key: "owed" as const, label: "Видати", Icon: Clock },
    { key: "salary" as const, label: "Виплати", Icon: Banknote },
  ];

  return (
    <div className="px-4 pt-6 pb-4 space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-lg font-700 text-white mb-3">Склад / ЗП / Тара</h1>
        {/* Summary */}
        <div className="grid grid-cols-3 gap-2.5">
          <SummaryCard
            title="Зароблено"
            value={totalEarningsFromTara}
            icon={<Package size={14} />}
            isCurrency
            accentColor="violet"
            delay={0}
            compact
          />
          <SummaryCard
            title="Видати"
            value={totalAmountOwedToMe}
            icon={<Clock size={14} />}
            isCurrency
            accentColor="teal"
            delay={0.05}
            compact
          />
          <SummaryCard
            title="Видано"
            value={totalPaidOut}
            icon={<Banknote size={14} />}
            isCurrency
            accentColor="lime"
            delay={0.1}
            compact
          />
        </div>
      </div>

      {/* Amount owed progress bar */}
      {totalEarningsFromTara > 0 && (
        <GlassCard className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-600 text-white/40">Виплачено</span>
            <span className="text-xs font-700 text-white/60">
              {formatCurrency(totalPaidOut)} /{" "}
              {formatCurrency(totalEarningsFromTara)}
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-white/[0.07] overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${Math.min((totalPaidOut / totalEarningsFromTara) * 100, 100)}%`,
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-accent-lime to-accent-teal"
            />
          </div>
          <p className="text-xs text-white/30 mt-1.5 text-right">
            Ще до видачі:{" "}
            <span className="text-accent-teal font-700">
              {formatCurrency(totalAmountOwedToMe)}
            </span>
          </p>
        </GlassCard>
      )}

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-2xl bg-white/[0.04] border border-white/[0.06]">
        {tabs.map(({ key, label, Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-700 transition-all duration-200",
              activeTab === key
                ? "bg-accent-violet/20 border border-accent-violet/35 text-accent-violet"
                : "text-white/40 hover:text-white/60",
            )}
          >
            <Icon size={13} />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        {/* ─── Tara Tab ─────────────────────────────────────────── */}
        {activeTab === "tara" && (
          <motion.div
            key="tara"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <SectionHeader
              title="Заробіток по тарі"
              subtitle={`${earningsRecords.length} записів`}
              action={
                <button
                  onClick={() => setTaraModalOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-accent-violet/15 border border-accent-violet/30 text-accent-violet text-xs font-700 hover:bg-accent-violet/25 transition-all active:scale-95"
                >
                  <Plus size={13} />
                  Нова тара
                </button>
              }
            />
            {earningsRecords.length === 0 ? (
              <EmptyState
                icon={<Package size={28} />}
                title="Записів тари немає"
                description="Введіть кількість по тарифах, щоб підрахувати заробіток"
                action={
                  <button
                    onClick={() => setTaraModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent-violet/15 border border-accent-violet/30 text-accent-violet text-xs font-700"
                  >
                    <Plus size={13} />
                    Додати
                  </button>
                }
              />
            ) : (
              <AnimatePresence mode="popLayout">
                <div className="space-y-2">
                  {earningsRecords.map((rec, i) => (
                    <EarningsCard
                      key={rec.id}
                      record={rec}
                      index={i}
                      onEdit={setEditingRecord}
                      onDelete={(id) => {
                        deleteEarningsRecord(id);
                        addToast("Запис тари видалено", "info");
                      }}
                    />
                  ))}
                </div>
              </AnimatePresence>
            )}
          </motion.div>
        )}

        {/* ─── Owed Tab ─────────────────────────────────────────── */}
        {activeTab === "owed" && (
          <motion.div
            key="owed"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {/* Big amount display */}
            <GlassCard glowColor="teal" className="p-6 text-center">
              <p className="text-xs font-700 text-white/35 uppercase tracking-widest mb-2">
                Мають ще видати
              </p>
              <p className="text-4xl font-900 text-accent-teal tracking-tight">
                {formatCurrency(totalAmountOwedToMe)}
              </p>
              <p className="text-xs text-white/30 mt-2">
                Зароблено: {formatCurrency(totalEarningsFromTara)} · Видано:{" "}
                {formatCurrency(totalPaidOut)}
              </p>
            </GlassCard>

            {/* History */}
            <SectionHeader
              title="Нарахування"
              subtitle="Записи заробітку по тарі"
            />
            {earningsRecords.length === 0 ? (
              <EmptyState
                icon={<TrendingUp size={24} />}
                title="Нарахувань немає"
              />
            ) : (
              <div className="space-y-2">
                {earningsRecords.map((rec) => (
                  <div
                    key={rec.id}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-accent-violet/[0.04] border border-accent-violet/15"
                  >
                    <div>
                      <p className="text-xs text-white/55">{rec.date}</p>
                      {rec.comment && (
                        <p className="text-xs text-white/30">{rec.comment}</p>
                      )}
                    </div>
                    <span className="text-sm font-700 text-accent-violet">
                      +{formatCurrency(rec.totalAmount)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <SectionHeader title="Виплати" subtitle="Записи видачі ЗП" />
            {salaryPayouts.length === 0 ? (
              <EmptyState
                icon={<TrendingDown size={24} />}
                title="Виплат не було"
              />
            ) : (
              <div className="space-y-2">
                {salaryPayouts.map((pay) => (
                  <div
                    key={pay.id}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-accent-lime/[0.04] border border-accent-lime/15"
                  >
                    <div>
                      <p className="text-xs text-white/55">
                        {pay.date} · {pay.source}
                      </p>
                      {pay.comment && (
                        <p className="text-xs text-white/30">{pay.comment}</p>
                      )}
                    </div>
                    <span className="text-sm font-700 text-accent-lime">
                      -{formatCurrency(pay.amount)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* ─── Salary Tab ───────────────────────────────────────── */}
        {activeTab === "salary" && (
          <motion.div
            key="salary"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <SectionHeader
              title="Видача зарплати"
              subtitle={`${salaryPayouts.length} виплат · ${formatCurrency(totalPaidOut)} всього`}
              action={
                <button
                  onClick={() => setSalaryModalOpen(true)}
                  disabled={totalAmountOwedToMe <= 0}
                  className={cn(
                    "flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-700 transition-all active:scale-95",
                    totalAmountOwedToMe > 0
                      ? "bg-accent-lime/15 border border-accent-lime/30 text-accent-lime hover:bg-accent-lime/25"
                      : "bg-white/[0.04] border border-white/[0.07] text-white/25 cursor-not-allowed",
                  )}
                >
                  <Plus size={13} />
                  Видати ЗП
                </button>
              }
            />

            {totalAmountOwedToMe <= 0 && totalEarningsFromTara === 0 && (
              <GlassCard className="p-4 text-center">
                <p className="text-xs text-white/40">
                  Спочатку додайте заробіток по тарі, щоб видати зарплату
                </p>
              </GlassCard>
            )}

            {salaryPayouts.length === 0 ? (
              <EmptyState
                icon={<Banknote size={28} />}
                title="Виплат не було"
                description="Після додавання заробітку по тарі можна видати зарплату"
              />
            ) : (
              <AnimatePresence mode="popLayout">
                <div className="space-y-2">
                  {salaryPayouts.map((pay, i) => (
                    <SalaryCard
                      key={pay.id}
                      payout={pay}
                      index={i}
                      onEdit={setEditingPayout}
                      onDelete={(id) => {
                        deleteSalaryPayout(id);
                        addToast("Виплату видалено. Дохід оновлено.", "info");
                      }}
                    />
                  ))}
                </div>
              </AnimatePresence>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <ModalForm
        isOpen={isTaraModalOpen}
        onClose={() => setTaraModalOpen(false)}
        title="Заробіток по тарі"
      >
        <TaraCalculator
          onSave={(
            entries: TaraEntry[],
            totalAmount: number,
            date: string,
            comment: string,
          ) => {
            try {
              warehouseService.addEarningsRecord({
                date,
                entries,
                totalAmount,
                comment,
              });
              addToast(
                `Заробіток ${formatCurrency(totalAmount)} додано. "Мають видати" оновлено ✅`,
                "success",
              );
              setTaraModalOpen(false);
            } catch (e) {
              addToast((e as Error).message, "error");
            }
          }}
        />
      </ModalForm>

      <ModalForm
        isOpen={isSalaryModalOpen}
        onClose={() => setSalaryModalOpen(false)}
        title="Видати зарплату"
      >
        <SalaryPayoutForm
          maxAmount={totalAmountOwedToMe}
          onSubmit={(data) => {
            try {
              warehouseService.addSalaryPayout(data);
              addToast(
                `Виплата ${formatCurrency(data.amount)} оброблена. Дохід додано автоматично ✅`,
                "success",
              );
              setSalaryModalOpen(false);
            } catch (e) {
              addToast((e as Error).message, "error");
            }
          }}
          onCancel={() => setSalaryModalOpen(false)}
        />
      </ModalForm>

      <ModalForm
        isOpen={!!editingRecord}
        onClose={() => setEditingRecord(null)}
        title="Редагувати тару"
      >
        <TaraCalculator
          onSave={(
            entries: TaraEntry[],
            totalAmount: number,
            date: string,
            comment: string,
          ) => {
            if (!editingRecord) return;
            try {
              warehouseService.updateEarningsRecord(editingRecord.id, {
                date,
                entries,
                totalAmount,
                comment,
              });
              addToast("Запис тари оновлено", "success");
              setEditingRecord(null);
            } catch (e) {
              addToast((e as Error).message, "error");
            }
          }}
        />
      </ModalForm>

      <ModalForm
        isOpen={!!editingPayout}
        onClose={() => setEditingPayout(null)}
        title="Редагувати виплату"
      >
        <SalaryPayoutForm
          initial={editingPayout ?? undefined}
          maxAmount={totalAmountOwedToMe + (editingPayout?.amount ?? 0)}
          onSubmit={(data) => {
            if (!editingPayout) return;
            try {
              warehouseService.updateSalaryPayout(editingPayout.id, data);
              addToast("Виплату оновлено. Дохід синхронізовано ✅", "success");
              setEditingPayout(null);
            } catch (e) {
              addToast((e as Error).message, "error");
            }
          }}
          onCancel={() => setEditingPayout(null)}
        />
      </ModalForm>
    </div>
  );
};

export default WarehousePage;
