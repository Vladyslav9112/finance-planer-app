import { prisma } from "../_lib/prisma";
import { allowMethods, json } from "../_lib/http";

export default async function handler(req: any, res: any) {
  if (!allowMethods(req, res, ["DELETE"])) return;
  const id = req.query.id as string;

  try {
    await prisma.expense.delete({ where: { id } });
    return json(res, 200, { success: true });
  } catch (error) {
    return json(res, 500, { error: "Failed to delete expense", details: String(error) });
  }
}

