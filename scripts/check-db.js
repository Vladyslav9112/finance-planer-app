const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const [plans, incomes, expenses, earnings, payouts] = await Promise.all([
    prisma.plan.count(),
    prisma.income.count(),
    prisma.expense.count(),
    prisma.earningsRecord.count(),
    prisma.salaryPayout.count(),
  ]);
  console.log("Total records in DB:");
  console.log("  plans:", plans);
  console.log("  incomes:", incomes);
  console.log("  expenses:", expenses);
  console.log("  earnings:", earnings);
  console.log("  payouts:", payouts);

  // Check how many have null telegramId
  const [p2, i2, e2, ea2, sp2] = await Promise.all([
    prisma.plan.count({ where: { telegramId: null } }),
    prisma.income.count({ where: { telegramId: null } }),
    prisma.expense.count({ where: { telegramId: null } }),
    prisma.earningsRecord.count({ where: { telegramId: null } }),
    prisma.salaryPayout.count({ where: { telegramId: null } }),
  ]);
  console.log("Records with NULL telegramId:");
  console.log("  plans:", p2);
  console.log("  incomes:", i2);
  console.log("  expenses:", e2);
  console.log("  earnings:", ea2);
  console.log("  payouts:", sp2);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
