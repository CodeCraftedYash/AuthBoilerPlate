import prisma from "../src/lib/Prisma";
import { faker } from "@faker-js/faker";
// Import your password hashing utility (e.g., bcrypt / argon2)
import bcrypt from "bcrypt"; 

async function main() {
  console.log("🌱 Starting database seeding...");

  // Optional: Clean up existing test data to avoid unique constraint errors
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  // Hash a single default password for all test users (e.g., "Password123!")
  const defaultPasswordHash = await bcrypt.hash("Password123!", 10);

  const usersData = [];

  for (let i = 0; i < 10; i++) {
    usersData.push({
      userName: faker.internet.username(),
      email: faker.internet.email().toLowerCase(),
      passwordHash: defaultPasswordHash,
      mobNo: faker.phone.number({ style: "national" }),
      userRole: "USER" as const,
    });
  }

  // Use createMany for fast bulk insertion
  const createdUsers = await prisma.user.createMany({
    data: usersData,
    skipDuplicates: true,
  });

  console.log(`✅ Successfully seeded ${createdUsers.count} users!`);
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });