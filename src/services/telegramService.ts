import type { Plan } from "../types/entities";
import { apiClient } from "./apiClient";

export const telegramService = {
  sendPlanToChannel: (plan: Plan) =>
    apiClient<{ success: boolean; message: string }>("/telegram/send-plan", {
      method: "POST",
      body: JSON.stringify({ plan }),
    }),
};

