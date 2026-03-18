import { prisma } from "../_lib/prisma.js";
import { allowMethods, json } from "../_lib/http.js";

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req: any, res: any) {
  if (!allowMethods(req, res, ["POST"])) return;
  const id = req.query.id as string;

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const action = body.action;
    if (action === "delete") {
      const expense = await prisma.expense.findUnique({ where: { id } });
      if (!expense) {
        return json(res, 404, { error: "Expense not found" });
      }
      await prisma.expense.delete({ where: { id } });
      return json(res, 200, { success: true });
    }
    return json(res, 400, { error: "Unknown action" });
  } catch (error) {
    console.error("Expense API error:", error);
    return json(res, 500, {
      error: "Failed to delete expense",
      details: error instanceof Error ? error.message : String(error),
    });
  }
}
