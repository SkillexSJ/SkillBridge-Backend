import { Request, Response } from "express";
import { BookingService } from "./booking.service";
import { asyncHandler } from "../../middlewares/asyncHandler";
import { sendSuccess } from "../../utils/response";

const createBooking = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const booking = await BookingService.createBooking(userId, req.body);
  sendSuccess(res, { data: booking }, "Booking created successfully", 201);
});

const getMyBookings = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const role = req.user?.role?.toLowerCase(); // user.role is uppercase in middleware
  
  const result = await BookingService.getUserBookings(userId, role || "student", req.query);
  sendSuccess(res, result, "Bookings fetched successfully");
});

const updateBookingStatus = asyncHandler(async (req: Request, res: Response) => {
    // Only tutor or admin should do this (checked by middleware)
    const { id } = req.params;
    const { status } = req.body;
    
    const result = await BookingService.updateBookingStatus(id as string, status);
    sendSuccess(res, { data: result }, "Booking status updated successfully");
});

export const BookingController = {
  createBooking,
  getMyBookings,
  updateBookingStatus,
};
