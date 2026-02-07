import type { NextFunction, Request, Response } from "express";

export const notFound = (_req: Request, res: Response) => {
  res.status(404).json({ error: "Not found" });
};

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const isProd = process.env.NODE_ENV === "production";

  console.error(err);

  const payload: Record<string, unknown> = { error: "Server error" };
  if (!isProd && err instanceof Error) payload.message = err.message;

  res.status(500).json(payload);
};
