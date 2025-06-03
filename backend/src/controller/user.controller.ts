import { Prisma, PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
var jwtSecret = process.env.JWT_SECRET;

const prisma = new PrismaClient();

export const registerUser = async (req: Request, res: Response) => {
  const { userName, email, password } = req.body;
  console.log("-------------------------------------------------", req.body);

  try {
    const userCheck = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (userCheck?.email === email) {
      res.status(400).json({ message: "User already registered" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email: email,
        name: userName,
        password: hashedPassword,
      },
    });

    console.log(user);

    // (Optional) Create JWT token
    const token = jwt.sign({ userId: user.id }, jwtSecret as string);

    res.status(201).json({
      user: { id: user.id, name: user.name, email: user.email },
      token,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(100).json({ message: "Try with diffrent credentials" });
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email, password } = req.body;

  try {
    const existingUser = await prisma.user.findFirst({
      where: { email },
    });

    if (!existingUser || !existingUser.password) {
      res.status(404).json({ message: "User not found or password undefined" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign({ userId: existingUser.id }, jwtSecret as string);

    res
      .cookie("token", token, {
        httpOnly: true,
      })
      .json({
        message: "Login successful",
        user: {
          id: existingUser.id,
          email: existingUser.email,
          userName: existingUser.name,
        },
      });

    // res.status(200).json();
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  try {
    const userCheck = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!userCheck) {
      res.status(400).json({ message: "User Not found with this record" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedUser = await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        name: username,
        password: hashedPassword,
      },
    });

    res
      .status(200)
      .json({
        message: "User updated successfully ",
        user: { username: updatedUser.name },
      });
  } catch (error) {
    console.error(error);
    res
      .status(400)
      .json({ message: " Incorrect Credentials try with diffrent email" });
  }
};

export const getUser = async (req: Request, res: Response) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      id: user.id,
      username: user.name,
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
