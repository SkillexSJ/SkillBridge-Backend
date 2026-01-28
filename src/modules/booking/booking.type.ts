import { BookingStatus, Prisma } from "../../generated/prisma/client";
import { BaseQueryParams } from "../../interfaces";

export interface CreateBookingInput {
  tutorProfileId: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  totalPrice: number | string;
}

export interface BookingQueryParams extends BaseQueryParams {
  status?: BookingStatus;
}

export type BookingDetails = Prisma.BookingGetPayload<{
  include: {
    student: { select: { name: true; email: true; image: true } };
    tutorProfile: {
      include: {
        user: { select: { name: true; image: true; email: true } };
      };
    };
  };
}>;
