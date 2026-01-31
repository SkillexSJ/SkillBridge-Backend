var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/app.ts
import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";

// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

// src/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// src/generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// src/generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.3.0",
  "engineVersion": "9d6ad21cbbceab97458517b147a6a09ff43aa735",
  "activeProvider": "postgresql",
  "inlineSchema": 'enum Role {\n  student\n  tutor\n  admin\n}\n\nmodel TutorProfile {\n  id                 String             @id @default(uuid())\n  userId             String             @unique\n  // Relation to User\n  user               User               @relation(fields: [userId], references: [id], onDelete: Cascade)\n  categoryId         String\n  // Relation to Category\n  category           Category           @relation(fields: [categoryId], references: [id])\n  bio                String             @db.Text\n  specialty          String\n  experience         Int                @default(0)\n  hourlyRate         Decimal\n  location           String?\n  expertise          String[]           @default([])\n  socialLinks        String[]           @default([])\n  totalMentoringMins Int                @default(0)\n  totalSessions      Int                @default(0)\n  averageRating      Float              @default(0)\n  createdAt          DateTime           @default(now())\n  updatedAt          DateTime           @updatedAt\n  bookings           Booking[]\n  reviews            Review[]\n  availabilitySlots  AvailabilitySlot[]\n\n  @@map("tutor_profiles")\n}\n\nmodel User {\n  id              String        @id\n  name            String\n  email           String\n  emailVerified   Boolean       @default(false)\n  image           String?\n  createdAt       DateTime      @default(now())\n  updatedAt       DateTime      @updatedAt\n  role            Role          @default(student)\n  isBlocked       Boolean       @default(false)\n  sessions        Session[]\n  accounts        Account[]\n  tutorProfile    TutorProfile?\n  studentBookings Booking[]     @relation("StudentBookings")\n  reviews         Review[]\n\n  @@unique([email])\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nenum BookingStatus {\n  pending\n  confirmed\n  completed\n  cancelled\n}\n\nmodel Booking {\n  id             String        @id @default(uuid())\n  studentId      String\n  student        User          @relation("StudentBookings", fields: [studentId], references: [id], onDelete: Cascade)\n  tutorProfileId String\n  tutorProfile   TutorProfile  @relation(fields: [tutorProfileId], references: [id], onDelete: Cascade)\n  sessionDate    DateTime      @db.Date\n  startTime      DateTime      @db.Time\n  endTime        DateTime      @db.Time\n  status         BookingStatus @default(pending)\n  totalPrice     Decimal\n  createdAt      DateTime      @default(now())\n  updatedAt      DateTime      @updatedAt\n  review         Review?\n\n  @@map("bookings")\n}\n\nmodel Category {\n  id            String         @id @default(uuid())\n  name          String         @unique\n  imageUrl      String?\n  topics        String[]       @default([]) // Stored as array of strings\n  createdAt     DateTime       @default(now())\n  tutorProfiles TutorProfile[]\n\n  @@map("categories")\n}\n\nmodel Review {\n  id             String       @id @default(uuid())\n  bookingId      String       @unique\n  booking        Booking      @relation(fields: [bookingId], references: [id], onDelete: Cascade)\n  studentId      String\n  student        User         @relation(fields: [studentId], references: [id], onDelete: Cascade)\n  tutorProfileId String\n  tutorProfile   TutorProfile @relation(fields: [tutorProfileId], references: [id], onDelete: Cascade)\n  rating         Float\n  comment        String       @db.Text\n  createdAt      DateTime     @default(now())\n\n  @@map("reviews")\n}\n\n// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?\n// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../src/generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel AvailabilitySlot {\n  id             String       @id @default(uuid())\n  tutorProfileId String\n  tutorProfile   TutorProfile @relation(fields: [tutorProfileId], references: [id], onDelete: Cascade)\n  dayOfWeek      Int // 0-6 (Sun-Sat)\n  startTime      DateTime     @db.Time\n  endTime        DateTime     @db.Time\n\n  @@map("availability_slots")\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"TutorProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"TutorProfileToUser"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToTutorProfile"},{"name":"bio","kind":"scalar","type":"String"},{"name":"specialty","kind":"scalar","type":"String"},{"name":"experience","kind":"scalar","type":"Int"},{"name":"hourlyRate","kind":"scalar","type":"Decimal"},{"name":"location","kind":"scalar","type":"String"},{"name":"expertise","kind":"scalar","type":"String"},{"name":"socialLinks","kind":"scalar","type":"String"},{"name":"totalMentoringMins","kind":"scalar","type":"Int"},{"name":"totalSessions","kind":"scalar","type":"Int"},{"name":"averageRating","kind":"scalar","type":"Float"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"bookings","kind":"object","type":"Booking","relationName":"BookingToTutorProfile"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToTutorProfile"},{"name":"availabilitySlots","kind":"object","type":"AvailabilitySlot","relationName":"AvailabilitySlotToTutorProfile"}],"dbName":"tutor_profiles"},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"role","kind":"enum","type":"Role"},{"name":"isBlocked","kind":"scalar","type":"Boolean"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"tutorProfile","kind":"object","type":"TutorProfile","relationName":"TutorProfileToUser"},{"name":"studentBookings","kind":"object","type":"Booking","relationName":"StudentBookings"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToUser"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"Booking":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"student","kind":"object","type":"User","relationName":"StudentBookings"},{"name":"tutorProfileId","kind":"scalar","type":"String"},{"name":"tutorProfile","kind":"object","type":"TutorProfile","relationName":"BookingToTutorProfile"},{"name":"sessionDate","kind":"scalar","type":"DateTime"},{"name":"startTime","kind":"scalar","type":"DateTime"},{"name":"endTime","kind":"scalar","type":"DateTime"},{"name":"status","kind":"enum","type":"BookingStatus"},{"name":"totalPrice","kind":"scalar","type":"Decimal"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"review","kind":"object","type":"Review","relationName":"BookingToReview"}],"dbName":"bookings"},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"imageUrl","kind":"scalar","type":"String"},{"name":"topics","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"tutorProfiles","kind":"object","type":"TutorProfile","relationName":"CategoryToTutorProfile"}],"dbName":"categories"},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"bookingId","kind":"scalar","type":"String"},{"name":"booking","kind":"object","type":"Booking","relationName":"BookingToReview"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"student","kind":"object","type":"User","relationName":"ReviewToUser"},{"name":"tutorProfileId","kind":"scalar","type":"String"},{"name":"tutorProfile","kind":"object","type":"TutorProfile","relationName":"ReviewToTutorProfile"},{"name":"rating","kind":"scalar","type":"Float"},{"name":"comment","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"reviews"},"AvailabilitySlot":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"tutorProfileId","kind":"scalar","type":"String"},{"name":"tutorProfile","kind":"object","type":"TutorProfile","relationName":"AvailabilitySlotToTutorProfile"},{"name":"dayOfWeek","kind":"scalar","type":"Int"},{"name":"startTime","kind":"scalar","type":"DateTime"},{"name":"endTime","kind":"scalar","type":"DateTime"}],"dbName":"availability_slots"}},"enums":{},"types":{}}');
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// src/generated/prisma/internal/prismaNamespace.ts
var prismaNamespace_exports = {};
__export(prismaNamespace_exports, {
  AccountScalarFieldEnum: () => AccountScalarFieldEnum,
  AnyNull: () => AnyNull2,
  AvailabilitySlotScalarFieldEnum: () => AvailabilitySlotScalarFieldEnum,
  BookingScalarFieldEnum: () => BookingScalarFieldEnum,
  CategoryScalarFieldEnum: () => CategoryScalarFieldEnum,
  DbNull: () => DbNull2,
  Decimal: () => Decimal2,
  JsonNull: () => JsonNull2,
  ModelName: () => ModelName,
  NullTypes: () => NullTypes2,
  NullsOrder: () => NullsOrder,
  PrismaClientInitializationError: () => PrismaClientInitializationError2,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError2,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError2,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError2,
  PrismaClientValidationError: () => PrismaClientValidationError2,
  QueryMode: () => QueryMode,
  ReviewScalarFieldEnum: () => ReviewScalarFieldEnum,
  SessionScalarFieldEnum: () => SessionScalarFieldEnum,
  SortOrder: () => SortOrder,
  Sql: () => Sql2,
  TransactionIsolationLevel: () => TransactionIsolationLevel,
  TutorProfileScalarFieldEnum: () => TutorProfileScalarFieldEnum,
  UserScalarFieldEnum: () => UserScalarFieldEnum,
  VerificationScalarFieldEnum: () => VerificationScalarFieldEnum,
  defineExtension: () => defineExtension,
  empty: () => empty2,
  getExtensionContext: () => getExtensionContext,
  join: () => join2,
  prismaVersion: () => prismaVersion,
  raw: () => raw2,
  sql: () => sql
});
import * as runtime2 from "@prisma/client/runtime/client";
var PrismaClientKnownRequestError2 = runtime2.PrismaClientKnownRequestError;
var PrismaClientUnknownRequestError2 = runtime2.PrismaClientUnknownRequestError;
var PrismaClientRustPanicError2 = runtime2.PrismaClientRustPanicError;
var PrismaClientInitializationError2 = runtime2.PrismaClientInitializationError;
var PrismaClientValidationError2 = runtime2.PrismaClientValidationError;
var sql = runtime2.sqltag;
var empty2 = runtime2.empty;
var join2 = runtime2.join;
var raw2 = runtime2.raw;
var Sql2 = runtime2.Sql;
var Decimal2 = runtime2.Decimal;
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var prismaVersion = {
  client: "7.3.0",
  engine: "9d6ad21cbbceab97458517b147a6a09ff43aa735"
};
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var DbNull2 = runtime2.DbNull;
var JsonNull2 = runtime2.JsonNull;
var AnyNull2 = runtime2.AnyNull;
var ModelName = {
  TutorProfile: "TutorProfile",
  User: "User",
  Session: "Session",
  Account: "Account",
  Verification: "Verification",
  Booking: "Booking",
  Category: "Category",
  Review: "Review",
  AvailabilitySlot: "AvailabilitySlot"
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var TutorProfileScalarFieldEnum = {
  id: "id",
  userId: "userId",
  categoryId: "categoryId",
  bio: "bio",
  specialty: "specialty",
  experience: "experience",
  hourlyRate: "hourlyRate",
  location: "location",
  expertise: "expertise",
  socialLinks: "socialLinks",
  totalMentoringMins: "totalMentoringMins",
  totalSessions: "totalSessions",
  averageRating: "averageRating",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var UserScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  emailVerified: "emailVerified",
  image: "image",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  role: "role",
  isBlocked: "isBlocked"
};
var SessionScalarFieldEnum = {
  id: "id",
  expiresAt: "expiresAt",
  token: "token",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  ipAddress: "ipAddress",
  userAgent: "userAgent",
  userId: "userId"
};
var AccountScalarFieldEnum = {
  id: "id",
  accountId: "accountId",
  providerId: "providerId",
  userId: "userId",
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  idToken: "idToken",
  accessTokenExpiresAt: "accessTokenExpiresAt",
  refreshTokenExpiresAt: "refreshTokenExpiresAt",
  scope: "scope",
  password: "password",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var VerificationScalarFieldEnum = {
  id: "id",
  identifier: "identifier",
  value: "value",
  expiresAt: "expiresAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var BookingScalarFieldEnum = {
  id: "id",
  studentId: "studentId",
  tutorProfileId: "tutorProfileId",
  sessionDate: "sessionDate",
  startTime: "startTime",
  endTime: "endTime",
  status: "status",
  totalPrice: "totalPrice",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var CategoryScalarFieldEnum = {
  id: "id",
  name: "name",
  imageUrl: "imageUrl",
  topics: "topics",
  createdAt: "createdAt"
};
var ReviewScalarFieldEnum = {
  id: "id",
  bookingId: "bookingId",
  studentId: "studentId",
  tutorProfileId: "tutorProfileId",
  rating: "rating",
  comment: "comment",
  createdAt: "createdAt"
};
var AvailabilitySlotScalarFieldEnum = {
  id: "id",
  tutorProfileId: "tutorProfileId",
  dayOfWeek: "dayOfWeek",
  startTime: "startTime",
  endTime: "endTime"
};
var SortOrder = {
  asc: "asc",
  desc: "desc"
};
var QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
var NullsOrder = {
  first: "first",
  last: "last"
};
var defineExtension = runtime2.Extensions.defineExtension;

// src/generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/lib/auth.ts
import nodemailer from "nodemailer";
import fs from "fs";
import path3 from "path";

// src/config/index.ts
import dotenv from "dotenv";
import path2 from "path";
dotenv.config({ path: path2.join(process.cwd(), ".env") });
var config_default = {
  env: process.env.NODE_ENV,
  port: process.env.PORT || 5e3,
  database_url: process.env.DATABASE_URL,
  better_auth_secret: process.env.BETTER_AUTH_SECRET,
  better_auth_url: process.env.BETTER_AUTH_URL,
  client_url: process.env.CLIENT_URL || "http://localhost:3000",
  admin_email: process.env.ADMIN_EMAIL,
  admin_password: process.env.ADMIN_PASSWORD,
  smtp: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true",
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.SMTP_FROM || '"Skill Bridge" <no-reply@skillbridge.com>'
  },
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  },
  google: {
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET
  }
};

// src/lib/auth.ts
var isProduction = process.env.NODE_ENV === "production";
var transporter = nodemailer.createTransport({
  host: config_default.smtp.host,
  port: config_default.smtp.port,
  secure: config_default.smtp.secure,
  auth: {
    user: config_default.smtp.user,
    pass: config_default.smtp.pass
  }
});
var auth = betterAuth({
  baseURL: config_default.better_auth_url,
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  emailAndPassword: {
    enabled: true
  },
  socialProviders: {
    google: {
      prompt: "select_account",
      clientId: config_default.google.client_id,
      clientSecret: config_default.google.client_secret
    }
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }) => {
      const verificationUrl = `${config_default.client_url}/email-verified?token=${token}`;
      const emailTemplatePath = path3.join(
        process.cwd(),
        "src",
        "static",
        "index.html"
      );
      let emailHtml = fs.readFileSync(emailTemplatePath, "utf-8");
      emailHtml = emailHtml.replace(
        /https:\/\/tabular\.email/g,
        verificationUrl
      );
      await transporter.sendMail({
        from: config_default.smtp.from,
        to: user.email,
        subject: "Verify your email address",
        text: `Click the link to verify your email: ${verificationUrl}`,
        html: emailHtml
      });
    }
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "student",
        input: true
      },
      image: {
        type: "string",
        required: false
      },
      isBlocked: {
        type: "boolean",
        required: false
      }
    }
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
            data: user
          };
        }
      }
    }
  },
  trustedOrigins: [
    "http://localhost:3000",
    "http://localhost:5000",
    "http://192.168.9.142:3000"
  ],
  advanced: {
    defaultCookieAttributes: {
      sameSite: "lax",
      secure: isProduction,
      httpOnly: true
    }
  },
  secret: config_default.better_auth_secret
});

