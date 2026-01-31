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
  if (!user) {
    const error: any = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

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
    bookingsByStatus,
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
        status: { in: ["confirmed", "completed"] },
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
            image: true,
          },
        },
        tutorProfile: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
            category: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    }),

    // Bookings by Status
    prisma.booking.groupBy({
      by: ["status"],
      _count: {
        status: true,
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
      byStatus: bookingsByStatus.map((item) => ({
        status: item.status,
        count: item._count.status,
      })),
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
