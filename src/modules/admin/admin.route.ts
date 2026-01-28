import { Router } from "express";
import { AdminController } from "./admin.controller";

const router: Router = Router();

// Should have admin middleware check
router.get("/users", AdminController.getAllUsers);
router.patch("/users/:id", AdminController.blockUser);

export const AdminRoutes = router;
