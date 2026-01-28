import { Router } from "express";
import { BookingController } from "./booking.controller";
import authMiddleware, { UserRole } from "../../middlewares/auth";

const router: Router = Router();

router.post(
  "/",
  authMiddleware(UserRole.STUDENT),
  BookingController.createBooking,
);
router.get(
  "/",
  authMiddleware(UserRole.STUDENT, UserRole.TUTOR),
  BookingController.getMyBookings,
);
router.patch(
  "/:id/status",
  authMiddleware(UserRole.TUTOR, UserRole.ADMIN),
  BookingController.updateBookingStatus,
);

export const BookingRoutes = router;