// src/modules/user/user.route.ts
import { Router } from "express";

// src/modules/user/user.service.ts
var getProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      tutorProfile: true
    }
  });
  return user;
};
var updateProfile = async (userId, data) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data
  });
  return user;
};
var getStudentDashboardStats = async (userId) => {
  const [completedBookings, activeBookings, totalSpent, user] = await Promise.all([
    // Total Completed Bookings
    prisma.booking.count({
      where: {
        studentId: userId,
        status: "completed"
      }
    }),
    // Active Bookings
    prisma.booking.count({
      where: {
        studentId: userId,
        status: { in: ["pending", "confirmed"] }
      }
    }),
    // Total Spent
    prisma.booking.aggregate({
      _sum: {
        totalPrice: true
      },
      where: {
        studentId: userId,
        status: { in: ["completed", "confirmed"] }
      }
    }),
    // joined date
    prisma.user.findUnique({
      where: { id: userId },
      select: { createdAt: true }
    })
  ]);
  return {
    completedBookings,
    activeBookings,
    totalSpent: totalSpent._sum.totalPrice || 0,
    joinedAt: user?.createdAt
  };
};
var UserService = {
  getProfile,
  updateProfile,
  getStudentDashboardStats
};

// src/middlewares/asyncHandler.ts
var asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// src/utils/response.ts
var sendCreated = (res, data, message = "Resource created successfully", statusCode = 201) => {
  res.status(statusCode).json({
    success: true,
    message,
    data
  });
};
var sendSuccess = (res, result, message = "Success", statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    data: result.data,
    meta: result.meta
  });
};
var sendError = (res, message, statusCode = 500, error) => {
  const response = {
    success: false,
    message
  };
  if (error) {
    response.error = error;
  }
  res.status(statusCode).json(response);
};
var sendUnauthorized = (res, message = "Unauthorized") => {
  sendError(res, message, 401);
};
var sendForbidden = (res, message = "Forbidden") => {
  sendError(res, message, 403);
};

