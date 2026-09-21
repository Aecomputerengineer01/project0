import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function clean() {
  const deleted = await prisma.property.deleteMany({
    where: {
      OR: [
        { isUserSubmitted: true },
        { id: { startsWith: "TEST-" } },
        { id: { startsWith: "KLS-WOOD-USER-" } },
        { type: "wooden_building" }
      ]
    }
  });
  console.log(`Deleted mock/test items: ${deleted.count}`);
  const total = await prisma.property.count();
  console.log(`Remaining pure authentic properties in PostgreSQL: ${total}`);
}

clean()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
