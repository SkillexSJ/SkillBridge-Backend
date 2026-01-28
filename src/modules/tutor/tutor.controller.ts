import { Request, Response } from "express";
import { TutorService } from "./tutor.service";
import { asyncHandler } from "../../middlewares/asyncHandler";
import { sendSuccess } from "../../utils/response";

const getAllTutors = asyncHandler(async (req: Request, res: Response) => {
  const result = await TutorService.getAllTutors(req.query);
  sendSuccess(res, result, "Tutors fetched successfully");
});

const getTutorById = asyncHandler(async (req: Request, res: Response) => {
  const tutor = await TutorService.getTutorById(req.params.id as string);
  if (!tutor) {
    res.status(404).json({ message: "Tutor not found" });
    return;
  }
  sendSuccess(res, { data: tutor }, "Tutor fetched successfully");
});

const createTutorProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const tutor = await TutorService.createTutorProfile(userId, req.body);
  sendSuccess(res, { data: tutor }, "Tutor profile created successfully", 201);
});

const updateAvailability = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;

  // Fetch tutor profile for this user
  const { prisma } = require("../../lib/prisma");
  const profile = await prisma.tutorProfile.findUnique({ where: { userId } });

  if (!profile) {
    res.status(404).json({ message: "Tutor profile not found" });
    return;
  }

  const slots = await TutorService.updateAvailability(
    profile.id,
    req.body.slots,
  );
  sendSuccess(res, { data: slots }, "Availability updated successfully");
});

export const TutorController = {
  getAllTutors,
  getTutorById,
  createTutorProfile,
  updateAvailability,
};