// src/modules/user/user.controller.ts
var getProfile2 = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const user = await UserService.getProfile(userId);
  sendSuccess(res, { data: user }, "Profile fetched successfully");
});
var updateProfile2 = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const user = await UserService.updateProfile(userId, req.body);
  sendSuccess(res, { data: user }, "Profile updated successfully");
});
var uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    sendError(res, "No image file provided", 400);
  }
  const userId = req.user.id;
  const imageUrl = req?.file?.path;
  const user = await UserService.updateProfile(userId, { image: imageUrl });
  sendSuccess(res, { data: user }, "Profile image updated successfully");
});
var signupWithImage = asyncHandler(async (req, res) => {
  const { email, password, name, role } = req.body;
  const image = req.file ? req.file.path : void 0;
  const user = await auth.api.signUpEmail({
    body: {
      email,
      password,
      name,
      role: role || "student",
      image
    }
  });
  if (!user) {
    sendError(res, "Failed to create user", 400);
  }
  sendSuccess(res, { data: user }, "User created successfully with image", 201);
});
var getStudentDashboardStats2 = asyncHandler(
  async (req, res) => {
    const userId = req.user.id;
    const stats = await UserService.getStudentDashboardStats(userId);
    sendSuccess(res, { data: stats }, "Student stats fetched successfully");
  }
);
var UserController = {
  getProfile: getProfile2,
  updateProfile: updateProfile2,
  uploadImage,
  signupWithImage,
  getStudentDashboardStats: getStudentDashboardStats2
};

