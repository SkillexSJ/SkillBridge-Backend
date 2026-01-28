import { prisma } from "../../lib/prisma";

const createReview = async (studentId: string, data: any) => {
  const { bookingId, rating, comment } = data;
  
  // Verify booking exists and belongs to student
  const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { review: true }
  });
  
  if (!booking) throw new Error("Booking not found");
  if (booking.studentId !== studentId) throw new Error("Unauthorized");
  if (booking.review) throw new Error("Review already exists");

  return await prisma.review.create({
    data: {
      bookingId,
      studentId,
      tutorProfileId: booking.tutorProfileId,
      rating: parseFloat(rating),
      comment,
    },
  });
};

export const ReviewService = {
  createReview,
};
