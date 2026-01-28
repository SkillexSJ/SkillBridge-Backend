import { Router } from "express";
import { UserController } from "./user.controller";

const router = Router();

// Routes
// Assuming global auth middleware protects these or we add it here.
router.get("/profile", UserController.getProfile);
router.patch("/profile", UserController.updateProfile);

export const UserRoutes = router;
