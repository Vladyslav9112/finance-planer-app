/**
 * warehouseService — abstraction layer for warehouse / tara / salary operations.
 */
import type { EarningsRecord, SalaryPayout } from "../types";
import { useWarehouseStore } from "../store/useWarehouseStore";
import {
  sendSalaryPayoutNotification,
  sendEarningsNotification,
} from "./telegramService";

export const warehouseService = {
  addEarningsRecord: (
    data: Omit<EarningsRecord, "id" | "createdAt" | "updatedAt">,
  ): void => {
    useWarehouseStore.getState().addEarningsRecord(data);
    void sendEarningsNotification(data.totalAmount, data.date);
  },

  updateEarningsRecord: (
    id: string,
    data: Partial<Omit<EarningsRecord, "id" | "createdAt">>,
  ): void => useWarehouseStore.getState().updateEarningsRecord(id, data),

  deleteEarningsRecord: (id: string): void =>
    useWarehouseStore.getState().deleteEarningsRecord(id),

  addSalaryPayout: (
    data: Omit<
      SalaryPayout,
      "id" | "createdAt" | "updatedAt" | "relatedIncomeId"
    >,
  ): void => {
    useWarehouseStore.getState().addSalaryPayout(data);
    void sendSalaryPayoutNotification(data.amount, data.source, data.date);
  },

  updateSalaryPayout: (
    id: string,
    data: Partial<Omit<SalaryPayout, "id" | "createdAt" | "relatedIncomeId">>,
  ): void => useWarehouseStore.getState().updateSalaryPayout(id, data),

  deleteSalaryPayout: (id: string): void =>
    useWarehouseStore.getState().deleteSalaryPayout(id),
};
