/**
 * NODE PACKAGES
 */
import { Prisma } from "../../generated/prisma/client";
/**
 * UTILS
 */
import { prisma } from "../../lib/prisma";

const getProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      tutorProfile: true,
    },
  });
  return user;
};

const updateProfile = async (userId: string, data: Prisma.UserUpdateInput) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data,
  });
  return user;
};

const getStudentDashboardStats = async (userId: string) => {
  const [completedBookings, activeBookings, totalSpent, user] =
    await Promise.all([
      // Total Completed Bookings
      prisma.booking.count({
        where: {
          studentId: userId,
          status: "completed",
        },
      }),

      // Active Bookings
      prisma.booking.count({
        where: {
          studentId: userId,
          status: { in: ["pending", "confirmed"] },
        },
      }),

      // Total Spent
      prisma.booking.aggregate({
        _sum: {
          totalPrice: true,
        },
        where: {
          studentId: userId,
          status: { in: ["completed", "confirmed"] },
        },
      }),

      // joined date
      prisma.user.findUnique({
        where: { id: userId },
        select: { createdAt: true },
      }),
    ]);

  return {
    completedBookings,
    activeBookings,
    totalSpent: totalSpent._sum.totalPrice || 0,
    joinedAt: user?.createdAt,
  };
};

export const UserService = {
  getProfile,
  updateProfile,
  getStudentDashboardStats,
};
