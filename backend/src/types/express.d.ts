import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      userId?: string; // Matches the type used in your JWT payload
    }
  }
}

// If you want to type the JWT payload
declare module "jsonwebtoken" {
  interface JwtPayload {
    userId: string;
  }
}