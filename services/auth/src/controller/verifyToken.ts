import { AccessToken } from "@/schema";
import prisma from "../prisma";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const verifyToken = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // Validate request body
        const parsedBody = AccessToken.safeParse(req.body);
        if (!parsedBody.success) {
            return res.status(400).json({ error: parsedBody.error });
        }

        const { accessToken } = parsedBody.data;
        try {
            const decoded = jwt.verify(accessToken, process.env.JWT_SECRET as string);
            const user = await prisma.user.findUnique({
                where: { id: (decoded as any).userId },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                }
            });

            if (!user) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            return res.status(200).json({ message: "Authorized", user })
        } catch (error) {
            console.log('[auth service]', error)
            return res.status(401).json({
                message: (error as any).name === 'TokenExpiredError' ? 'Token Expired' : 'Invalid Token',
                error: (error as any).message
            });
        }
    } catch (error) {
        next(error);
    }
}

export default verifyToken;