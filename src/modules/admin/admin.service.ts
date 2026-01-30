/**
 * LIBS
 */
import { prisma } from "../../lib/prisma";

/**
 * UTILS
 */
import { calculatePagination } from "../../utils/pagination";

/**
 * TYPES
 */
import { UserQueryParams } from "./admin.type";

const getAllUsers = async (params: UserQueryParams = {}) => {
  const { page, limit, skip } = calculatePagination(params);

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      include: {
        tutorProfile: true,
      },
      skip,
      take: limit,
    }),
    prisma.user.count(),
  ]);

  return {
    data: users,
    meta: {
      total,
      page,
      limit,
    },
  };
};

const blockUser = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");

  return await prisma.user.update({
    where: { id: userId },
    data: { isBlocked: !user.isBlocked },
  });
};

// Dashboard related
const getDashboardStats = async () => {
  const [
    totalStudents,
    totalTutors,
    totalBookings,
    totalRevenue,
    activeTutors,
    recentBookings,
  ] = await Promise.all([
    // Total Students
    prisma.user.count({ where: { role: "student" } }),

    // Total Tutors
    prisma.tutorProfile.count(),

    // Total Bookings
    prisma.booking.count(),

    // Total Revenue
    prisma.booking.aggregate({
      _sum: {
        totalPrice: true,
      },
      where: {
        status: "completed",
      },
    }),

    // Active Tutors
    prisma.booking.groupBy({
      by: ["tutorProfileId"],
      _count: {
        tutorProfileId: true,
      },
    }),

    // Recent Bookings
    prisma.booking.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        student: {
          select: {
            name: true,
            email: true,
          },
        },
        tutorProfile: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    }),
  ]);

  return {
    users: {
      students: totalStudents,
      tutors: totalTutors,
      activeTutors: activeTutors.length,
    },
    bookings: {
      total: totalBookings,
      recent: recentBookings,
    },
    revenue: {
      total: totalRevenue._sum.totalPrice || 0,
    },
  };
};

export const AdminService = {
  getAllUsers,
  blockUser,
  getDashboardStats,
};
