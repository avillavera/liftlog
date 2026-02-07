import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../lib/jwt.js";

// Custom type to add userId to request
export type AuthedRequest = Request & { userId: string };

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  // Authorization: Bearer <JWT_TOKEN_HERE>  
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing auth token" });
  }

  const token = header.slice("Bearer ".length).trim();

  try {
    const payload = verifyToken(token);
    (req as AuthedRequest).userId = payload.userId;
    next();
  } 
  catch {
    return res.status(401).json({ error: "Invalid auth token" });
  }
}