// src/middlewares/auth.ts
var authMiddleware = (...roles) => {
  return async (req, res, next) => {
    try {
      const session = await auth.api.getSession({
        headers: req.headers
      });
      if (!session || !session.user) {
        return sendUnauthorized(res, "Unauthorized");
      }
      if (!session.user.emailVerified) {
        return sendUnauthorized(res, "Email not verified");
      }
      const user = session.user;
      if (user.isBlocked) {
        return sendUnauthorized(res, "User is blocked");
      }
      req.user = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
        isBlocked: !!user.isBlocked
      };
      if (roles.length && !roles.includes(req.user.role)) {
        return sendForbidden(res, "Forbidden");
      }
      next();
    } catch (error) {
      return sendError(
        res,
        "Authentication failed",
        500,
        error.message
      );
    }
  };
};
var auth_default = authMiddleware;

// src/config/cloudinary.ts
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv2 from "dotenv";
dotenv2.config();
var cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
var api_key = process.env.CLOUDINARY_API_KEY;
var api_secret = process.env.CLOUDINARY_API_SECRET;
if (!cloud_name || !api_key || !api_secret) {
  throw new Error(
    "Missing Cloudinary configuration. Please check your .env file for CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET."
  );
}
cloudinary.config({
  cloud_name,
  api_key,
  api_secret
});
var storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "skill-bridge-users",
    // Folder name
    format: async (req, file) => "webp",
    transformation: [
      {
        width: 500,
        height: 500,
        crop: "fill",
        gravity: "face",
        quality: "auto"
      }
    ]
  }
});
var upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024
    // 5MB
  }
});

// src/modules/user/user.route.ts
var router = Router();
router.get(
  "/profile",
  auth_default("admin" /* ADMIN */, "student" /* STUDENT */, "tutor" /* TUTOR */),
  UserController.getProfile,
  auth_default("admin" /* ADMIN */, "student" /* STUDENT */, "tutor" /* TUTOR */),
  UserController.getProfile
);
router.get(
  "/stats",
  auth_default("student" /* STUDENT */),
  UserController.getStudentDashboardStats
);
router.patch(
  "/profile",
  auth_default("admin" /* ADMIN */, "student" /* STUDENT */, "tutor" /* TUTOR */),
  UserController.updateProfile
);
router.post(
  "/profile/image",
  auth_default("admin" /* ADMIN */, "student" /* STUDENT */, "tutor" /* TUTOR */),
  upload.single("image"),
  UserController.uploadImage
);
router.post(
  "/signup-with-image",
  upload.single("image"),
  UserController.signupWithImage
);
var UserRoutes = router;

// src/modules/tutor/tutor.route.ts
import { Router as Router2 } from "express";

// src/utils/pagination.ts
var calculatePagination = (options) => {
  const page = Number(options.page) || 1;
  const limit = Number(options.limit) || 10;
  const skip = (page - 1) * limit;
  const sortBy = options.sortBy || "createdAt";
  const sortOrder = options.sortOrder || "desc";
  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder
  };
};

