import prisma from "@/prisma";
import { ProductUpdateDTOSchema } from "@/schema";
import { Request, Response, NextFunction } from "express";

const updateProduct = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        // Validate request body
        const parsedBody = ProductUpdateDTOSchema.safeParse(req.body);
        if (!parsedBody.success) {
            return res.status(400).json({ error: parsedBody.error });
        }

        // check if product exists
        const product = await prisma.product.findUnique({
            where: {
                id: req.params.id,
            },
        });
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // update the product
        const updatedProduct = await prisma.product.update({
            where: {
                id: req.params.id,
            },
            data: parsedBody.data,
        });

        return res.status(200).json({ product: updatedProduct });

    } catch (error) {
        next(error);
    }
}

export default updateProduct;
