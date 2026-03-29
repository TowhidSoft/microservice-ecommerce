import { UserCreateSchema } from "@/schema";
import prisma from "../prisma";
import { Request, Response, NextFunction } from "express";
import bcrypt from 'bcryptjs'
import { EMAIL_SERVICE, USER_SERVICE } from "@/config";
import axios from "axios";

const generateVerificationCode = () => {
  // Get current timestamp in milliseconds
  const timestamp = new Date().getTime().toString();

  // Generate a random 2-digit number
  const randomNum = Math.floor(10 + Math.random() * 90);

  // Combine timestamp and random numbaear and extract last 5 digits
  let code = (timestamp + randomNum).slice(-5);

  return code;
}

const UserRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Validate request body
    const parsedBody = UserCreateSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({ error: parsedBody.error });
    }

    // check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: parsedBody.data.email,
      },
    });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(parsedBody.data.password, salt);

    // create the auth user
    const user = await prisma.user.create({
      data: {
        ...parsedBody.data,
        password: hashedPassword
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        verified: true
      }
    })

    console.log("User created: ", user)

    // create the user profile by calling the user service
    await axios.post(`${USER_SERVICE}/users`, {
      authUserId: user.id,
      name: user.name,
      email: user.email
    });


    // generate verification code
    const code = generateVerificationCode();
    await prisma.verificationCode.create({
      data: {
        userId: user.id,
        code,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours
      }
    })

    // send verification email
    axios.post(`${EMAIL_SERVICE}/emails/send`, {
      recipient: user.email,
      subject: 'Email Verification',
      body: `Your verification code is ${code}`,
      source: 'user-registration'
    })



    return res.status(201).json({ message: "User created. Check your email for verification code", user })

  } catch (err) {
    next(err);
  }
};

export default UserRegistration;
