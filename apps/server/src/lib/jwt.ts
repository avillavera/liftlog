import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  
  return secret;
};

export type JwtPayload = { userId: string };

export function signToken(payload: JwtPayload) {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: "7d" });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, getJwtSecret()) as JwtPayload;
}