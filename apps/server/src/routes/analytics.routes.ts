import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { getExercise1RMProgress } from "../controllers/analytics.controller.js";

export const analyticsRouter = Router();

analyticsRouter.get("/exercises/:exerciseId/1rm", requireAuth, getExercise1RMProgress);