// src/modules/tutor/tutor.service.ts
var getAllTutors = async (params) => {
  const { searchTerm, categoryId, minPrice, maxPrice, sortBy } = params;
  const { page, limit, skip } = calculatePagination(params);
  const where = {};
  if (searchTerm) {
    where.OR = [
      { bio: { contains: searchTerm, mode: "insensitive" } },
      { user: { name: { contains: searchTerm, mode: "insensitive" } } },
      { specialty: { contains: searchTerm, mode: "insensitive" } }
    ];
  }
  if (categoryId) {
    where.categoryId = categoryId;
  }
  if (minPrice || maxPrice) {
    where.hourlyRate = {};
    if (minPrice) where.hourlyRate.gte = parseFloat(minPrice);
    if (maxPrice) where.hourlyRate.lte = parseFloat(maxPrice);
  }
  let orderBy = {
    createdAt: "desc"
  };
  if (sortBy === "price_asc") orderBy = { hourlyRate: "asc" };
  if (sortBy === "price_desc") orderBy = { hourlyRate: "desc" };
  if (sortBy === "experience") orderBy = { experience: "desc" };
  if (sortBy === "rating") orderBy = { averageRating: "desc" };
  const [tutors, total] = await Promise.all([
    prisma.tutorProfile.findMany({
      where,
      select: {
        id: true,
        bio: true,
        specialty: true,
        experience: true,
        hourlyRate: true,
        location: true,
        totalMentoringMins: true,
        totalSessions: true,
        averageRating: true,
        user: {
          select: {
            name: true,
            image: true
          }
        },
        category: {
          select: {
            name: true
          }
        },
        reviews: {
          select: {
            rating: true
          }
        },
        availabilitySlots: {
          select: {
            dayOfWeek: true,
            startTime: true,
            endTime: true
          }
        }
      },
      orderBy,
      skip,
      take: limit
    }),
    prisma.tutorProfile.count({ where })
  ]);
  const tutorsWithStats = tutors.map((tutor) => {
    return {
      ...tutor,
      reviewCount: tutor.reviews.length
    };
  });
  return {
    data: tutorsWithStats,
    meta: {
      total,
      page,
      limit
    }
  };
};
var getTutorById = async (id) => {
  const tutor = await prisma.tutorProfile.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
          email: true
        }
      },
      category: true,
      reviews: {
        include: {
          student: {
            select: {
              name: true,
              image: true
            }
          }
        }
      },
      availabilitySlots: true
    }
  });
  if (!tutor) {
    const error = new Error("Tutor not found");
    error.statusCode = 404;
    throw error;
  }
  return {
    ...tutor,
    averageRating: Number(tutor.averageRating),
    reviewCount: tutor.reviews.length
  };
};
var createTutorProfile = async (userId, data) => {
  const existing = await prisma.tutorProfile.findUnique({
    where: { userId }
  });
  if (existing) {
    const error = new Error("Tutor profile already exists");
    error.statusCode = 409;
    throw error;
  }
  const profile = await prisma.tutorProfile.create({
    data: {
      ...data,
      userId
    }
  });
  await prisma.user.update({
    where: { id: userId },
    data: { role: "tutor" }
  });
  return profile;
};
var updateAvailability = async (tutorProfileId, slots) => {
  return await prisma.$transaction(async (tx) => {
    await tx.availabilitySlot.deleteMany({
      where: { tutorProfileId }
    });
    const createdSlots = [];
    for (const slot of slots) {
      createdSlots.push(
        await tx.availabilitySlot.create({
          data: {
            tutorProfileId,
            dayOfWeek: slot.dayOfWeek,
            startTime: /* @__PURE__ */ new Date(`1970-01-01T${slot.startTime}`),
            endTime: /* @__PURE__ */ new Date(`1970-01-01T${slot.endTime}`)
          }
        })
      );
    }
    return createdSlots;
  });
};
var getTutorProfileByUserId = async (userId) => {
  const profile = await prisma.tutorProfile.findUnique({
    where: { userId },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          image: true
        }
      },
      availabilitySlots: true
    }
  });
  if (!profile) {
    const error = new Error("Tutor profile not found");
    error.statusCode = 404;
    throw error;
  }
  return profile;
};
var updateAvailabilityByUserId = async (userId, slots) => {
  const profile = await prisma.tutorProfile.findUnique({
    where: { userId }
  });
  if (!profile) {
    const error = new Error("Tutor profile not found");
    error.statusCode = 404;
    throw error;
  }
  return updateAvailability(profile.id, slots);
};
var getTutorStats = async (userId) => {
  const profile = await prisma.tutorProfile.findUnique({
    where: { userId }
  });
  if (!profile) {
    const error = new Error("Tutor profile not found");
    error.statusCode = 404;
    throw error;
  }
  const earnings = await prisma.booking.aggregate({
    _sum: {
      totalPrice: true
    },
    where: {
      tutorProfileId: profile.id,
      status: { in: ["confirmed", "completed"] }
    }
  });
  const reviews = await prisma.review.aggregate({
    _avg: {
      rating: true
    },
    _count: {
      rating: true
    },
    where: {
      tutorProfileId: profile.id
    }
  });
  return {
    totalMentoringMins: profile.totalMentoringMins,
    totalSessions: profile.totalSessions,
    totalEarnings: earnings._sum.totalPrice || 0,
    averageRating: reviews._avg.rating ? Number(reviews._avg.rating.toFixed(1)) : 0,
    totalReviews: reviews._count.rating
  };
};
var updateTutorProfile = async (userId, data) => {
  const profile = await prisma.tutorProfile.findUnique({
    where: { userId }
  });
  if (!profile) {
    const error = new Error("Tutor profile not found");
    error.statusCode = 404;
    throw error;
  }
  const updatedProfile = await prisma.tutorProfile.update({
    where: { userId },
    data
  });
  return updatedProfile;
};
var TutorService = {
  getAllTutors,
  getTutorById,
  createTutorProfile,
  updateTutorProfile,
  updateAvailability,
  getTutorProfileByUserId,
  updateAvailabilityByUserId,
  getTutorStats
};

// src/modules/tutor/tutor.controller.ts
var getAllTutors2 = asyncHandler(async (req, res) => {
  const result = await TutorService.getAllTutors(req.query);
  sendSuccess(res, result, "Tutors fetched successfully");
});
var getTutorById2 = asyncHandler(async (req, res) => {
  const tutor = await TutorService.getTutorById(req.params.id);
  sendSuccess(res, { data: tutor }, "Tutor fetched successfully");
});
var updateMyProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const updatedProfile = await TutorService.updateTutorProfile(
    userId,
    req.body
  );
  sendSuccess(res, { data: updatedProfile }, "Profile updated successfully");
});
var createTutorProfile2 = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const tutor = await TutorService.createTutorProfile(userId, req.body);
  sendSuccess(res, { data: tutor }, "Tutor profile created successfully", 201);
});
var updateAvailability2 = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const slots = await TutorService.updateAvailabilityByUserId(
    userId,
    req.body.slots
  );
  sendSuccess(res, { data: slots }, "Availability updated successfully");
});
var getMyProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const tutor = await TutorService.getTutorProfileByUserId(userId);
  sendSuccess(res, { data: tutor }, "Tutor profile fetched successfully");
});
var getTutorStats2 = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const stats = await TutorService.getTutorStats(userId);
  sendSuccess(res, { data: stats }, "Tutor stats fetched successfully");
});
var TutorController = {
  getAllTutors: getAllTutors2,
  getTutorById: getTutorById2,
  getMyProfile,
  updateMyProfile,
  createTutorProfile: createTutorProfile2,
  updateAvailability: updateAvailability2,
  getTutorStats: getTutorStats2
};

// src/modules/tutor/tutor.route.ts
var router2 = Router2();
router2.get("/me", auth_default("tutor" /* TUTOR */), TutorController.getMyProfile);
router2.patch(
  "/me",
  auth_default("tutor" /* TUTOR */),
  TutorController.updateMyProfile
);
router2.get(
  "/stats",
  auth_default("tutor" /* TUTOR */),
  TutorController.getTutorStats
);
router2.get("/", TutorController.getAllTutors);
router2.get("/:id", TutorController.getTutorById);
router2.post(
  "/",
  auth_default("student" /* STUDENT */, "admin" /* ADMIN */, "tutor" /* TUTOR */),
  TutorController.createTutorProfile
);
router2.put(
  "/availability",
  auth_default("tutor" /* TUTOR */),
  TutorController.updateAvailability
);
var TutorRoutes = router2;

// src/modules/booking/booking.route.ts
import { Router as Router3 } from "express";

