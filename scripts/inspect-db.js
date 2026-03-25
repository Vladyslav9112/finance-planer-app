const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const plans = await prisma.plan.findMany({
    select: { id: true, telegramId: true, title: true },
  });
  const incomes = await prisma.income.findMany({
    select: { id: true, telegramId: true, source: true },
  });
  const expenses = await prisma.expense.findMany({
    select: { id: true, telegramId: true, category: true },
  });
  const earnings = await prisma.earningsRecord.findMany({
    select: { id: true, telegramId: true, date: true },
  });

  console.log("Plans:", JSON.stringify(plans, null, 2));
  console.log("Incomes:", JSON.stringify(incomes, null, 2));
  console.log("Expenses:", JSON.stringify(expenses, null, 2));
  console.log("Earnings:", JSON.stringify(earnings, null, 2));
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
