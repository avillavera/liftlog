import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { getExercises } from "../controllers/exercise.controller.js";

export const exercisesRouter = Router();

exercisesRouter.get("/", requireAuth, getExercises);

