import { Router } from "express";
import { deleteEntry } from "../controllers/entry.controller.js";
import { createSet } from "../controllers/set.controller.js";
import { requireAuth } from "../middleware/requireAuth.js";

export const entriesRouter = Router();

entriesRouter.delete("/:id", requireAuth, deleteEntry);
entriesRouter.post("/:id/sets", requireAuth, createSet);