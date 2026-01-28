import { Router } from "express";
import { AdminController } from "./admin.controller";
import authMiddleware, { UserRole } from "../../middlewares/auth";

const router: Router = Router();

router.get("/users", authMiddleware(UserRole.ADMIN), AdminController.getAllUsers);
router.patch(
  "/users/:id",
  authMiddleware(UserRole.ADMIN),
  AdminController.blockUser,
);

export const AdminRoutes = router;
