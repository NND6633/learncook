// prisma/seed.ts

// ✅ Import chính xác từ đường dẫn do bạn cung cấp
import { PrismaClient } from "../app/generated/prisma/client";

import { hash } from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Mã hóa mật khẩu
  const password = await hash("adminpassword", 12); // Đổi mật khẩu này

  // Tạo user
  const user = await prisma.user.create({
    data: {
      email: "admin@recipe.com", // Đổi email này
      hashedPassword: password,
    },
  });

  console.log("✅ Seed user created:", { user });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("🔥 Error seeding database:", e);
    await prisma.$disconnect();
    process.exit(1);
  });