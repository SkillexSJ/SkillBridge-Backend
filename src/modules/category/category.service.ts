import { prisma } from "../../lib/prisma";

const createCategory = async (data: any) => {
  return await prisma.category.create({
    data,
  });
};

const getAllCategories = async () => {
  return await prisma.category.findMany({
    include: {
      _count: {
        select: { tutorProfiles: true },
      },
    },
  });
};

export const CategoryService = {
  createCategory,
  getAllCategories,
};
