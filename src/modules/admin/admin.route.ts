/**
 * NODE PACKAGES
 */
import { Router } from "express";

/**
 * CONTROLLER
 */
import { AdminController } from "./admin.controller";

/**
 * MIDDLEWARES
 */
import authMiddleware, { UserRole } from "../../middlewares/auth";

const router: Router = Router();

router.get(
  "/stats",
  authMiddleware(UserRole.ADMIN),
  AdminController.getDashboardStats,
);

router.get(
  "/users",
  authMiddleware(UserRole.ADMIN),
  AdminController.getAllUsers,
);
router.patch(
  "/users/:id",
  authMiddleware(UserRole.ADMIN),
  AdminController.blockUser,
);

export const AdminRoutes = router;
