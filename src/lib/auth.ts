/**
 * BETTER AUTH CONFIGURATION
 */

/**
 * NODE PACKAGES
 */
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

/**
 * CONFIG
 */
import config from "../config";

const isProduction = process.env.NODE_ENV === "production";

const transporter = nodemailer.createTransport({
  host: config.smtp.host,
  port: config.smtp.port,
  secure: config.smtp.secure,
  auth: {
    user: config.smtp.user,
    pass: config.smtp.pass,
  },
});

export const auth = betterAuth({
  baseURL: config.better_auth_url,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      prompt: "select_account",
      clientId: config.google.client_id!,
      clientSecret: config.google.client_secret!,
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }) => {
      const verificationUrl = `${config.client_url}/email-verified?token=${token}`;

      // static email
      const emailTemplatePath = path.join(
        process.cwd(),
        "src",
        "static",
        "index.html",
      );
      let emailHtml = fs.readFileSync(emailTemplatePath, "utf-8");

      emailHtml = emailHtml.replace(
        /https:\/\/tabular\.email/g,
        verificationUrl,
      );

      await transporter.sendMail({
        from: config.smtp.from,
        to: user.email,
        subject: "Verify your email address",
        text: `Click the link to verify your email: ${verificationUrl}`,
        html: emailHtml,
      });
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "student",
        input: true,
      },
      image: {
        type: "string",
        required: false,
      },
      isBlocked: {
        type: "boolean",
        required: false,
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          if (user.role === "admin") {
            user.role = "student";
          }
          if (!user.role) {
            user.role = "student";
          }
          return {
            data: user,
          };
        },
      },
    },
  },
  trustedOrigins: [
    "http://localhost:3000",
    "http://localhost:5000",
    "http://192.168.9.142:3000",
  ],
  advanced: {
    defaultCookieAttributes: {
      sameSite: "lax",
      secure: isProduction,
      httpOnly: true,
    },
  },
  secret: config.better_auth_secret,
});
