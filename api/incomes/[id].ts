import { prisma } from "../_lib/prisma.js";
import { allowMethods, json } from "../_lib/http.js";

export default async function handler(req: any, res: any) {
  if (!allowMethods(req, res, ["DELETE"])) return;
  const id = req.query.id as string;

  try {
    const income = await prisma.income.findUnique({ where: { id } });
    if (!income) {
      return json(res, 404, { error: "Income not found" });
    }
    await prisma.income.delete({ where: { id } });
    return json(res, 200, { success: true });
  } catch (error) {
    console.error("Income API error:", error);
    return json(res, 500, {
      error: "Failed to delete income",
      details: error instanceof Error ? error.message : String(error),
    });
  }
}
