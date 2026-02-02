/**
 * NODE PACKAGES
 */
import { prisma } from "../../lib/prisma";
/**
 * PRISMA CLIENT
 */
import { BookingStatus, Prisma, Booking } from "../../generated/prisma/client";
/**
 * UTILS
 */
import { calculatePagination } from "../../utils/pagination";
/**
 * TYPES
 */
import {
  CreateBookingInput,
  BookingQueryParams,
  BookingDetails,
} from "./booking.type";

const createBooking = async (
  studentId: string,
  data: CreateBookingInput,
): Promise<Booking> => {
  const { tutorProfileId, sessionDate, startTime, endTime, totalPrice } = data;

  const booking = await prisma.booking.create({
    data: {
      studentId,
      tutorProfileId,
      sessionDate: new Date(sessionDate),
      startTime: new Date(`1970-01-01T${startTime}`),
      endTime: new Date(`1970-01-01T${endTime}`),
      totalPrice: Number(totalPrice),
      status: "pending",
    },
  });
  return booking;
};

const getUserBookings = async (
  userId: string,
  role: string,
  params: BookingQueryParams = {},
): Promise<{
  data: any[];
  meta: { total: number; page: number; limit: number };
}> => {
  const { status } = params;
  const { page, limit, skip } = calculatePagination(params);

  const where: Prisma.BookingWhereInput = {};

  if (status) {
    where.status = status;
  }

  if (role === "tutor") {
    const tutorProfile = await prisma.tutorProfile.findUnique({
      where: { userId },
    });
    if (!tutorProfile) {
      return {
        data: [],
        meta: { total: 0, page, limit },
      };
    }
    where.tutorProfileId = tutorProfile.id;
  } else if (role !== "admin") {
    where.studentId = userId;
  }

  // role based query
  const include: Prisma.BookingInclude =
    role === "admin"
      ? {
          student: { select: { name: true, image: true, email: true } },
          tutorProfile: {
            include: {
              user: { select: { name: true, image: true, email: true } },
            },
          },
        }
      : role === "tutor"
        ? {
            student: { select: { name: true, image: true, email: true } },
            tutorProfile: {
              include: {
                category: { select: { name: true } },
              },
            },
          }
        : {
            tutorProfile: {
              include: {
                user: { select: { name: true, image: true } },
                category: { select: { name: true } },
              },
            },
            review: { select: { id: true } },
          };

  // booking + total count
  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      where,
      include,
      orderBy: { sessionDate: "desc" },
      skip,
      take: limit,
    }),
    prisma.booking.count({ where }),
  ]);

  return {
    data: bookings,
    meta: {
      total,
      page,
      limit,
    },
  };
};

const getBookingById = async (
  id: string,
  userId: string,
  role: string,
): Promise<BookingDetails> => {
  // booking with tutor and student
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      student: { select: { name: true, email: true, image: true } },
      tutorProfile: {
        include: {
          user: { select: { name: true, image: true, email: true } },
        },
      },
    },
  });

  if (!booking) {
    const error: any = new Error("Booking not found");
    error.statusCode = 404;
    throw error;
  }
  // admin shob pabe
  if (role === "admin") return booking;

  // Check access
  const isStudent = booking.studentId === userId;
  const isTutor = booking.tutorProfile.userId === userId;

  if (!isStudent && !isTutor) {
    const error: any = new Error("Forbidden");
    error.statusCode = 403;
    throw error;
  }

  return booking;
};

const updateBookingStatus = async (
  bookingId: string,
  status: BookingStatus,
  userId: string,
  role: string,
): Promise<Booking> => {
  const result = await prisma.$transaction(async (tx) => {
    // Get current booking
    const existingBooking = await tx.booking.findUnique({
      where: { id: bookingId },
      include: { tutorProfile: true },
    });

    if (!existingBooking) {
      const error: any = new Error("Booking not found");
      error.statusCode = 404;
      throw error;
    }

    //Cancellation and Update Rules
    if (role === "student") {
      // Students can only UPDATE status to 'cancelled'
      if (status !== "cancelled") {
        const error: any = new Error("Students can only cancel bookings");
        error.statusCode = 403;
        throw error;
      }

      // only in pending mode
      if (existingBooking.status !== "pending") {
        const error: any = new Error(
          "You can only cancel pending bookings. Valid bookings cannot be cancelled.",
        );
        error.statusCode = 400;
        throw error;
      }

      // ownership
      if (existingBooking.studentId !== userId) {
        const error: any = new Error("Forbidden");
        error.statusCode = 403;
        throw error;
      }
    } else if (role === "tutor") {
      //  ownership
      if (existingBooking.tutorProfile.userId !== userId) {
        const error: any = new Error(
          "Forbidden: You can only update your own bookings",
        );
        error.statusCode = 403;
        throw error;
      }

      if (existingBooking.status === "completed" && status === "cancelled") {
        const error: any = new Error("Cannot cancel a completed booking");
        error.statusCode = 400;
        throw error;
      }
    }

    // Update Status
    const booking = await tx.booking.update({
      where: { id: bookingId },
      data: { status },
    });

    // update Tutor stats
    if (status === "completed") {
      const durationMs =
        new Date(booking.endTime).getTime() -
        new Date(booking.startTime).getTime();
      const durationMins = Math.floor(durationMs / (1000 * 60));

      await tx.tutorProfile.update({
        where: { id: booking.tutorProfileId },
        data: {
          totalSessions: { increment: 1 },
          totalMentoringMins: { increment: durationMins },
        },
      });
    }

    return booking;
  });

  return result;
};

export const BookingService = {
  createBooking,
  getUserBookings,
  getBookingById,
  updateBookingStatus,
};
