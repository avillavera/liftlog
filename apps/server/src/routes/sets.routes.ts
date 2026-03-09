import { Router } from "express";
import { updateSet, deleteSet} from "../controllers/set.controller.js";
import { requireAuth } from "../middleware/requireAuth.js";

export const setsRouter = Router();

setsRouter.put("/:id", requireAuth, updateSet);
setsRouter.delete("/:id", requireAuth, deleteSet);