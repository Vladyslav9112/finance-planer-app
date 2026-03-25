const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const TG_ID = "592476971";

async function main() {
  const [plans, incomes, expenses, earnings, payouts] = await Promise.all([
    prisma.plan.updateMany({
      where: { telegramId: null },
      data: { telegramId: TG_ID },
    }),
    prisma.income.updateMany({
      where: { telegramId: null },
      data: { telegramId: TG_ID },
    }),
    prisma.expense.updateMany({
      where: { telegramId: null },
      data: { telegramId: TG_ID },
    }),
    prisma.earningsRecord.updateMany({
      where: { telegramId: null },
      data: { telegramId: TG_ID },
    }),
    prisma.salaryPayout.updateMany({
      where: { telegramId: null },
      data: { telegramId: TG_ID },
    }),
  ]);
  console.log("Migrated:");
  console.log("  plans:", plans.count);
  console.log("  incomes:", incomes.count);
  console.log("  expenses:", expenses.count);
  console.log("  earnings:", earnings.count);
  console.log("  payouts:", payouts.count);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
