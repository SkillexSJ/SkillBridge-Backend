import { Category } from "../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createCategory = async (data: Category) => {
  return await prisma.category.create({
    data,
  });
};

const getAllCategories = async () => {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { tutorProfiles: true },
      },
    },
  });

  const totalTutors = categories.reduce(
    (sum, cat) => sum + (cat._count?.tutorProfiles || 0),
    0,
  );

  return {
    data: categories,
    meta: {
      totalCategories: categories.length,
      totalTutors,
    },
  };
};

const getCategoryById = async (id: string) => {
  return await prisma.category.findUniqueOrThrow({
    where: { id },
    include: {
      _count: {
        select: { tutorProfiles: true },
      },
    },
  });
};

const deleteCategory = async (id: string) => {
  return await prisma.category.delete({
    where: { id },
  });
};

export const CategoryService = {
  createCategory,
  getAllCategories,
  getCategoryById,
  deleteCategory,
};
