import { prisma } from "../../lib/prisma";
import { Prisma } from "../../generated/prisma/client";

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

export const UserService = {
  getProfile,
  updateProfile,
};
