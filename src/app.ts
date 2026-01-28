import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import { UserRoutes } from "./modules/user/user.route";
import { TutorRoutes } from "./modules/tutor/tutor.route";
import { BookingRoutes } from "./modules/booking/booking.route";
import { AdminRoutes } from "./modules/admin/admin.route";
import { CategoryRoutes } from "./modules/category/category.route";
import { ReviewRoutes } from "./modules/review/review.route";
import { errorHandler } from "./middlewares/errorHandler";

const app: Application = express();

app.use(
  cors({
    origin: process.env.APP_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  }),
);

app.use(express.json());

app.all("/api/auth/{*any}", toNodeHandler(auth));

//  Routes
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

export default app;
