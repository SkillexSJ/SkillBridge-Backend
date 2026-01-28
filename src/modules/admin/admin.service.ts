import { prisma } from "../../lib/prisma";
import { calculatePagination } from "../../utils/pagination";
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
    data: { isVerified: !user.isVerified },
  });
};

export const AdminService = {
  getAllUsers,
  blockUser,
};