// src/modules/booking/booking.service.ts
var createBooking = async (studentId, data) => {
  const { tutorProfileId, sessionDate, startTime, endTime, totalPrice } = data;
  const booking = await prisma.booking.create({
    data: {
      studentId,
      tutorProfileId,
      sessionDate: new Date(sessionDate),
      startTime: /* @__PURE__ */ new Date(`1970-01-01T${startTime}`),
      endTime: /* @__PURE__ */ new Date(`1970-01-01T${endTime}`),
      totalPrice: Number(totalPrice),
      status: "pending"
    }
  });
  return booking;
};
var getUserBookings = async (userId, role, params = {}) => {
  const { status } = params;
  const { page, limit, skip } = calculatePagination(params);
  const where = {};
  if (status) {
    where.status = status;
  }
  if (role === "tutor") {
    const tutorProfile = await prisma.tutorProfile.findUnique({
      where: { userId }
    });
    if (!tutorProfile) {
      return {
        data: [],
        meta: { total: 0, page, limit }
      };
    }
    where.tutorProfileId = tutorProfile.id;
  } else if (role !== "admin") {
    where.studentId = userId;
  }
  const include = role === "admin" ? {
    student: { select: { name: true, image: true, email: true } },
    tutorProfile: {
      include: {
        user: { select: { name: true, image: true, email: true } }
      }
    }
  } : role === "tutor" ? { student: { select: { name: true, image: true, email: true } } } : {
    tutorProfile: {
      include: { user: { select: { name: true, image: true } } }
    }
  };
  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      where,
      include,
      orderBy: { sessionDate: "desc" },
      skip,
      take: limit
    }),
    prisma.booking.count({ where })
  ]);
  return {
    data: bookings,
    meta: {
      total,
      page,
      limit
    }
  };
};
var getBookingById = async (id, userId, role) => {
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      student: { select: { name: true, email: true, image: true } },
      tutorProfile: {
        include: {
          user: { select: { name: true, image: true, email: true } }
        }
      }
    }
  });
  if (!booking) {
    const error = new Error("Booking not found");
    error.statusCode = 404;
    throw error;
  }
  if (role === "admin") return booking;
  const isStudent = booking.studentId === userId;
  const isTutor = booking.tutorProfile.userId === userId;
  if (!isStudent && !isTutor) {
    const error = new Error("Forbidden");
    error.statusCode = 403;
    throw error;
  }
  return booking;
};
var updateBookingStatus = async (bookingId, status, userId, role) => {
  const result = await prisma.$transaction(async (tx) => {
    const existingBooking = await tx.booking.findUnique({
      where: { id: bookingId },
      include: { tutorProfile: true }
    });
    if (!existingBooking) {
      const error = new Error("Booking not found");
      error.statusCode = 404;
      throw error;
    }
    if (role === "student") {
      if (status !== "cancelled") {
        const error = new Error("Students can only cancel bookings");
        error.statusCode = 403;
        throw error;
      }
      if (existingBooking.status !== "pending") {
        const error = new Error(
          "You can only cancel pending bookings. Valid bookings cannot be cancelled."
        );
        error.statusCode = 400;
        throw error;
      }
      if (existingBooking.studentId !== userId) {
        const error = new Error("Forbidden");
        error.statusCode = 403;
        throw error;
      }
    } else if (role === "tutor") {
      if (existingBooking.tutorProfile.userId !== userId) {
        const error = new Error(
          "Forbidden: You can only update your own bookings"
        );
        error.statusCode = 403;
        throw error;
      }
    }
    const booking = await tx.booking.update({
      where: { id: bookingId },
      data: { status }
    });
    if (status === "completed") {
      const durationMs = new Date(booking.endTime).getTime() - new Date(booking.startTime).getTime();
      const durationMins = Math.floor(durationMs / (1e3 * 60));
      await tx.tutorProfile.update({
        where: { id: booking.tutorProfileId },
        data: {
          totalSessions: { increment: 1 },
          totalMentoringMins: { increment: durationMins }
        }
      });
    }
    return booking;
  });
  return result;
};
var BookingService = {
  createBooking,
  getUserBookings,
  getBookingById,
  updateBookingStatus
};

// src/modules/booking/booking.controller.ts
var createBooking2 = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const booking = await BookingService.createBooking(userId, req.body);
  sendSuccess(res, { data: booking }, "Booking created successfully", 201);
});
var getMyBookings = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const role = req.user?.role;
  const result = await BookingService.getUserBookings(
    userId,
    role,
    req.query
  );
  sendSuccess(res, result, "Bookings fetched successfully");
});
var getBookingById2 = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const role = req.user.role;
  const booking = await BookingService.getBookingById(
    req.params.id,
    userId,
    role
  );
  sendSuccess(res, { data: booking }, "Booking fetched successfully");
});
var updateBookingStatus2 = asyncHandler(
  async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;
    const role = req.user.role;
    const result = await BookingService.updateBookingStatus(
      id,
      status,
      userId,
      role
    );
    sendSuccess(res, { data: result }, "Booking status updated successfully");
  }
);
var BookingController = {
  createBooking: createBooking2,
  getMyBookings,
  getBookingById: getBookingById2,
  updateBookingStatus: updateBookingStatus2
};

// src/modules/booking/booking.route.ts
var router3 = Router3();
router3.post(
  "/",
  auth_default("student" /* STUDENT */, "admin" /* ADMIN */),
  BookingController.createBooking
);
router3.get(
  "/",
  auth_default("student" /* STUDENT */, "tutor" /* TUTOR */, "admin" /* ADMIN */),
  BookingController.getMyBookings
);
router3.get(
  "/:id",
  auth_default("student" /* STUDENT */, "tutor" /* TUTOR */, "admin" /* ADMIN */),
  BookingController.getBookingById
);
router3.patch(
  "/:id",
  auth_default("tutor" /* TUTOR */, "admin" /* ADMIN */, "student" /* STUDENT */),
  BookingController.updateBookingStatus
);
var BookingRoutes = router3;

// src/modules/admin/admin.route.ts
import { Router as Router4 } from "express";

