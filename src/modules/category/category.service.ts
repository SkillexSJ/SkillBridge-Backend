/**
 * NODE PACKAGES
 */
import { Category } from "../../generated/prisma/client";
/**
 * UTILS
 */
import { prisma } from "../../lib/prisma";
import { calculatePagination } from "../../utils/pagination";
/**
 * TYPES
 */
import { CategoryQueryParams } from "./category.type";

const createCategory = async (data: Category) => {
  return await prisma.category.create({
    data,
  });
};

const getAllCategories = async (params: CategoryQueryParams = {}) => {
  const { page, limit, skip } = calculatePagination(params);

  const [categories, total] = await Promise.all([
    prisma.category.findMany({
      include: {
        _count: {
          select: { tutorProfiles: true },
        },
      },
      skip,
      take: limit,
    }),
    prisma.category.count(),
  ]);

  return {
    data: categories,
    meta: {
      total,
      page,
      limit,
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
