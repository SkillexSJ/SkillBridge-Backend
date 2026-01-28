import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "student",
        input: false, // prevent admin role setup
      },
      isBlocked:{
        type: "boolean",
        required: false,
      }
    },
  },
  trustedOrigins: ["http://localhost:3000", "http://localhost:5000"],
});
