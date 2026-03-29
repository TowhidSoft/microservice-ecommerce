import { User } from "@prisma/client";
import prisma from "../prisma";
import { Request, Response, NextFunction } from "express";

// /users/:id?field=id | authUserId
const createInventory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id as string;
        const field = req.query.field as string;

        let user: User | null = null;

        if (field === 'authUserId') {
            user = await prisma.user.findUnique({ where: { authUserId: id } })
        } else {
            user = await prisma.user.findUnique({ where: { id } })
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }
        return res.json(user);

    } catch (error) {
        next(error);
    }
}

export default createInventory;