/**
 * planService — abstraction layer for plan operations.
 * Calls Zustand store directly for now; replace internals with fetch() calls to backend later.
 */
import type { Plan } from "../types";
import { usePlanStore } from "../store/usePlanStore";
import { sendPlanToChannel } from "./telegramService";

export const planService = {
  getAll: (): Plan[] => usePlanStore.getState().plans,

  add: (data: Omit<Plan, "id" | "createdAt" | "updatedAt">): string =>
    usePlanStore.getState().addPlan(data),

  update: (id: string, data: Partial<Omit<Plan, "id" | "createdAt">>): void =>
    usePlanStore.getState().updatePlan(id, data),

  delete: (id: string): void => usePlanStore.getState().deletePlan(id),

  markComplete: (id: string): void => usePlanStore.getState().markComplete(id),

  sendToChannel: async (plan: Plan): Promise<boolean> =>
    sendPlanToChannel(plan),
};
