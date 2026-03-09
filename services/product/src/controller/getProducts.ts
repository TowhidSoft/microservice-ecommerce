
import { NextFunction, Request, Response } from 'express';
import prisma from './../prisma';

const getProducts = async (
    _req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const products = await prisma.product.findMany({
            select:{
                id: true,
                sku: true,
                name: true,
                price: true,
                inventoryId: true
            }
        })

        // Implement pagination
        // Implement filtering

        return res.json({message: "Products fetched successfully", total: products.length, data: products})
    } catch (err) {
        next(err)
    }
}
export default getProducts;