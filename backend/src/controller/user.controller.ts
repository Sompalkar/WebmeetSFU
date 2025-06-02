import { Prisma, PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
 var jwtSecret= process.env.JWT_SECRET

const prisma= new PrismaClient()
  
export const registerUser = async( req:Request , res:Response)=>{

     const {userName, email, password}=req.body;

     console.log("-------------------------------------------------",req.body)


    try {

       const userCheck = await prisma.user.findFirst({
        where:{
            email:email
        }
       })


       if(userCheck?.email === email){
        return
       }



    const hashedPassword = await bcrypt.hash(password, 10);



     const user = await prisma.user.create({
        data:{
            email:email,
            name:userName,
            password: hashedPassword
            
        }
     })

     console.log(user)





      // (Optional) Create JWT token
    const token = jwt.sign({ userId: user.id }, jwtSecret as string);


    
     res.status(201).json({
      user: { id: user.id, name: user.name, email: user.email },
      token,
      message: "User registered successfully",
    });

        
    } catch (error) {

        console.error(error)

        res.status(100).json({"message":"Try with diffrent credentials"})
    }






}

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const existingUser = await prisma.user.findFirst({
      where: { email },
    });

    if (!existingUser || !existingUser.password) {
      return res.status(404).json({ message: "User not found, and password in undefined" });
    }

    const isPasswordValid = await bcrypt.compare(password, existingUser.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: existingUser.id }, jwtSecret as string, {
      expiresIn: "7d",
    });

    // res.cookie("token", token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production", // ensures HTTPS only in prod
    //   sameSite: "lax",
    //   maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    // });

    res.status(200).json({
      message: "Login successful",
      user: {
        id: existingUser.id,
        email: existingUser.email,
        userName: existingUser.name,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const updateUser =async( req:Request , res:Response)=>{
    
} 