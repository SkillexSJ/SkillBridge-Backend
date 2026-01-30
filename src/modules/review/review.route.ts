/**
 * NODE PACKAGES
 */
import { Router } from "express";
/**
 * CONTROLLER
 */
import { ReviewController } from "./review.controller";
/**
 * MIDDLEWARES
 */
import authMiddleware, { UserRole } from "../../middlewares/auth";

const router: Router = Router();

router.get("/", ReviewController.getAllReviews);
router.get("/:id", ReviewController.getReviewById);
router.post(
  "/",
  authMiddleware(UserRole.STUDENT, UserRole.ADMIN),
  ReviewController.createReview,
);

export const ReviewRoutes = router;
