/**
 * NODE PACKAGES
 */
import { Router } from "express";
/**
 * CONTROLLER
 */
import { CategoryController } from "./category.controller";
/**
 * MIDDLEWARES
 */
import authMiddleware, { UserRole } from "../../middlewares/auth";

const router: Router = Router();

router.post(
  "/",
  authMiddleware(UserRole.ADMIN),
  CategoryController.createCategory,
);
router.get("/", CategoryController.getAllCategories);
router.get("/:id", CategoryController.getCategoryById);
router.delete(
  "/:id",
  authMiddleware(UserRole.ADMIN),
  CategoryController.deleteCategory,
);

export const CategoryRoutes = router;
