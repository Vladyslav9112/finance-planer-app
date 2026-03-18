import { prisma } from "../_lib/prisma.js";
import { allowMethods, json } from "../_lib/http.js";

export default async function handler(req: any, res: any) {
  export const config = {
    api: {
      bodyParser: true,
    },
  };
  if (!allowMethods(req, res, ["DELETE"])) return;
  const id = req.query.id as string;

  try {
    const expense = await prisma.expense.findUnique({ where: { id } });
    if (!expense) {
      return json(res, 404, { error: "Expense not found" });
    }
    await prisma.expense.delete({ where: { id } });
    return json(res, 200, { success: true });
  } catch (error) {
    console.error("Expense API error:", error);
    return json(res, 500, {
      error: "Failed to delete expense",
      details: error instanceof Error ? error.message : String(error),
    });
  }
}
