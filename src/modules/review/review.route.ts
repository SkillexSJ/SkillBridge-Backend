import { Router } from "express";
import { ReviewController } from "./review.controller";
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
