import { Request, Response } from "express";
import { TutorService } from "./tutor.service";
import { asyncHandler } from "../../middlewares/asyncHandler";

const getAllTutors = asyncHandler(async (req: Request, res: Response) => {
  const tutors = await TutorService.getAllTutors(req.query);
  res.status(200).json({
    success: true,
    data: tutors,
  });
});

const getTutorById = asyncHandler(async (req: Request, res: Response) => {
  const tutor = await TutorService.getTutorById(req.params.id);
  if (!tutor) {
     res.status(404).json({ message: "Tutor not found" });
     return;
  }
  res.status(200).json({
    success: true,
    data: tutor,
  });
});

const createTutorProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).session?.user?.id || (req as any).user?.id;
  if (!userId) {
     res.status(401).json({ message: "Unauthorized" });
     return;
  }
  const tutor = await TutorService.createTutorProfile(userId, req.body);
  res.status(201).json({
    success: true,
    data: tutor,
  });
});

const updateAvailability = asyncHandler(async (req: Request, res: Response) => {
  // Expecting tutorProfileId or inferring from user
  const userId = (req as any).session?.user?.id || (req as any).user?.id;
  
  // Fetch tutor profile for this user
  // This is a quick lookup; in production maybe simpler to have tutorProfileId in token or fetch once.
  const { prisma } = require("../../lib/prisma"); 
  const profile = await prisma.tutorProfile.findUnique({ where: { userId } });
  
  if (!profile) {
      res.status(404).json({ message: "Tutor profile not found" });
      return;
  }

  const slots = await TutorService.updateAvailability(profile.id, req.body.slots);
  res.status(200).json({
    success: true,
    data: slots,
  });
});

export const TutorController = {
  getAllTutors,
  getTutorById,
  createTutorProfile,
  updateAvailability,
};
