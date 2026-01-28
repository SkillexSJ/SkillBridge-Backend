import { Router } from "express";
import { BookingController } from "./booking.controller";

const router: Router = Router();

router.post("/", BookingController.createBooking);
router.get("/", BookingController.getMyBookings);
router.patch("/:id/status", BookingController.updateBookingStatus);

export const BookingRoutes = router;
