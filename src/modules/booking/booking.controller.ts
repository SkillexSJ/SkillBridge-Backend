/**
 * NODE PACKAGES
 */
import { Request, Response } from "express";

/**
 * SERVICES
 */
import { BookingService } from "./booking.service";

/**
 * MIDDLEWARES
 */
import { asyncHandler } from "../../middlewares/asyncHandler";

/**
 * UTILS
 */
import { sendSuccess } from "../../utils/response";

const createBooking = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const booking = await BookingService.createBooking(userId, req.body);
  sendSuccess(res, { data: booking }, "Booking created successfully", 201);
});

const getMyBookings = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const role = req.user?.role;

  const result = await BookingService.getUserBookings(
    userId,
    role as string,
    req.query,
  );
  sendSuccess(res, result, "Bookings fetched successfully");
});

const getBookingById = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const role = req.user!.role;

  const booking = await BookingService.getBookingById(
    req.params.id as string,
    userId,
    role as string,
  );

  sendSuccess(res, { data: booking }, "Booking fetched successfully");
});

const updateBookingStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    const userId = req.user!.id;
    const role = req.user!.role;

    const result = await BookingService.updateBookingStatus(
      id as string,
      status,
      userId,
      role,
    );
    sendSuccess(res, { data: result }, "Booking status updated successfully");
  },
);

export const BookingController = {
  createBooking,
  getMyBookings,
  getBookingById,
  updateBookingStatus,
};
