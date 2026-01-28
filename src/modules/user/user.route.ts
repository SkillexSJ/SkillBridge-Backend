import { Router } from "express";
import { UserController } from "./user.controller";
import authMiddleware, { UserRole } from "../../middlewares/auth";

const router: Router = Router();

// Routes
router.get(
  "/profile",
  authMiddleware(UserRole.ADMIN, UserRole.STUDENT, UserRole.TUTOR),
  UserController.getProfile,
);
router.patch(
  "/profile",
  authMiddleware(UserRole.ADMIN, UserRole.STUDENT, UserRole.TUTOR),
  UserController.updateProfile,
);

export const UserRoutes = router;