// src/modules/admin/admin.service.ts
var getAllUsers = async (params = {}) => {
  const { page, limit, skip } = calculatePagination(params);
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      include: {
        tutorProfile: true
      },
      skip,
      take: limit
    }),
    prisma.user.count()
  ]);
  return {
    data: users,
    meta: {
      total,
      page,
      limit
    }
  };
};
var blockUser = async (userId) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }
  return await prisma.user.update({
    where: { id: userId },
    data: { isBlocked: !user.isBlocked }
  });
};
var getDashboardStats = async () => {
  const [
    totalStudents,
    totalTutors,
    totalBookings,
    totalRevenue,
    activeTutors,
    recentBookings,
    bookingsByStatus
  ] = await Promise.all([
    // Total Students
    prisma.user.count({ where: { role: "student" } }),
    // Total Tutors
    prisma.tutorProfile.count(),
    // Total Bookings
    prisma.booking.count(),
    // Total Revenue
    prisma.booking.aggregate({
      _sum: {
        totalPrice: true
      },
      where: {
        status: { in: ["confirmed", "completed"] }
      }
    }),
    // Active Tutors
    prisma.booking.groupBy({
      by: ["tutorProfileId"],
      _count: {
        tutorProfileId: true
      }
    }),
    // Recent Bookings
    prisma.booking.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc"
      },
      include: {
        student: {
          select: {
            name: true,
            email: true,
            image: true
          }
        },
        tutorProfile: {
          include: {
            user: {
              select: {
                name: true
              }
            },
            category: {
              select: {
                name: true
              }
            }
          }
        }
      }
    }),
    // Bookings by Status
    prisma.booking.groupBy({
      by: ["status"],
      _count: {
        status: true
      }
    })
  ]);
  return {
    users: {
      students: totalStudents,
      tutors: totalTutors,
      activeTutors: activeTutors.length
    },
    bookings: {
      total: totalBookings,
      recent: recentBookings,
      byStatus: bookingsByStatus.map((item) => ({
        status: item.status,
        count: item._count.status
      }))
    },
    revenue: {
      total: totalRevenue._sum.totalPrice || 0
    }
  };
};
var AdminService = {
  getAllUsers,
  blockUser,
  getDashboardStats
};

// src/modules/admin/admin.controller.ts
var getAllUsers2 = asyncHandler(async (req, res) => {
  const result = await AdminService.getAllUsers(req.query);
  sendSuccess(res, result, "Users fetched successfully");
});
var blockUser2 = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await AdminService.blockUser(id);
  sendSuccess(res, { data: result }, "User status updated");
});
var getDashboardStats2 = asyncHandler(async (req, res) => {
  const result = await AdminService.getDashboardStats();
  sendSuccess(res, { data: result }, "Dashboard stats fetched successfully");
});
var AdminController = {
  getAllUsers: getAllUsers2,
  blockUser: blockUser2,
  getDashboardStats: getDashboardStats2
};

// src/modules/admin/admin.route.ts
var router4 = Router4();
router4.get(
  "/stats",
  auth_default("admin" /* ADMIN */),
  AdminController.getDashboardStats
);
router4.get(
  "/users",
  auth_default("admin" /* ADMIN */),
  AdminController.getAllUsers
);
router4.patch(
  "/users/:id",
  auth_default("admin" /* ADMIN */),
  AdminController.blockUser
);
var AdminRoutes = router4;

// src/modules/category/category.route.ts
import { Router as Router5 } from "express";

// src/modules/category/category.service.ts
var createCategory = async (data) => {
  return await prisma.category.create({
    data
  });
};
var getAllCategories = async (params = {}) => {
  const { page, limit, skip } = calculatePagination(params);
  const [categories, total] = await Promise.all([
    prisma.category.findMany({
      include: {
        _count: {
          select: { tutorProfiles: true }
        }
      },
      skip,
      take: limit
    }),
    prisma.category.count()
  ]);
  return {
    data: categories,
    meta: {
      total,
      page,
      limit
    }
  };
};
var getCategoryById = async (id) => {
  return await prisma.category.findUniqueOrThrow({
    where: { id },
    include: {
      _count: {
        select: { tutorProfiles: true }
      }
    }
  });
};
var deleteCategory = async (id) => {
  return await prisma.category.delete({
    where: { id }
  });
};
var CategoryService = {
  createCategory,
  getAllCategories,
  getCategoryById,
  deleteCategory
};

// src/modules/category/category.controller.ts
var createCategory2 = asyncHandler(async (req, res) => {
  const data = req.body;
  const category = await CategoryService.createCategory(data);
  sendCreated(res, category, "Category created successfully");
});
var getAllCategories2 = asyncHandler(async (req, res) => {
  const result = await CategoryService.getAllCategories(req.query);
  sendSuccess(res, result, "Categories fetched successfully");
});
var getCategoryById2 = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await CategoryService.getCategoryById(id);
  sendSuccess(res, { data: result }, "Category fetched successfully");
});
var deleteCategory2 = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const category = await CategoryService.deleteCategory(id);
  sendSuccess(res, { data: category }, "Category deleted successfully");
});
var CategoryController = {
  createCategory: createCategory2,
  getAllCategories: getAllCategories2,
  getCategoryById: getCategoryById2,
  deleteCategory: deleteCategory2
};

// src/modules/category/category.route.ts
var router5 = Router5();
router5.post(
  "/",
  auth_default("admin" /* ADMIN */),
  CategoryController.createCategory
);
router5.get("/", CategoryController.getAllCategories);
router5.get("/:id", CategoryController.getCategoryById);
router5.delete(
  "/:id",
  auth_default("admin" /* ADMIN */),
  CategoryController.deleteCategory
);
var CategoryRoutes = router5;

// src/modules/review/review.route.ts
import { Router as Router6 } from "express";

