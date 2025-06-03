import { Prisma, PrismaClient } from "@prisma/client";
import { Request, Response,NextFunction } from "express";
import jwt from "jsonwebtoken";


const prisma= new PrismaClient()


const jwt_secret= process.env.JWT_SECRET

export const authMiddleware = (req :Request, res:Response, next:NextFunction) => {
    const token = req.cookies?.token;
  
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
  
    try {
      const decoded = jwt.verify(token, jwt_secret as string);
    //  @ts-ignore
      req.userId = decoded.userId;

      next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  };
  