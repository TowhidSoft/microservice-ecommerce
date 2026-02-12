import { ProductCreateDTOSchema } from "@/schema";
import prisma from "../prisma";
import { Request, Response, NextFunction } from "express";

const createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsedBody = ProductCreateDTOSchema.safeParse(req.body);
        if (!parsedBody.success) {
            return res.status(400).json({ error: parsedBody.error })
        }

        // Create Inventory
        const inventory = await prisma.inventory.create({
            data: {
                ...parsedBody.data,
                histories: {
                    create: {
                        actionType: 'IN',
                        quantityChanged: parsedBody.data.quantity,
                        lastQuantity: 0,
                        newQuantity: parsedBody.data.quantity,
                    }
                }
            },
            select: {
                id: true,
                quantity: true
            }
        });
        return res.status(201).json(inventory);

    } catch (error) {
        next(error);
    }
}

export default createInventory;