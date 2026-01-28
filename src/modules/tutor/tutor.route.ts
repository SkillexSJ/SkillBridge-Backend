import { Router } from "express";
import { TutorController } from "./tutor.controller";
import authMiddleware, { UserRole } from "../../middlewares/auth";

const router: Router = Router();

router.get("/", TutorController.getAllTutors);
router.get("/:id", TutorController.getTutorById);

// Protected routes
router.post(
  "/",
  authMiddleware(UserRole.STUDENT, UserRole.ADMIN, UserRole.TUTOR),
  TutorController.createTutorProfile,
);
router.put(
  "/availability",
  authMiddleware(UserRole.TUTOR),
  TutorController.updateAvailability,
);

export const TutorRoutes = router;
