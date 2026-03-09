import { Router } from "express";
import {
  createSession,
  getSessions,
  getSessionById,
  deleteSession,
} from "../controllers/session.controller.js";
import { createEntry } from "../controllers/entry.controller.js";
import { requireAuth } from "../middleware/requireAuth.js";

export const sessionsRouter = Router();

sessionsRouter.post("/", requireAuth, createSession);
sessionsRouter.get("/", requireAuth, getSessions);
sessionsRouter.get("/:id", requireAuth, getSessionById);
sessionsRouter.delete("/:id", requireAuth, deleteSession);
sessionsRouter.post("/:id/entries", requireAuth, createEntry);