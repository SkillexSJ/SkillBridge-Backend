import { Router } from "express";
import { CategoryController } from "./category.controller";
import authMiddleware, { UserRole } from "../../middlewares/auth";

const router: Router = Router();

router.post("/", CategoryController.createCategory);
router.get("/", CategoryController.getAllCategories);
router.get("/:id", CategoryController.getCategoryById);
router.delete(
  "/:id",
  authMiddleware(UserRole.ADMIN),
  CategoryController.deleteCategory,
);

export const CategoryRoutes = router;
