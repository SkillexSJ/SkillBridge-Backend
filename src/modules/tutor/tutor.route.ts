import { Router } from "express";
import { TutorController } from "./tutor.controller";

const router = Router();

router.get("/", TutorController.getAllTutors);
router.get("/:id", TutorController.getTutorById);

// Protected routes (need auth middleware in app.ts or here)
router.post("/profile", TutorController.createTutorProfile);
router.put("/availability", TutorController.updateAvailability);

export const TutorRoutes = router;