// src/modules/review/review.service.ts
var createReview = async (studentId, data) => {
  const { bookingId, rating, comment } = data;
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { review: true }
  });
  if (!booking) throw new Error("Booking not found");
  if (booking.studentId !== studentId) throw new Error("Unauthorized");
  if (booking.review) throw new Error("Review already exists");
  const result = await prisma.$transaction(async (tx) => {
    const review = await tx.review.create({
      data: {
        bookingId,
        studentId,
        tutorProfileId: booking.tutorProfileId,
        rating: Number(rating),
        comment: comment || ""
      }
    });
    const reviews = await tx.review.findMany({
      where: { tutorProfileId: booking.tutorProfileId },
      select: { rating: true }
    });
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;
    await tx.tutorProfile.update({
      where: { id: booking.tutorProfileId },
      data: {
        averageRating: Number(averageRating.toFixed(2))
      }
    });
    return review;
  });
  return result;
};
var getAllReviews = async (params) => {
  const { tutorId, studentId, sortBy } = params;
  const { page, limit, skip } = calculatePagination(params);
  const where = {};
  if (tutorId) {
    where.tutorProfileId = tutorId;
  }
  if (studentId) {
    where.studentId = studentId;
  }
  let orderBy = {
    createdAt: "desc"
  };
  if (sortBy === "oldest") orderBy = { createdAt: "asc" };
  if (sortBy === "rating_asc") orderBy = { rating: "asc" };
  if (sortBy === "rating_desc") orderBy = { rating: "desc" };
  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where,
      include: {
        student: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        tutorProfile: {
          include: {
            user: {
              select: {
                name: true,
                image: true
              }
            }
          }
        }
      },
      orderBy,
      skip,
      take: limit
    }),
    prisma.review.count({ where })
  ]);
  return {
    data: reviews,
    meta: {
      total,
      page,
      limit
    }
  };
};
var getReviewById = async (id) => {
  const review = await prisma.review.findUnique({
    where: { id },
    include: {
      student: {
        select: {
          id: true,
          name: true,
          image: true
        }
      },
      tutorProfile: {
        include: {
          user: {
            select: {
              name: true,
              image: true
            }
          }
        }
      }
    }
  });
  if (!review) {
    const error = new Error("Review not found");
    error.statusCode = 404;
    throw error;
  }
  return review;
};
var ReviewService = {
  createReview,
  getAllReviews,
  getReviewById
};

// src/modules/review/review.controller.ts
var createReview2 = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const review = await ReviewService.createReview(userId, req.body);
  sendSuccess(res, { data: review }, "Review created successfully", 201);
});
var getAllReviews2 = asyncHandler(async (req, res) => {
  const result = await ReviewService.getAllReviews(req.query);
  sendSuccess(res, result, "Reviews fetched successfully");
});
var getReviewById2 = asyncHandler(async (req, res) => {
  const review = await ReviewService.getReviewById(req.params.id);
  sendSuccess(res, { data: review }, "Review fetched successfully");
});
var ReviewController = {
  createReview: createReview2,
  getAllReviews: getAllReviews2,
  getReviewById: getReviewById2
};

// src/modules/review/review.route.ts
var router6 = Router6();
router6.get("/", ReviewController.getAllReviews);
router6.get("/:id", ReviewController.getReviewById);
router6.post(
  "/",
  auth_default("student" /* STUDENT */, "admin" /* ADMIN */),
  ReviewController.createReview
);
var ReviewRoutes = router6;

// src/middlewares/errorHandler.ts
import multer2 from "multer";
function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || "Internal Server Error";
  let details = null;
  if (statusCode === 500) {
    console.error("\u{1F6D1} SERVER ERROR:", err);
  }
  if (err instanceof prismaNamespace_exports.PrismaClientValidationError) {
    statusCode = 400;
    message = "Invalid request data";
    details = process.env.NODE_ENV === "development" ? err.message : "Validation failed";
  } else if (err instanceof prismaNamespace_exports.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002":
        statusCode = 409;
        message = "Duplicate value violates unique constraint";
        details = err.meta?.target ? `Field: ${err.meta.target}` : null;
        break;
      case "P2025":
        statusCode = 404;
        message = "Requested record not found";
        break;
      case "P2003":
        statusCode = 400;
        message = "Invalid reference (Foreign Key Constraint)";
        details = err.meta?.field_name ? `Invalid ID in: ${err.meta.field_name}` : null;
        break;
      default:
        statusCode = 400;
        message = "Database request error";
        details = process.env.NODE_ENV === "development" ? err.meta : null;
    }
  } else if (err instanceof prismaNamespace_exports.PrismaClientUnknownRequestError || err instanceof prismaNamespace_exports.PrismaClientRustPanicError || err instanceof prismaNamespace_exports.PrismaClientInitializationError) {
    statusCode = 500;
    message = "Database connection or internal error";
    details = null;
    console.error("\u{1F525} CRITICAL DB ERROR:", err);
  } else if (err instanceof multer2.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      statusCode = 400;
      message = "File is too large. Maximum limit is 5MB.";
    }
  }
  res.status(statusCode).json({
    success: false,
    message,
    ...details && { details },
    ...process.env.NODE_ENV === "development" && { stack: err.stack }
  });
}

// src/app.ts
var app = express();
app.use(
  cors({
    origin: [
      config_default.client_url,
      "http://192.168.9.142:3000"
      // Allow mobile access
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true
  })
);
app.use(express.json());
app.all("/api/auth/{*any}", toNodeHandler(auth));
app.use("/api/users", UserRoutes);
app.use("/api/tutors", TutorRoutes);
app.use("/api/bookings", BookingRoutes);
app.use("/api/admin", AdminRoutes);
app.use("/api/categories", CategoryRoutes);
app.use("/api/reviews", ReviewRoutes);
app.get("/health", (_req, res) => {
  res.status(200).send("OK");
});
app.get("/", (_req, res) => {
  res.send("SkillBridge API is running");
});
app.use(errorHandler);
var app_default = app;

// src/server.ts
var PORT = config_default.port;
var server;
async function main() {
  try {
    await prisma.$connect();
    console.log("Connected to the database successfully.");
    server = app_default.listen(PORT, () => {
      console.log(`SKILLBRIDGE Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("An error occurred:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}
main().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection detected:", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception detected:", err);
  process.exit(1);
});
var gracefulShutdown = async () => {
  console.log("Shutting down gracefully...");
  await prisma.$disconnect();
  if (server) {
    server.close(() => {
      console.log("Server closed.");
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};
process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);
