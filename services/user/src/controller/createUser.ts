import { UserCreateSchema } from "@/schema";
import prisma from "../prisma";
import { Request, Response, NextFunction } from "express";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsedBody = UserCreateSchema.safeParse(req.body);
        if (!parsedBody.success) {
            return res.status(400).json({ error: parsedBody.error })
        }

        // Create Inventory
        const existingUser   = await prisma.user.findUnique({
            where: {
                authUserId: parsedBody.data.authUserId,
            }
        });         
        if(existingUser) {
            return res.status(400).json({ error: 'User already exists' })
        }
        const user = await prisma.user.create({
            data: parsedBody.data,
        });
        return res.status(201).json(user);

    } catch (error) {
        next(error);
    }
}

export default createUser;