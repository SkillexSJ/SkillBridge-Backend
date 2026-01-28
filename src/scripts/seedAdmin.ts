import { prisma } from "../lib/prisma";
import { auth } from "../lib/auth";

async function seedAdmin() {
  console.log("******** Admin Seeding Started ********");

  const adminEmail = "sajid@admin.com";
  const adminPassword = "sajid1234";

  try {
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (existingAdmin) {
      console.log("⚠️ Admin user already exists. Skipping...");
      return;
    }

    const newAdmin = await auth.api.signUpEmail({
      body: {
        email: adminEmail,
        password: adminPassword,
        name: "Skill Bridge Admin",
      },
    });

    if (newAdmin) {
      await prisma.user.update({
        where: { email: adminEmail },
        data: { role: "admin" },
      });

      console.log("✅ Admin user created successfully via Better Auth API");
      console.log(`📧 Email: ${adminEmail}`);
      console.log(`🔑 Password: ${adminPassword}`);
    }
  } catch (error) {
    console.error("❌ Error seeding admin:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedAdmin();
