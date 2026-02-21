
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

        return res.json({data: products})
    } catch (err) {
        
    }
}
export default getProducts;