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

  return {
    data: categories,
    meta: {
      total: categories.length,
      page: 1,
      limit: categories.length,
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
